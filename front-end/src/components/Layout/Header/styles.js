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
  img {
    max-width: 150px;
    height: auto;
  }
`;

export const ProfileContainer = styled(Col).attrs(() => ({ span: 8 }))`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
