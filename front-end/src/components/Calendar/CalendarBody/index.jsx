import React from "react";
import Body from "./styles";
import Button from "../../Button";
import PropTypes from "prop-types";
import moment from "moment";
import { Col } from "antd";
import CalendarCell from "../CalendarCell";

const CalendarBody = (props) => {
  const { date } = props;
  const startOfWeek = moment(date).startOf("week");

  return (
    <Body justify='space-between'>
      {[...Array(7)].map((_, i) => {
        const day = startOfWeek.add(i, "days");
        return (
          <Col span={3}>
            <Button key={i} type='primary' rounded fullWidth>
              {day.format("Do MMM")}
            </Button>
            {[...Array(3)].map((_, j) => (
              <CalendarCell />
            ))}
          </Col>
        );
      })}
    </Body>
  );
};

CalendarBody.propTypes = {
  date: PropTypes.object.isRequired,
};

export default CalendarBody;
