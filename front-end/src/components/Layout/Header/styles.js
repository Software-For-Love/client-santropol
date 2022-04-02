import styled from "styled-components";
import { Col } from "antd";
export default styled.header`
  display: block;
`;

export const LogoContainer = styled(Col).attrs(() => ({
  offset: 8,
  span: 8,
}))`
  display: flex;
  justify-content: center;
`;

export const ProfileContainer = styled(Col).attrs(() => ({ span: 8 }))`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
