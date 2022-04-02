import styled from "styled-components";

export default styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 10px;
  height: 52px;
  width: 100%;
  margin-top: 12px;
  cursor: ${(props) => (props.type === "admin" ? "pointer" : "default")};
`;

export const Icon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 5px;
`;
