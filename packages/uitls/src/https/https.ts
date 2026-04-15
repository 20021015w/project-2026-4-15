import axios, { AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse } from "axios";

export class Http {
  private static HttpConfig = {
    baseUrl: '/',
    unAuthority: '403'  // 未授权状态码
  };

  /** 异常拦截 */
  private static exceptionIntercepter?: (err: any) => void;
  /** 响应成功拦截 */
  private static responseIntercepter?: (data: any) => void;
  /** axios 实例 */
  private static axiosInstance = axios.create();
  /** 是否在刷新token */
  private static isRefreshing: boolean = false;
  /** 请求队列 */
  private static requestQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    config: AxiosRequestConfig;
  }> = [];

  /** 自定义处理异常 */
  static setExceptionIntercepter(fn: any) {
    this.exceptionIntercepter = fn;
  }

  /** 自定义处理响应 */
  static setResponseIntercepter(fn: any) {
    this.responseIntercepter = fn;
  }

  static request<T>(config: AxiosRequestConfig): AxiosPromise<T> {
    return this.axiosInstance.request(config)
  }

  static get = <T, D>(
    url: string,
    params?: D,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> => {
    return Http.request({
      method: 'GET',
      url,
      params,
      ...config
    });
  };

  static post = <T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): AxiosPromise<T> => {
    return Http.request({
      method: 'POST',
      url,
      data,
      ...config
    });
  };

  static initHttp(config: any) {
    this.HttpConfig = { ...this.HttpConfig, ...config };

    // 设置基础URL
    this.axiosInstance.defaults.baseURL = this.HttpConfig.baseUrl;

    // 请求拦截器（添加token）
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(config,'config')
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 成功回调
        return new Promise((resolve) => {
          if (this.responseIntercepter) {
            const result = this.responseIntercepter(response);
            resolve(result !== undefined ? result : response.data?.data || response.data);
          } else {
            resolve(response.data?.data || response.data);
          }
        });
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // 检查是否是未授权错误
        const isUnAuth = error.response?.status === 401 ||
          error.code === this.HttpConfig.unAuthority;

        if (isUnAuth && !originalRequest._retry) {
          // 如果正在刷新token，将请求加入队列
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.requestQueue.push({ resolve, reject, config: originalRequest });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // 尝试刷新token
            const newToken = await this.refreshToken();

            // 更新localStorage中的token
            localStorage.setItem('accessToken', newToken);

            // 重试队列中的所有请求
            this.requestQueue.forEach(({ resolve, reject, config }) => {
              // 更新请求头中的 token
              if (config.headers) {
                config.headers.Authorization = `Bearer ${newToken}`;
              } else {
                config.headers = { Authorization: `Bearer ${newToken}` };
              }
              this.axiosInstance.request(config)
                .then(resolve)
                .catch(reject);
            });
            this.requestQueue = [];

            // 重试当前请求
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // 刷新失败，清空队列并跳转登录
            this.requestQueue.forEach(({ reject }) => {
              reject(refreshError);
            });
            this.requestQueue = [];

            // 清除本地token
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            // 调用异常拦截器
            if (this.exceptionIntercepter) {
              this.exceptionIntercepter(refreshError);
            }

            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // 其他错误或刷新失败
        if (this.exceptionIntercepter) {
          this.exceptionIntercepter(error);
        }
        return Promise.reject(error);
      }
    );
  }

  // 刷新token的方法
  private static async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    try {
      const response = await this.axiosInstance.post('/auth/refresh', {
        refreshToken: refreshToken
      });

      const newAccessToken = response.data?.data?.accessToken || response.data?.accessToken;
      if (!newAccessToken) {
        throw new Error('Refresh failed');
      }

      return newAccessToken;
    } catch (error) {
      throw error;
    }
  }
}