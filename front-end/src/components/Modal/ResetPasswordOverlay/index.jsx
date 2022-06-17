import React, { useState } from "react";
import PropTypes from "prop-types";
import { Row, Input, Form, Alert } from "antd";
import Button from "../../Button";
import Modal from "../styles";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import convertFirebaseErrorCodeToMessage from "../../../utils/convertFirebaseErrorCodeToMessage";

const ResetPasswordModal = ({ visible, setVisible }) => {
  const auth = getAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const sendResetPasswordLink = async (email) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setError(null);
    } catch (error) {
      setError(error.code);
    }
    setLoading(false);
  };

  const Title = () => (
    <Row justify="center">
      <h3>Forgot Password</h3>
    </Row>
  );

  const onFinish = ({ email }) => {
    sendResetPasswordLink(email);
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => {
        setVisible(false);
        setLoading(false);
        setError(null);
        form.resetFields();
      }}
      footer={() => null}
      title={<Title />}
    >
      <Form onFinish={onFinish} form={form}>
        <p>You can reset your password by clicking the button below.</p>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input type="email" />
        </Form.Item>
        {(error || success) && (
          <Alert
            message={
              error
                ? convertFirebaseErrorCodeToMessage(error)
                : "Reset password email sent! Please check your spam folder."
            }
            type={error ? "error" : "success"}
            style={{
              marginBottom: "10px",
              marginTop: "-10px",
            }}
            closable
            onClose={() => {
              setError(null);
              setSuccess(null);
            }}
          />
        )}

        <Row justify="center">
          <Button htmlType="submit" loading={loading}>
            Confirm
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

ResetPasswordModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};

export default ResetPasswordModal;
