import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Row, Radio } from "antd";
import Button from "../../Button";
import Modal, { CommentTextArea } from "../styles";
import { DELIVERY_TYPES } from "../../../constants";
import moment from "moment";
import AxiosInstance from "../../../API/api";
import { AuthContext } from "../../../Contexts/AuthContext";

const CreateDeliveryEventModal = ({ visible, setVisible, date }) => {
  const { user } = useContext(AuthContext);
  const [value, setValue] = useState("Foot");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const onTypeOfDeliveryChange = (e) => {
    setValue(e.target.value);
  };

  const createEvent = async () => {
    setLoading(true);
    try {
      const userNameArray = user.displayName.split(" ");
      const firstName = userNameArray.slice(0, -1).join(" ");
      const lastName = userNameArray[userNameArray.length - 1];
      await AxiosInstance.post("/events/createEvent", {
        firstName,
        lastName,
        eventType: "deliv",
        userId: user.uid,
        eventDate: moment(date.format("YYYY-MM-DD")).toDate(),
        userComment: comment,
        typeOfDelivery: value,
      });
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
    setVisible(false);
  };

  const Footer = () => (
    <Row justify="center">
      <Button type="primary" onClick={createEvent} loading={loading}>
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
      onCancel={() => setVisible(false)}
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
      <b>Comments:</b>
      <CommentTextArea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
    </Modal>
  );
};

CreateDeliveryEventModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  date: PropTypes.object.isRequired,
};

export default CreateDeliveryEventModal;
