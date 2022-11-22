import styled from "styled-components";
import { Card } from "antd";

export const StyledCard = styled(Card)`
  border-radius: 10px;
  .ant-card-body {
    padding: 0;
    padding-top: 1rem;
  }

  button {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;
