import styled from "styled-components";
import { Form, Input } from "antd";

export const StyledForm = styled(Form)`
  border-radius: 10px;
  padding: 10%;
  box-shadow: 1px 2px 10px 2px rgba(0, 0, 0, 0.1);
  height: 100%;

  div {
    text-align: start;
  }

  span {
    font-size: 1.5rem;
  }
`;

export const StyledInput = styled(Input)`
  border: 1px solid #000;
`;

export const LeftArrow = styled.img`
  cursor: pointer;
`;
