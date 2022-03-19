import React from "react";
import Header, { LogoContainer, ProfileContainer } from "./styles";
import LogoSrc from "../../../assets/logo.svg";
import { Col, Row } from "antd";
import ProfileDropdown from "./ProfileDropdown";

const HeaderComponent = () => {
  return (
    <Col span={24}>
      <Header>
        <Row>
          <LogoContainer>
            <img src={LogoSrc} alt='Logo' />
          </LogoContainer>
          <ProfileContainer>
            <ProfileDropdown />
          </ProfileContainer>
        </Row>
      </Header>
    </Col>
  );
};

export default HeaderComponent;
