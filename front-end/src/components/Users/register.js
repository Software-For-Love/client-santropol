import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "antd/dist/antd.css";
import "../../App.css";
import logo from "../../santropol.svg";
import Button from "../Button";
import AxiosInstance from "../../API/api";
import { Form, Input, message } from "antd";
import { UserOutlined } from "@ant-design/icons";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    setLoading(true);
    try {
      const { data } = await AxiosInstance.post(
        `auth/register?username=${values.username}&password=${values.password}`
      );
      console.log(data);
      if (data.user) {
        navigate("/");
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        message.error(data.result || data.code || "Something went wrong");
      }
    } catch (error) {
      message.error("Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <div className='form'>
      <img src={logo} className='App-logo' alt='logo' />
      <p>Register</p>
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
          name='username'
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
          label='Password'
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name='confirm'
          label='Confirm Password'
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button style={{ width: "100%" }} htmlType='submit' loading={loading}>
            Register
          </Button>
          <Link to='/' style={{ float: "right" }}>
            Back to Login
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegistrationForm;
