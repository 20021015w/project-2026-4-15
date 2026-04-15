import Mock from 'mockjs';
import { userInfoMock } from './useLogin';

// 配置Mock响应时间
Mock.setup({
  timeout: '200-600'
});

// 注册mock接口
userInfoMock();

export default Mock;
