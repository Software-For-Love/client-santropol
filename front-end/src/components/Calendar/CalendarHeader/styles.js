import styled from "styled-components";
import { Row, Typography } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

export default styled(Row)`
  padding-left: 150px;
`;

export const LeftIcon = styled(LeftOutlined)`
  color: ${(props) => props.theme.colors.primary};
  font-size: ${(props) => props.theme.typography.lg};
  cursor: pointer;
`;

export const RightIcon = styled(RightOutlined)`
  color: ${(props) => props.theme.colors.primary};
  font-size: ${(props) => props.theme.typography.lg};
  cursor: pointer;
`;

export const DateText = styled(Typography.Text)`
  color: ${(props) => props.theme.colors.primary};
  font-size: ${(props) => props.theme.typography.xxl};
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;
