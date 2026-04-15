import Mock from 'mockjs';
import { mockData } from '../mockDB';

export const userInfoMock = () => {
  // 模拟用户信息接口
  Mock.mock(/api\/user-info/, 'get', () => {
    // 从mockDB中获取第一个用户数据
    const user = mockData.users[0];
    return {
      code: 200,
      message: 'success',
      data: user
    };
  });

  // 模拟登录接口
  Mock.mock(/\/api\/login/, 'post', (options) => {
    // 解析请求体
    const body = JSON.parse(options.body);
    const { username, password } = body;

    // 验证逻辑
    if (username === 'admin' && password === '123456') {
      // 使用mockDB中的第一个用户（管理员）
      const user = mockData.users[0];
      return {
        code: 200,
        message: 'success',
        data: {
          token: Mock.mock('@guid'),
          user: user
        }
      };
    } else if (username === 'user' && password === '123456') {
      // 使用mockDB中的第二个用户（普通用户）
      const user = mockData.users[1];
      return {
        code: 200,
        message: 'success',
        data: {
          token: Mock.mock('@guid'),
          user: user
        }
      };
    } else {
      return {
        code: 401,
        message: '用户名或密码错误',
        data: null
      };
    }
  });

  // 模拟登出接口
  Mock.mock(/api\/logout/, 'post', {
    code: 200,
    message: 'success',
    data: null
  });
  
  // 模拟获取用户列表接口
  Mock.mock(/api\/users/, 'get', {
    code: 200,
    message: 'success',
    data: {
      list: mockData.users,
      total: mockData.users.length
    }
  });
  
  // 模拟获取产品列表接口
  Mock.mock(/api\/products/, 'get', {
    code: 200,
    message: 'success',
    data: {
      list: mockData.products,
      total: mockData.products.length
    }
  });
  
  // 模拟获取订单列表接口
  Mock.mock(/api\/orders/, 'get', {
    code: 200,
    message: 'success',
    data: {
      list: mockData.orders,
      total: mockData.orders.length
    }
  });
};
