import React, { useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import { StyledForm, StyledInput, LeftArrow } from "./styles";
import { Row, Col, Typography } from "antd";
import LeftArrowIcon from "../../assets/left-arrow.svg";
import { useNavigate } from "react-router-dom";
// import Button from "../../components/Button";

const Profile = () => {
  const navigate = useNavigate();
  const { Item } = StyledForm;
  const { user } = useContext(AuthContext);
  console.log(user.email);
  return (
    <Row style={{ height: "100%" }}>
      <Col span={2}>
        <LeftArrow
          src={LeftArrowIcon}
          alt="go-back"
          onClick={() => navigate(-1)}
        />
      </Col>
      <Col span={22}>
        <StyledForm
          initialValues={{
            name: user.displayName,
            email: user.email,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Typography.Text strong>Name:</Typography.Text>
              <Item name="name">
                <StyledInput disabled />
              </Item>
            </Col>
            <Col span={12}>
              <Typography.Text strong>Phone:</Typography.Text>
              <Item name="phone">
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
          </Row>
        </StyledForm>
      </Col>
    </Row>
  );
};

export default Profile;
