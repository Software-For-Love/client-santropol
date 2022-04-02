import React from "react";
import Content from "./styles";
import { Col } from "antd";

const ContentComponent = (props) => {
  return (
    <Col xs={16} sm={16} md={18} lg={18} xl={19}>
      <Content>{props.children}</Content>
    </Col>
  );
};

export default ContentComponent;
