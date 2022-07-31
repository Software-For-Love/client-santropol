import { useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Radio, Select } from "antd";
import Button from "../../Button";
import Modal, { CommentTextArea } from "../styles";
import { DELIVERY_TYPES } from "../../../constants";

const CreateDeliveryEventModal = ({ visible, setVisible }) => {
  const [value, setValue] = useState("Foot");
  const [oldEnough, setOldEnough] = useState(false);
  const [validDriversLicense, setValidDriversLicense] = useState(false);

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

  const RequirementSelector = ({ value, onChange }) => (
    <Select
      onChange={onChange}
      value={value}
      style={{
        marginLeft: "10px",
      }}
    >
      <Select.Option value={true}>Yes</Select.Option>
      <Select.Option value={false}>No</Select.Option>
    </Select>
  );

  const DeliveryRequirements = () => (
    <Row>
      <Col span={24}>
        <p>
          Are you at least 25 years old?
          <RequirementSelector
            value={oldEnough}
            onChange={(value) => setOldEnough(value)}
          />
        </p>
      </Col>
      <Col span={24}>
        <p>
          Do you have a valid driver’s license?
          <RequirementSelector
            onChange={(value) => setValidDriversLicense(value)}
            value={validDriversLicense}
          />
        </p>
      </Col>
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
        Tuesday, January 25
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
      {value === "SR Car" && <DeliveryRequirements />}
      <b>Comments:</b>
      <CommentTextArea />
    </Modal>
  );
};

CreateDeliveryEventModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};

export default CreateDeliveryEventModal;
