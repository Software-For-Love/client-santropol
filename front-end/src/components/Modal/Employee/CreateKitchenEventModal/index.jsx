import React, { useState } from "react";
import PropTypes from "prop-types";
import { message, Row, Col, DatePicker, Checkbox } from "antd";
import Button from "../../../Button";
import Modal, { CommentTextArea } from "../../styles";
import moment from "moment";
import AxiosInstance from "../../../../API/api";
import SelectVolunteerCard from "../../../Card/SelectVolunteerCard";

const { RangePicker } = DatePicker;

const AdminCreateKitchenEventModal = ({
  visible,
  setVisible,
  date,
  getEvents,
}) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [startDate, setStartDate] = useState(date);
  const [endDate, setEndDate] = useState(null);
  const [users, setUsers] = useState(null);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const shiftTime = window.location.pathname.includes("kitchen-am")
    ? "AM"
    : "PM";

  const disabledDate = (current) => {
    // disable all days with different name.
    return current && current.format("dddd") !== date.format("dddd");
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
      let result = {};
      if (isRecurring) {
        result = await AxiosInstance.post("/events/recurringEvent", {
          firstName: selectedUser.first_name,
          lastName: selectedUser.last_name,
          eventType: shiftTime === "AM" ? "kitam" : "kitpm",
          slot: 4,
          userId: selectedUser.key,
          userType: "volunteer",
          startDate: startDate.format("YYMMDD"),
          endDate: endDate.format("YYMMDD"),
          adminComment: comment,
        });
      } else {
        result = await AxiosInstance.post("/events/createEvent", {
          firstName: selectedUser.first_name,
          lastName: selectedUser.last_name,
          eventType: shiftTime === "AM" ? "kitam" : "kitpm",
          userId: selectedUser.key,
          userType: "volunteer",
          eventDate: date.format("YYMMDD"),
          adminComment: comment,
          slot: 4,
        });
      }

      if (result.data.success) {
        getEvents();
        setVisible((prev) => ({
          ...prev,
          employeeCreateKitchenEventModalVisible: false,
        }));
      } else {
        message.error(result.data.error);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const Footer = () => (
    <Row justify="center">
      <Button onClick={createEvent} loading={loading} disabled={!selectedUser}>
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
          employeeCreateKitchenEventModalVisible: false,
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
      <Checkbox
        onChange={() => setIsRecurring(!isRecurring)}
        checked={isRecurring}
      >
        This is a recurring event
      </Checkbox>
      {isRecurring && (
        <div
          style={{
            marginTop: "10px",
          }}
        >
          <RangePicker
            value={[startDate, endDate]}
            disabledDate={disabledDate}
            onCalendarChange={(dates) => {
              setStartDate(dates[0]);
              setEndDate(dates[1]);
            }}
            onChange={(values) => {
              setStartDate(values[0]);
              setEndDate(values[1]);
              console.log(values);
            }}
          />
        </div>
      )}
    </Modal>
  );
};

AdminCreateKitchenEventModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  date: PropTypes.object.isRequired,
  setUserEvents: PropTypes.func.isRequired,
};

export default AdminCreateKitchenEventModal;
