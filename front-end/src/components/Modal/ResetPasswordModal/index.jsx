import React, { useState } from "react";
import PropTypes from "prop-types";
import { Row, Input, message, Form } from "antd";
import Button from "../../Button";
import Modal from "../styles";
import AxiosInstance from "../../../API/api";

const ResetPasswordModal = ({ visible, setVisible }) => {
  const [loading, setLoading] = useState(false);

  const sendResetPasswordLink = async (email) => {
    setLoading(true);
    try {
      const { data } = await AxiosInstance.post(`auth/forgotPassword/${email}`);
      if (data.result) {
        message.success(data.result);
      } else {
        message.error(data.error);
      }
    } catch (error) {
      console.log(error);
      message.error(error);
    }
    setLoading(false);
  };

  const Title = () => (
    <Row justify='center'>
      <h3>Forgot Password</h3>
    </Row>
  );

  const onFinish = ({ email }) => {
    sendResetPasswordLink(email);
    setVisible(false);
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={() => null}
      title={<Title />}
    >
      <Form onFinish={onFinish}>
        <p>You can reset your password by clicking the button below.</p>
        <Form.Item
          name='email'
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input type='email' />
        </Form.Item>
        <Row justify='center'>
          <Button htmlType='submit' loading={loading}>
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
