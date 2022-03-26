import { Form, Input, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import "../../App.css";
import {Link} from "react-router-dom";
import logo from "../../santropol.svg";
import Button from "../Button";

const NormalLoginForm = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div className='form'>
     <img src={logo} className='App-logo' alt='logo' />
        <p>
          Login
        </p>
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
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
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
          <Checkbox style={{float:'left'}}>Remember me</Checkbox>
        </Form.Item>
           <a style={{float:'right'}} className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item>

      <Form.Item>
        <Button style={{width:'100%'}}>
          Log in
        </Button>  or <Link to="/register">register now</Link>
      </Form.Item>
    </Form>
  </div>
  );
};

export default NormalLoginForm;
