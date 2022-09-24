import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { message, Row } from "antd";
import Button from "../../Button";
import Modal, { CommentTextArea } from "../styles";
import moment from "moment";
import AxiosInstance from "../../../API/api";
import { AuthContext } from "../../../Contexts/AuthContext";

const RemoveUserFromEventModal = ({
  visible,
  setVisible,
  date,
  getEvents,
  eventInfo,
}) => {
  const { user, userType } = useContext(AuthContext);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const removeUserFromEvent = async () => {
    setLoading(true);
    try {
      await AxiosInstance.post("/events/removeUserFromEvent", {
        uid: user.uid,
        eventDate: moment(date.format("YYYY-MM-DD")).toDate(),
        userComment: reason,
        role: userType,
        key: eventInfo?.data?.key,
      });
      getEvents();
      message.success("User removed from event.");
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
    setVisible((prev) => ({
      ...prev,
      removeUserFromEventModalVisible: false,
    }));
  };

  const Footer = () => (
    <Row justify="center">
      <Button type="primary" onClick={removeUserFromEvent} loading={loading}>
        Remove
      </Button>
    </Row>
  );

  const Title = () => (
    <Row justify="center">
      <h3>Remove Event</h3>
    </Row>
  );

  return (
    <Modal
      visible={visible}
      onCancel={() =>
        setVisible((prev) => ({
          ...prev,
          removeUserFromEventModalVisible: false,
        }))
      }
      footer={<Footer />}
      title={<Title />}
    >
      <p>
        <strong>Date: </strong>
        {moment(date).format("dddd, MMMM Do")}
      </p>

      <b>Cancel Reason:</b>
      <CommentTextArea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
      />
    </Modal>
  );
};

RemoveUserFromEventModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  date: PropTypes.object.isRequired,
  getEvents: PropTypes.func.isRequired,
  eventInfo: PropTypes.object.isRequired,
};

export default RemoveUserFromEventModal;
