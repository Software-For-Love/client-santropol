import React, { useState, useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import { Form, Input, Checkbox, message, Button as AntdButton } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "../../App.css";
import { Link } from "react-router-dom";
import logo from "../../santropol.svg";
import Button from "../Button";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ResetPasswordOverlay } from "../Modal/index";

const NormalLoginForm = () => {
  const auth = getAuth();
  const { setIsLoggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [passwordResetModalVisible, setPasswordResetModalVisible] =
    useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // automatically logs in the user or asks for email and password
      const user = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      if (user) {
        if (values.remember) {
          localStorage.setItem("remember", "true");
        } else {
          sessionStorage.setItem("remember", "true");
        }
        setIsLoggedIn(true);
      }
    } catch (error) {
      message.error("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div className="form">
      <ResetPasswordOverlay
        visible={passwordResetModalVisible}
        setVisible={setPasswordResetModalVisible}
      />
      <img src={logo} className="App-logo" alt="logo" />
      <p>Login</p>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          className="userbox"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox style={{ float: "left" }}>Remember me</Checkbox>
          </Form.Item>
          <AntdButton
            style={{ float: "right" }}
            className="login-form-forgot"
            type="link"
            onClick={() => setPasswordResetModalVisible(true)}
          >
            Forgot password
          </AntdButton>
        </Form.Item>

        <Form.Item>
          <Button style={{ width: "100%" }} htmlType="submit" loading={loading}>
            Log in
          </Button>{" "}
          or <Link to="/register">register now</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NormalLoginForm;
