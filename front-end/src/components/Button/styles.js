import styled from "styled-components";
import { Button } from "antd";
import theme from "../../Theme";

const getButtonBackgroundColor = (type) => {
  switch (type) {
    case "secondary":
      return "#fff";
    case "tertiary":
      return theme.colors.tertiary;
    default:
      return theme.colors.primary;
  }
};

const getButtonTextColor = (type) => {
  switch (type) {
    case "secondary":
      return theme.colors.primary;
    default:
      return "#fff";
  }
};

export default styled(Button)`
  background-color: ${(props) => getButtonBackgroundColor(props.type)};
  border-color: ${(props) => getButtonBackgroundColor(props.type)};
  color: ${(props) => getButtonTextColor(props.type)};
  &:hover {
    background-color: #fff;
    color: ${() => getButtonBackgroundColor("primary")};
    border-color: ${() => getButtonBackgroundColor("primary")};
  }

  border-radius: ${(props) => (props.rounded ? "50px" : "2px")};
`;
