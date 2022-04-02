import React from "react";
import { StyledForm, StyledInput, LeftArrow } from "./styles";
import { Row, Col, Typography } from "antd";
import LeftArrowIcon from "../../assets/left-arrow.svg";
import { useNavigate } from "react-router-dom";
// import Button from "../../components/Button";

const Profile = () => {
  const navigate = useNavigate();
  const { Item } = StyledForm;
  return (
    <Row style={{ height: "100%" }}>
      <Col span={2}>
        <LeftArrow
          src={LeftArrowIcon}
          alt='go-back'
          onClick={() => navigate(-1)}
        />
      </Col>
      <Col span={22}>
        <StyledForm>
          <Row gutter={16}>
            <Col span={12}>
              <Typography.Text strong>Name:</Typography.Text>
              <Item name='name'>
                <StyledInput />
              </Item>
            </Col>
            <Col span={12}>
              <Item name='phone'>
                <Typography.Text strong>Phone:</Typography.Text>
                <StyledInput type='tel' />
              </Item>
            </Col>
            <Col span={12}>
              <Item name='email'>
                <Typography.Text strong>Email:</Typography.Text>
                <StyledInput type='email' />
              </Item>
            </Col>
            <Col span={12}>
              <Item name='pronouns'>
                <Typography.Text strong>Pronouns:</Typography.Text>
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
