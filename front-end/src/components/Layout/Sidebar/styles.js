import styled from "styled-components";
import { Col } from "antd";

export default styled(Col)`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 12px;
  padding: 128px 28px;
  max-width: ${(props) => props.theme.layout.sider.maxWidth};
  max-height: ${(props) => props.theme.layout.sider.maxHeight};
  width: 100%;
  height: 100%;
`;
