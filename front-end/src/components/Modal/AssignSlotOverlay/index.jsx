import PropTypes from "prop-types";
import { Row } from "antd";
import Button from "../../Button";
import Modal, { CommentTextArea } from "../styles";
import moment from "moment";

const index = ({ visible, setVisible, date }) => {
  const onClose = () => {
    setVisible(false);
  };

  const Footer = () => (
    <Row justify='center'>
      <Button onClick={onClose}>Confirm</Button>
    </Row>
  );

  const Title = () => (
    <Row justify='center'>
      <h3>AM Kitchen Shift</h3>
    </Row>
  );
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={<Footer />}
      title={<Title />}
    >
      <p>
        <strong>Date: </strong>
        {moment(date).format("dddd, MMMM Do")}
      </p>
      <p>
        <strong>Time: </strong>
        8AM - 11:30AM
      </p>
      <p>
        <strong>Assign Volunteer: </strong>
      </p>
      <b>Comments:</b>
      <CommentTextArea />
    </Modal>
  );
};

index.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  date: PropTypes.object.isRequired,
};

export default index;
