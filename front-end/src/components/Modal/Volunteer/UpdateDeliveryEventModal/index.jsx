import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Row, Radio } from "antd";
import Button from "../../../Button";
import Modal, { CommentTextArea } from "../../styles";
import { DELIVERY_TYPES } from "../../../../constants";
import moment from "moment";
import AxiosInstance from "../../../../API/api";
import { AuthContext } from "../../../../Contexts/AuthContext";

const CreateDeliveryEventModal = ({
  visible,
  setVisible,
  date,
  getEvents,
  eventInfo,
}) => {
  const { user } = useContext(AuthContext);
  const [value, setValue] = useState("Foot");
  const [comment, setComment] = useState(eventInfo?.data?.user_comment || "");
  const [loading, setLoading] = useState(false);

  const onTypeOfDeliveryChange = (e) => {
    setValue(e.target.value);
  };

  const updateEvent = async () => {
    setLoading(true);
    try {
      const userNameArray = user.displayName.split(" ");
      const firstName = userNameArray.slice(0, -1).join(" ");
      const lastName = userNameArray[userNameArray.length - 1];
      await AxiosInstance.post("/events/editEvent", {
        firstName,
        lastName,
        eventType: "deliv",
        userId: user.uid,
        eventDate: moment(date.format("YYYY-MM-DD")).toDate(),
        userComment: comment,
        typeOfDelivery: value,
      });
      getEvents();
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
    setVisible((prev) => ({
      ...prev,
      volunteerCreateDeliveryEventModalVisible: false,
    }));
  };

  const Footer = () => (
    <Row justify="center">
      <Button type="primary" onClick={updateEvent} loading={loading}>
        Confirm
      </Button>
    </Row>
  );

  const Title = () => (
    <Row justify="center">
      <h3>Update Delivery</h3>
    </Row>
  );
  return (
    <Modal
      visible={visible}
      onCancel={() =>
        setVisible((prev) => ({
          ...prev,
          volunteerCreateDeliveryEventModalVisible: false,
        }))
      }
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
        <strong>Assigned Volunteer: </strong>
        {user.displayName}
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
  getEvents: PropTypes.func.isRequired,
  volunteerInfo: PropTypes.object.isRequired,
  eventInfo: PropTypes.object.isRequired,
};

export default CreateDeliveryEventModal;
