import styled from "styled-components";
import { Button } from "antd";
import theme from "../../Theme";

const getButtonBackgroundColor = (type, isActive) => {
  if (isActive) {
    return "#fff";
  }
  switch (type) {
    case "primary":
      return theme.colors.secondary;
    case "secondary":
      return "#fff";
    case "tertiary":
      return theme.colors.tertiary;
    default:
      return theme.colors.primary;
  }
};

const getButtonTextColor = (type, isActive) => {
  if (isActive) {
    return theme.colors.primary;
  }
  switch (type) {
    case "secondary":
      return theme.colors.primary;
    case "primary":
      return theme.colors.primary;
    default:
      return "#fff";
  }
};

export default styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    getButtonBackgroundColor(props.type, props.isActive)};
  border-color: ${(props) =>
    getButtonBackgroundColor(props.type, props.isActive)};
  color: ${(props) => getButtonTextColor(props.type, props.isActive)};
  &:hover {
    background-color: #fff;
    color: ${theme.colors.primary};
    border-color: ${() => getButtonBackgroundColor("primary")};
  }
  font-size: 1.2em;
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
  border-radius: ${(props) => (props.rounded ? "50px" : "2px")};
  padding: ${(props) => (props.rounded ? "1.2rem 2rem" : "0.3rem")};
`;
