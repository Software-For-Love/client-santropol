import styled from "styled-components";
import { Menu, Typography } from "antd";

export default styled(Menu)`
  border: 1px solid ${(props) => props.theme.colors.primary};
  .ant-dropdown-menu-title-content {
    text-align: center;
  }
`;

export const MenuText = styled(Typography.Text)``;
