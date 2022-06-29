import React, { useState, useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import { Link } from "react-router-dom";
import logo from "../../santropol.svg";
import Button from "../Button";
import AxiosInstance from "../../API/api";
import { Form, Input, Alert } from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import convertFirebaseErrorCodeToMessage from "../../utils/convertFirebaseErrorCodeToMessage";

const RegistrationForm = () => {
  const auth = getAuth();
  const { setIsLoggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    let success = false;
    const { email, password, remember } = values;
    const emailDomain = email.split("@")[1];
    try {
      // if the email ends with softwareforlove.com, create a user without checking airtable for testing purposes.
      if (emailDomain === "softwareforlove.com") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // check if the email is in airtable.
        const { data } = await AxiosInstance.post(`auth/register`, {
          email,
        });

        if (!data.result) {
          setError("Email is not in the database.");
          setLoading(false);
          return;
        }

        // at this point we know the user is in the airtable
        if (emailDomain === "santropolroulant.org") {
          // if the email is from santropolroulant.org, make them an admin
          const response = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          // set the user as an admin
          const { data } = await AxiosInstance.post("/auth/claim-user-admin", {
            uid: response.user.uid,
          });
          if (data.result) {
            setIsAdmin(true);
          }
        } else {
          // volunteer user
          createUserWithEmailAndPassword(auth, email, password);
        }
      }
      success = true;
    } catch (error) {
      setError(
        error.code
          ? convertFirebaseErrorCodeToMessage(error.code)
          : "Something went wrong"
      );
    }
    if (success) {
      if (remember) {
        localStorage.setItem("remember", "true");
      } else {
        sessionStorage.setItem("remember", "true");
      }
      if (isAdmin) {
        signOut(auth);
        signInWithEmailAndPassword(auth, email, password);
      }
      setIsLoggedIn(true);
    }
    setLoading(false);
  };

  return (
    <div className="form">
      <img src={logo} className="App-logo" alt="logo" />
      <p>Register</p>
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
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
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
          name="confirm"
          label="Confirm Password"
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
        {error && (
          <Alert
            style={{
              marginBottom: "10px",
              marginTop: "-10px",
            }}
            message={error}
            type="error"
            closable
            onClose={() => {
              setError(null);
            }}
          />
        )}
        <Form.Item>
          <Button style={{ width: "100%" }} htmlType="submit" loading={loading}>
            Register
          </Button>
          <Link to="/" style={{ float: "right" }}>
            Back to Login
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegistrationForm;
