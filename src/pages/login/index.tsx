import { update } from "@/features/userInfo/userInfoSlice";
import { Ripple } from "@ui/components/src/ripple";
import { Button, Form, Input, message, Modal, Radio } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./index.less";
import { authLogin, authRegister } from "@/models/api.client";
import { UserCreateBody } from "@/models/api.types";
import { ClickModal } from "@ui/components/src/modal";
import { Register } from "./radiotest";
import { useEffect } from "react";
const Logining = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registForm] = Form.useForm();
  useEffect(() => {
    console.log("form values:", form.getFieldsValue());
    console.log("registForm values:", registForm.getFieldsValue());
  });
  const handleSubmit = async (values: UserCreateBody) => {
    try {
      const response = await authLogin(values);
      if (response.code === 0 && response.data) {
        dispatch(update(response.data));
        message.success("登录成功");
        navigate("/home");
      } else {
        message.error(response.message || "登录失败");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("登录失败，请稍后重试");
    }
  };
  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.loginForm}>
        <Form<UserCreateBody>
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="用户名"
            name="email"
            rules={[
              { required: true, message: "请输入用户名" },
              { min: 3, message: "用户名长度至少为3位" },
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码长度至少为6位" },
            ]}
          >
            <Input.Password placeholder="请输入密码" autoComplete="off" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              登录
            </Button>
          </Form.Item>
        </Form>
        <Button
          onClick={() =>
            ClickModal.open({
              title: "注册",
              content: <Register registerForm={registForm} />,
              destroyOnHidden: true,
              onOk: async () => {
                const { comfirmPwd, ...params } = await registForm.validateFields();
                const res = await authRegister(params);
                dispatch(update(res.data));
                message.success(res.message);
                navigate("/home");
              },
            })
          }
        >
          <strong>还没账号？点击注册</strong>
        </Button>
      </div>
    </div>
  );
};
const Login = () => (
  <Ripple range={100}>
    <Logining />
  </Ripple>
);
export default Login;
