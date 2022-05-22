import React, { useState, useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import { Form, Input, Checkbox, message, Button as AntdButton } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "../../App.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../santropol.svg";
import Button from "../Button";
import AxiosInstance from "../../API/api";
import { ResetPasswordModal } from "../Modal";

const NormalLoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] =
    useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { data } = await AxiosInstance.post(
        `auth/signIn?username=${values.username}&password=${values.password}`
      );
      console.log(data);
      if (data.user) {
        login(data.user);
        if (values.remember) {
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          sessionStorage.setItem("user", JSON.stringify(data.user));
        }
        navigate("/kitchem-am");
      } else {
        message.error(data.result || data.code);
      }
    } catch (error) {
      message.error("Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <div className='form'>
      <ResetPasswordModal
        visible={resetPasswordModalVisible}
        setVisible={setResetPasswordModalVisible}
      />
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
          <AntdButton
            style={{ float: "right" }}
            className='login-form-forgot'
            type='link'
            onClick={() => setResetPasswordModalVisible(true)}
          >
            Forgot password
          </AntdButton>
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
