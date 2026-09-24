import axios, { AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse } from "axios";

export class Http {
  private static HttpConfig = {
    baseUrl: "/",
    unAuthority: 403,
  };
  private static exceptionIntercepter?: (err: any) => void;
  private static responseIntercepter?: (data: any) => void;
  private static axiosInstance = axios.create();
  private static isRefreshing: boolean = false;
  private static requestQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    config: AxiosRequestConfig;
  }> = [];
  // ✅ 标记是否已经初始化拦截器，防止重复注册
  private static inited = false;

  static setExceptionIntercepter(fn: (err: any) => void) {
    this.exceptionIntercepter = fn;
  }
  static setResponseIntercepter(fn: (data: any) => void) {
    this.responseIntercepter = fn;
  }

  static request<T>(config: AxiosRequestConfig): AxiosPromise<T> {
    return this.axiosInstance.request<T>(config);
  }

  static get = <T, D = any>(
    url: string,
    params?: D,
    config?: AxiosRequestConfig,
  ): AxiosPromise<T> => {
    return Http.request<T>({ method: "GET", url, params, ...config });
  };

  static post = <T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): AxiosPromise<T> => {
    return Http.request<T>({ method: "POST", url, data, ...config });
  };

  static initHttp(config: Partial<typeof Http.HttpConfig>) {
    this.HttpConfig = { ...this.HttpConfig, ...config };
    this.axiosInstance.defaults.baseURL = this.HttpConfig.baseUrl;

    // 避免重复添加拦截器
    if (this.inited) return;
    this.inited = true;

    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // ✅ 刷新token接口，不附加旧token
        if (config.url?.includes("/auth/refresh")) {
          return config;
        }
        const token = localStorage.getItem("accessToken");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        const rawData = response.data?.data ?? response.data;
        if (this.responseIntercepter) {
          return this.responseIntercepter(rawData);
        }
        return rawData;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        const status = error.response?.status;
        const isUnAuth = status === 401 || status === this.HttpConfig.unAuthority;

        if (isUnAuth && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.requestQueue.push({ resolve, reject, config: originalRequest });
            });
          }
          originalRequest._retry = true;
          this.isRefreshing = true;
          try {
            const newToken = await this.refreshToken();
            localStorage.setItem("accessToken", newToken);
            // 批量重放队列
            this.requestQueue.forEach(({ resolve, reject, config }) => {
              if (!config.headers) config.headers = {};
              config.headers.Authorization = `Bearer ${newToken}`;
              this.axiosInstance.request(config).then(resolve).catch(reject);
            });
            this.requestQueue = [];
            // 重试当前失败请求
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.requestQueue.forEach(({ reject }) => reject(refreshError));
            this.requestQueue = [];
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            if (this.exceptionIntercepter) {
              this.exceptionIntercepter(refreshError);
            }
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        if (this.exceptionIntercepter) {
          this.exceptionIntercepter(error);
        }
        return Promise.reject(error);
      },
    );
  }

  private static async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token");
    const res = await this.axiosInstance.post<{ token: string }>("/auth/refresh", {
      refreshToken,
    });
    const newAccessToken = res.data?.token;
    if (!newAccessToken) throw new Error("Refresh failed");
    return newAccessToken;
  }
}
