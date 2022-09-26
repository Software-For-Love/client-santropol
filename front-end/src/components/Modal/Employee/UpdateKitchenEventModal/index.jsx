import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Row, Checkbox } from "antd";
import Button from "../../../Button";
import Modal, { CommentTextArea } from "../../styles";
import moment from "moment";
import AxiosInstance from "../../../../API/api";
import { AuthContext } from "../../../../Contexts/AuthContext";

const UpdateKitchenEventModal = ({
  visible,
  setVisible,
  date,
  getEvents,
  volunteerInfo,
  eventInfo,
}) => {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState(eventInfo?.data?.user_comment || "");
  const [employeeComment, setEmployeeComment] = useState(
    eventInfo?.data?.employee_comment || ""
  );
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const shiftTime = window.location.pathname.includes("kitchen-am")
    ? "AM"
    : "PM";

  const updateEvent = async () => {
    setLoading(true);
    try {
      const userNameArray = user.displayName? user.displayName.split(" "): "Test User".split(" ");
      const firstName = userNameArray.slice(0, -1).join(" ");
      const lastName = userNameArray[userNameArray.length - 1];

      await AxiosInstance.post("/events/editEvent", {
        firstName,
        lastName,
        eventType: shiftTime === "AM" ? "kitam" : "kitpm",
        userId: user.uid,
        slot: 4,
        eventDate: date.format("YYMMDD"),
        userComment: comment,
        event_id: eventInfo?.event_id,
      });
      getEvents();
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
    setVisible((prev) => ({
      ...prev,
      employeeUpdateKitchenEventModalVisible: false,
    }));
  };

  const Footer = () => (
    <Row justify="center">
      <Button onClick={updateEvent} loading={loading}>
        Update
      </Button>
    </Row>
  );

  const Title = () => (
    <Row justify="center">
      <h3>{`Update ${shiftTime} Kitchen Shift`}</h3>
    </Row>
  );
  return (
    <Modal
      visible={visible}
      onCancel={() =>
        setVisible((prev) => ({
          ...prev,
          employeeUpdateKitchenEventModalVisible: false,
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
      <p>
        <strong>Assigned volunteer: </strong>
        {volunteerInfo?.firstName} {volunteerInfo?.lastName}
      </p>
      <b>Volunteer Comment:</b>
      <CommentTextArea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
      <b>Employee Comment:</b>
      <CommentTextArea
        value={employeeComment}
        onChange={(event) => setEmployeeComment(event.target.value)}
      />
      <Checkbox
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      >
        Volunteer did not show up for this event.
      </Checkbox>
    </Modal>
  );
};

UpdateKitchenEventModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  date: PropTypes.object.isRequired,
  getEvents: PropTypes.func.isRequired,
  volunteerInfo: PropTypes.object.isRequired,
  eventInfo: PropTypes.object.isRequired,
};

export default UpdateKitchenEventModal;
