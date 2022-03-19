import React from "react";
import Layout, { ChildrenWrapper } from "./styles";
import PropTypes from "prop-types";

const LayoutWrapper = (props) => {
  return (
    <Layout>
      <ChildrenWrapper>{props.children}</ChildrenWrapper>
    </Layout>
  );
};

LayoutWrapper.propTypes = {
  children: PropTypes.any,
};

export default LayoutWrapper;
