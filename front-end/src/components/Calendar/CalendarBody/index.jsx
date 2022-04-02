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

  const plusIconClickHandler = (index) => {
    const newNumberOfCells = [...numberOfCells];
    newNumberOfCells[index] += 1;
    setNumberOfCells(newNumberOfCells);
  };

  return (
    <Body justify='space-between'>
      {[...Array(7)].map((_, i) => {
        const day = startOfWeek.clone().add(i, "days");
        return (
          <Col span={3}>
            <Button key={i} type='primary' rounded fullWidth>
              {day.format("Do MMM")}
            </Button>
            {[...Array(numberOfCells[i])].map((_, j) => (
              <CalendarCell
                type={type}
                date={day}
                volunteerInfo={info[j]}
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
