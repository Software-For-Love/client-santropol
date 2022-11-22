import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import { StyledForm, StyledInput, LeftArrow } from "./styles";
import { Row, Col, Typography, message } from "antd";
import LeftArrowIcon from "../../assets/left-arrow.svg";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { updateProfile, updateEmail } from "firebase/auth";
import AxiosInstance from "../../API/api";

const Profile = () => {
  const navigate = useNavigate();
  const { Item } = StyledForm;
  const {
    user,
    phoneNumber,
    setPhoneNumber,
    pronouns,
    setPronouns,
    name,
    setName,
    email,
    setEmail,
  } = useContext(AuthContext);
  const [form] = StyledForm.useForm();
  const [sendingData, setSendingDate] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      phoneNumber,
      pronouns,
      name,
      email,
    });
  }, [phoneNumber, pronouns, name, email, form]);

  const handleSubmit = async (values) => {
    setSendingDate(true);
    const { name, email, phoneNumber, pronouns } = values;
    try {
      await updateProfile(user, {
        displayName: name,
      });
      if (email !== user.email) {
        await updateEmail(user, email);
      }
      await AxiosInstance.put("/user/update-user-info", {
        phoneNumber,
        pronouns,
        name,
        email,
      });
      setName(name);
      setEmail(email);
      setPhoneNumber(phoneNumber);
      setPronouns(pronouns);
      message.success("Updated profile successfully");
    } catch (error) {
      console.error(error);
      message.error("Something went wrong. Please try again.");
    }
    setSendingDate(false);
  };

  return (
    <Row style={{ height: "100%" }}>
      <Col span={2}>
        <LeftArrow
          src={LeftArrowIcon}
          alt="go-back"
          onClick={() => navigate(-1)}
        />
      </Col>
      <Col
        span={22}
        style={{
          borderRadius: "10px",
        }}
      >
        <StyledForm
          form={form}
          initialValues={{
            name,
            email,
            phoneNumber,
            pronouns,
          }}
          onFinish={handleSubmit}
        >
          <Row gutter={16} justify="center">
            <Col span={12}>
              <Typography.Text strong>Name:</Typography.Text>
              <Item name="name">
                <StyledInput />
              </Item>
            </Col>
            <Col span={12}>
              <Typography.Text strong>Phone:</Typography.Text>
              <Item name="phoneNumber">
                <StyledInput type="tel" />
              </Item>
            </Col>
            <Col span={12}>
              <Typography.Text strong>Email:</Typography.Text>
              <Item name="email">
                <StyledInput type="email" />
              </Item>
            </Col>
            <Col span={12}>
              <Typography.Text strong>Pronouns:</Typography.Text>
              <Item name="pronouns">
                <StyledInput />
              </Item>
            </Col>
            <Button
              htmlType="submit"
              loading={sendingData}
              style={{
                marginTop: "2rem",
                padding: "1rem",
              }}
            >
              Update
            </Button>
          </Row>
        </StyledForm>
      </Col>
    </Row>
  );
};

export default Profile;
