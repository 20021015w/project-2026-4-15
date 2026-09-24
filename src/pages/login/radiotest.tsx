import { AuthRegisterBody } from "@/models/api.types";
import { Form, Input } from "antd";
import { FormInstance } from "antd/lib";
import { type FC } from "react";

export const Register: FC<{ registerForm: FormInstance }> = ({ registerForm }) => {
  return (
    <Form<AuthRegisterBody & { comfirmPwd: string }> form={registerForm} labelCol={{ span: 4 }}>
      <Form.Item name={"email"} label={"邮箱"}>
        <Input />
      </Form.Item>
      <Form.Item name={"password"} label={"密码"} rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item
        name={"comfirmPwd"}
        label={"确认密码"}
        dependencies={["password"]}
        rules={[
          ({ getFieldValue }) => ({
            required: true,
            validator(_, value) {
              if (!value || getFieldValue("password") !== value) {
                return Promise.reject(new Error("两次输入的密码不一致"));
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item label={"姓名"} name={"name"}>
        <Input />
      </Form.Item>
    </Form>
  );
};
