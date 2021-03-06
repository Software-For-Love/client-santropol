import { useState } from "react";
import PropTypes from "prop-types";
import { Row, Radio } from "antd";
import Button from "../../Button";
import Modal, { CommentTextArea } from "../styles";
import { DELIVERY_TYPES } from "../../../constants";
import moment from "moment";

const DeliveryModal = ({ visible, setVisible, type, date }) => {
  const [value, setValue] = useState(type || "Foot");

  const onTypeOfDeliveryChange = (e) => {
    setValue(e.target.value);
  };

  const onClose = () => {
    setVisible(false);
  };

  const Footer = () => (
    <Row justify="center">
      <Button type="primary" onClick={onClose}>
        Confirm
      </Button>
    </Row>
  );

  const Title = () => (
    <Row justify="center">
      <h3>Delivery</h3>
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
        2:15 PM
      </p>
      <p>
        <strong>Type of delivery:</strong>
        <Radio.Group
          value={value}
          onChange={onTypeOfDeliveryChange}
          style={{
            marginLeft: "10px",
          }}
        >
          {DELIVERY_TYPES.map((type) => (
            <Radio value={type} key={type}>
              {type}
            </Radio>
          ))}
        </Radio.Group>
      </p>

      <p>
        <strong>Assign Volunteer: </strong>
      </p>
      <b>Comments:</b>
      <CommentTextArea />
    </Modal>
  );
};

DeliveryModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  date: PropTypes.object.isRequired,
  type: PropTypes.string,
};

export default DeliveryModal;
