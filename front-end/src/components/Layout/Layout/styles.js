import styled from "styled-components";
import { Layout, Row } from "antd";

export default styled(Layout)`
  display: flex;
  align-items: center;
  height: ${(props) => props.theme.layout.height};
  width: 100%;
  background-color: #fff;
`;

export const ChildrenWrapper = styled(Row)`
  max-width: ${(props) => props.theme.layout.maxWidth};
  width: 100%;
  height: 100%;
  padding: 0 ${(props) => props.theme.layout.paddingHorizontal}
    ${(props) => props.theme.layout.paddingBottom}
    ${(props) => props.theme.layout.paddingHorizontal};
`;
