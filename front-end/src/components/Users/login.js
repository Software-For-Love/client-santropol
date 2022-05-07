import React, { useState } from "react";
import { Form, Input, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import "../../App.css";
import { Link } from "react-router-dom";
import logo from "../../santropol.svg";
import Button from "../Button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const NormalLoginForm = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onFinish = (values) => {
    // console.log("Received values of form: ", values);
    setLoading(true);

    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((user) => {
        console.log("Successfully logged in", user);
        navigate("/kitchen-am");
      })
      .catch(() => {
        message.error("Invalid email or password");
      });
    setLoading(false);
  };

  return (
    <div className='form'>
      <img src={logo} className='App-logo' alt='logo' />
      <p>Login</p>
      <Form
        name='normal_login'
        className='login-form'
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          className='userbox'
          name='email'
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className='site-form-item-icon' />}
            placeholder='Username'
          />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className='site-form-item-icon' />}
            type='password'
            placeholder='Password'
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name='remember' valuePropName='checked' noStyle>
            <Checkbox style={{ float: "left" }}>Remember me</Checkbox>
          </Form.Item>
          <a style={{ float: "right" }} className='login-form-forgot' href=''>
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button style={{ width: "100%" }} htmlType='submit' loading={loading}>
            Log in
          </Button>{" "}
          or <Link to='/register'>register now</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NormalLoginForm;
