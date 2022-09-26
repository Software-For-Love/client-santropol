import styled from "styled-components";

export default styled.button`
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 10px;
  height: 52px;
  width: 100%;
  margin-top: 12px;
  cursor: pointer;
  outline: none;
  border: none;
  appearance: none;
  position: relative;
`;

export const Icon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 5px;
`;

export const DeleteButton = styled.img`
  position: absolute;
  top: 10px;
  right: 5px;
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
`;
