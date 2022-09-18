import styled from "styled-components";
import { Modal, Input } from "antd";

export default styled(Modal)`
  .ant-modal-footer {
    border-top: 0 none;
  }

  .ant-modal-body {
    padding: 12px 24px;
  }

  .ant-modal-header {
    border-bottom: 0 none;
  }
`;

export const CommentTextArea = styled(Input.TextArea).attrs(() => ({
  rows: 3,
}))`
  margin-top: 8px;
  margin-bottom: 8px;
`;
