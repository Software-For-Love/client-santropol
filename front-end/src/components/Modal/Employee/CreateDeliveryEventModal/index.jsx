import { useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Radio, message } from "antd";
import Button from "../../../Button";
import Modal, { CommentTextArea } from "../../styles";
import { DELIVERY_TYPES } from "../../../../constants";
import moment from "moment";
import AxiosInstance from "../../../../API/api";
import SelectVolunteerCard from "../../../Card/SelectVolunteerCard";

const CreateDeliveryEventModal = ({ visible, setVisible, date, getEvents }) => {
  const [value, setValue] = useState("Foot");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [searchingUsers, setSearchingUsers] = useState(false);

  const onTypeOfDeliveryChange = (e) => {
    setValue(e.target.value);
  };

  const handleSearch = async () => {
    if (firstName === "" && lastName === "") {
      message.error("Please enter a name");
      return;
    }

    setSearchingUsers(true);
    try {
      const { data } = await AxiosInstance.post("/user/retrieve-users", {
        first_name: firstName,
        last_name: lastName,
      });

      console.log(firstName, lastName);
      if (data.success) {
        if (data.result.length === 0) {
          message.error("No user found");
          setUsers(null);
        } else {
          setUsers(data.result);
        }
      } else {
        message.error(data.error);
      }
    } catch (error) {
      console.log(error);
    }
    setSearchingUsers(false);
  };

  const createEvent = async () => {
    setLoading(true);
    try {
      const { data } = await AxiosInstance.post("/events/createEvent", {
        firstName: selectedUser.first_name,
        lastName: selectedUser.last_name,
        eventType: "deliv",
        slot: 4,
        userId: selectedUser.key,
        userType: "volunteer",
        eventDate: date.format("YYMMDD"),
        adminComment: comment,
        typeOfDelivery: value,
      });
      if (data.success) {
        getEvents();
        setVisible((prev) => ({
          ...prev,
          employeeCreateDeliveryEventModalVisible: false,
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
      <Button
        type="primary"
        onClick={createEvent}
        loading={loading}
        disabled={!selectedUser}
      >
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
      onCancel={() =>
        setVisible((prev) => ({
          ...prev,
          employeeCreateDeliveryEventModalVisible: false,
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
        <strong>Volunteer: </strong>
        {selectedUser ? (
          `${selectedUser.first_name} ${selectedUser.last_name}`
        ) : (
          <Row gutter={[8, 8]}>
            <Col>
              <input
                placeholder="First Name"
                style={{
                  height: "100%",
                }}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Col>
            <Col>
              <input
                placeholder="Last Name"
                style={{
                  height: "100%",
                }}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Col>

            <Col>
              <Button onClick={() => handleSearch()} loading={searchingUsers}>
                Search
              </Button>
            </Col>
          </Row>
        )}
      </p>
      {users && (
        <Row gutter={[8, 8]}>
          {users.map((user) => (
            <Col span={12}>
              <SelectVolunteerCard
                {...user}
                setSelectedUser={setSelectedUser}
                user={user}
                setUsers={setUsers}
              />
            </Col>
          ))}
        </Row>
      )}
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
