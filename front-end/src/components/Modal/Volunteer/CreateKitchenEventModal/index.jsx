import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { message, Row } from "antd";
import Button from "../../../Button";
import Modal, { CommentTextArea } from "../../styles";
import moment from "moment";
import AxiosInstance from "../../../../API/api";
import { AuthContext } from "../../../../Contexts/AuthContext";

const CreateKitchenEventModal = ({ visible, setVisible, date, getEvents }) => {
  const { user, userType } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const shiftTime = window.location.pathname.includes("kitchen-am")
    ? "AM"
    : "PM";

  const createEvent = async () => {
    setLoading(true);
    try {
      const userNameArray = user.displayName
        ? user.displayName.split(" ")
        : "Test User".split(" ");
      const firstName = userNameArray.slice(0, -1).join(" ");
      const lastName = userNameArray[userNameArray.length - 1];

      const { data } = await AxiosInstance.post("/events/createEvent", {
        firstName,
        lastName,
        eventType: shiftTime === "AM" ? "kitam" : "kitpm",
        userId: user.uid,
        userType,
        eventDate: date.format("YYMMDD"),
        userComment: comment,
        slot: 4,
      });
      if (data.success) {
        getEvents();
        setVisible((prev) => ({
          ...prev,
          volunteerCreateKitchenEventModalVisible: false,
        }));
      } else {
        message.error(data.error);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const Footer = () => (
    <Row justify="center">
      <Button onClick={createEvent} loading={loading}>
        Confirm
      </Button>
    </Row>
  );

  const Title = () => (
    <Row justify="center">
      <h3>{`${shiftTime} Kitchen Shift`}</h3>
    </Row>
  );
  return (
    <Modal
      visible={visible}
      onCancel={() =>
        setVisible((prev) => ({
          ...prev,
          volunteerCreateKitchenEventModalVisible: false,
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
        {shiftTime === "AM" ? "9:30AM - 12:30AM" : "1:30PM - 4:30PM"}
      </p>
      <b>Comments:</b>
      <CommentTextArea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
    </Modal>
  );
};

CreateKitchenEventModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  date: PropTypes.object.isRequired,
};

export default CreateKitchenEventModal;
