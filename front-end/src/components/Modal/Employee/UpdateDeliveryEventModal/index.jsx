import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Row, Radio } from "antd";
import Button from "../../../Button";
import Modal, { CommentTextArea } from "../../styles";
import { DELIVERY_TYPES } from "../../../../constants";
import moment from "moment";
import AxiosInstance from "../../../../API/api";
import { AuthContext } from "../../../../Contexts/AuthContext";

const UpdateDeliveryEventModal = ({
  visible,
  setVisible,
  date,
  getEvents,
  eventInfo,
  volunteerInfo,
}) => {
  const { user } = useContext(AuthContext);
  const [value, setValue] = useState(
    eventInfo?.data?.type_of_delivery || "Foot"
  );
  const [comment, setComment] = useState(eventInfo?.data?.user_comment || "");
  const [employeeComment, setEmployeeComment] = useState(
    eventInfo?.data?.admin_comment || ""
  );
  const [loading, setLoading] = useState(false);
  // const [checked, setChecked] = useState(false);

  const onTypeOfDeliveryChange = (e) => {
    setValue(e.target.value);
  };

  const updateEvent = async () => {
    setLoading(true);
    try {
      const userNameArray = user.displayName
        ? user.displayName.split(" ")
        : "Test User".split(" ");
      const firstName = userNameArray.slice(0, -1).join(" ");
      const lastName = userNameArray[userNameArray.length - 1];
      await AxiosInstance.post("/events/editEvent", {
        firstName,
        lastName,
        eventType: "deliv",
        userId: user.uid,
        slot: 4,
        eventDate: date.format("YYMMDD"),
        userComment: comment,
        adminComment: employeeComment,
        typeOfDelivery: value,
        event_id: eventInfo?.event_id,
      });
      getEvents();
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
    setVisible((prev) => ({
      ...prev,
      employeeUpdateDeliveryEventModalVisible: false,
    }));
  };

  const Footer = () => (
    <Row justify="center">
      <Button type="primary" onClick={updateEvent} loading={loading}>
        Update
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
          employeeUpdateDeliveryEventModalVisible: false,
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
      <b>Volunteer Comment:</b>
      <CommentTextArea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
      <b>Employee Comment:</b>
      <CommentTextArea
        value={employeeComment === "NA" ? "" : employeeComment}
        onChange={(event) => setEmployeeComment(event.target.value)}
      />
      {/* <Checkbox
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      >
        Volunteer did not show up for this event.
      </Checkbox> */}
    </Modal>
  );
};

UpdateDeliveryEventModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  date: PropTypes.object.isRequired,
  getEvents: PropTypes.func.isRequired,
  eventInfo: PropTypes.object.isRequired,
  volunteerInfo: PropTypes.object.isRequired,
};

export default UpdateDeliveryEventModal;
