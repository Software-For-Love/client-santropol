import React, { useState } from "react";
import { Form, Input, Checkbox, message, Button as AntdButton } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import "../../App.css";
import { Link } from "react-router-dom";
import logo from "../../santropol.svg";
import Button from "../Button";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const NormalLoginForm = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    await setPersistence(
      auth,
      values.remember ? browserLocalPersistence : browserSessionPersistence
    ); // automatically logs in the user or asks for email and password
    const user = await signInWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );
    if (user) {
      navigate("/kitchen-am");
    } else {
      message.error("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div className="form">
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
