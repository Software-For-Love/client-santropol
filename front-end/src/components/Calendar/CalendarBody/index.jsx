import React, { useState, useEffect, useCallback, useContext } from "react";
import Body, { PlusIcon } from "./styles";
import Button from "../../Button";
import PropTypes from "prop-types";
import moment from "moment";
import { Col } from "antd";
import CalendarCell from "../CalendarCell";
import { AuthContext } from "../../../Contexts/AuthContext";
import AxiosInstance from "../../../API/api";

const CalendarBody = (props) => {
  const { userType } = useContext(AuthContext);
  const { date, info, variant, getEvents, eventSlots } = props;
  const startOfWeek = moment(date).startOf("week");
  const [events, setEvents] = useState([[], [], [], [], [], [], []]);
  const [buttonColors, setButtonColors] = useState([]); // each day has a button color depending on if all the events are full or not

  const getDailyEvents = useCallback(() => {
    const result = [[], [], [], [], [], [], []];
    const newButtonColors = [...buttonColors];

    info.forEach(({ data, id, cancelled }) => {
      const { event_date, first_name, last_name } = data;
      const event_id = id;
      const year = event_date.toString().substring(0, 2);
      const month = event_date.toString().substring(2, 4);
      const day = event_date.toString().substring(4, 6);

      // convert the event_date number to moment object
      const eventDate = moment(`20${year}-${month}-${day}`);

      // get the day of the week of the event_date (monday = 0, sunday = 6))
      const eventIndex = eventDate.weekday();
      // add to the result array
      result[eventIndex].push({
        cancelled,
        data,
        event_id,
        volunteerInfo: {
          firstName: first_name,
          lastName: last_name,
        },
      });
    });

    // We need to have minimum of three events per day
    result.forEach((dailyEvents, index) => {
      const todaysDate = moment(startOfWeek).add(index, "days");

      const todaysEventSlots = eventSlots.find((eventSlot) => {
        return (
          eventSlot.data.dateNumber === parseInt(todaysDate.format("YYMMDD"))
        );
      });

      let slotNumber = 6;
      if (todaysEventSlots && todaysEventSlots.data.slots > 6) {
        slotNumber = todaysEventSlots.data.slots;
      }

      const length = slotNumber - dailyEvents.length; // number of empty events needed to fill up the column

      if (length > 0) {
        // if we need to add empty events to the column it means we have to change the button color
        newButtonColors[index] = "#9F6496";
      } else {
        newButtonColors[index] = "#6B9864";
      }
      for (let i = 0; i < length; i++) {
        dailyEvents.push({
          event_date: todaysDate.format("YYMMDD"),
          first_name: null,
          last_name: null,
        });
      }
    });
    setButtonColors(newButtonColors);
    setEvents(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);

  useEffect(() => {
    getDailyEvents();
  }, [getDailyEvents]);

  const plusIconClickHandler = async (index) => {
    const newNumberOfCells = [...events];
    newNumberOfCells[index].push({});
    await AxiosInstance.post("/events/setEventGroup", {
      eventType: variant,
      eventDate: parseInt(newNumberOfCells[index][0].event_date),
      slots: newNumberOfCells[index].length,
    });

    setEvents(newNumberOfCells);
  };

  return (
    <Body justify="space-between">
      {events.map((dailyEvents, i) => {
        const day = startOfWeek.clone().add(i, "days");
        return (
          <Col span={3} key={day}>
            <Button
              key={i}
              type="primary"
              rounded
              fullWidth
              style={{
                backgroundColor: buttonColors[i],
                borderRadius: "10px",
                minHeight: "60px",
                fontWeight: 600,
                color: "#000",
                cursor: "default",
              }}
            >
              <>
                {day.format("dddd")}
                <br />
                {day.format("Do")}
              </>
            </Button>
            {dailyEvents.map((item, j) => (
              <CalendarCell
                key={`cell-${i}-${j}`}
                date={day}
                volunteerInfo={item.volunteerInfo}
                eventInfo={item}
                variant={variant}
                event_id={item.event_id}
                data={item}
                getEvents={getEvents}
              />
            ))}
            {userType === "admin" && (
              <PlusIcon
                onClick={() => {
                  plusIconClickHandler(i);
                }}
              />
            )}
          </Col>
        );
      })}
    </Body>
  );
};

CalendarBody.propTypes = {
  date: PropTypes.object.isRequired,
  info: PropTypes.array,
  variant: PropTypes.string,
  eventSlots: PropTypes.array,
};

export default CalendarBody;
