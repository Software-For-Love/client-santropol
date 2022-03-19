import React from "react";
import Content from "./styles";

const ContentComponent = (props) => {
  return <Content>{props.children}</Content>;
};

export default ContentComponent;
