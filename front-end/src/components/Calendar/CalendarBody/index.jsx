import React, { useState } from "react";
import Body, { PlusIcon } from "./styles";
import Button from "../../Button";
import PropTypes from "prop-types";
import moment from "moment";
import { Col } from "antd";
import CalendarCell from "../CalendarCell";

const CalendarBody = (props) => {
  const { date, type, info, variant } = props;
  const startOfWeek = moment(date).startOf("week");
  const [numberOfCells, setNumberOfCells] = useState([3, 3, 3, 3, 3, 3, 3]);

  const getDailyEvents = () => {
    const result = [[], [], [], [], [], [], []];
    info.forEach(({ data }) => {
      const { event_date, first_name, last_name } = data;
      const year = event_date.toString().substring(0, 2);
      const month = event_date.toString().substring(2, 4);
      const day = event_date.toString().substring(4, 6);

      const eventDate = moment(`20${year}-${month}-${day}`);
      const eventIndex = eventDate.weekday();
      result[eventIndex].push({
        ...data,
        volunteerInfo: {
          firstName: first_name,
          lastName: last_name,
        },
      });
    });
    return result;
  };

  const events = getDailyEvents();

  const plusIconClickHandler = (index) => {
    const newNumberOfCells = [...numberOfCells];
    newNumberOfCells[index] += 1;
    setNumberOfCells(newNumberOfCells);
  };

  return (
    <Body justify="space-between">
      {events.map((_, i) => {
        const day = startOfWeek.clone().add(i, "days");
        return (
          <Col span={3}>
            <Button key={i} type="primary" rounded fullWidth>
              {day.format("Do MMM")}
            </Button>
            {events[i].map((item) => (
              <CalendarCell
                type={type}
                date={day}
                volunteerInfo={item.volunteerInfo}
                variant={variant}
              />
            ))}
            {type === "admin" && (
              <PlusIcon onClick={() => plusIconClickHandler(i)} />
            )}
          </Col>
        );
      })}
    </Body>
  );
};

CalendarBody.propTypes = {
  date: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  info: PropTypes.array,
  variant: PropTypes.string,
};

export default CalendarBody;
