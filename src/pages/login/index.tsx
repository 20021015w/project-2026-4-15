import { update } from "@/features/userInfo/userInfoSlice"
import { Ripple } from "@ui/components/src/ripple"
import { Button, Form, Input, message } from "antd"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Http } from "uitls"
import styles from './index.less'

const Logining = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (values: any) => {
    try {
      // 调用登录接口
      const response = await Http.post<any,{username:string,password:string}>('/api/login', {
        username: values.userName,
        password: values.passWord
      })
      
      if (response.status === 200 && response.data) {
        const userData = {
          ...response.data.data.user,
          token: response.data.data.token
        };
        dispatch(update(userData));
        message.success('登录成功');
        navigate('/home');
      } else {
        message.error(response.data.data.message || '登录失败');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('登录失败，请稍后重试');
    }
  }

  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.loginForm}>
        <h2>用户登录</h2>
        <Form 
          form={form} 
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item 
            label="用户名" 
            name="userName"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名长度至少为3位' }
            ]}
          >
            <Input placeholder="请输入用户名" autoComplete="false"/>
          </Form.Item>
          <Form.Item 
            label="密码" 
            name="passWord"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度至少为6位' }
            ]}
          >
            <Input.Password placeholder="请输入密码" autoComplete="false"/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
export const Login = () => <Ripple range={100}>
  <Logining/>
</Ripple>