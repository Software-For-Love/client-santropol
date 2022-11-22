import { StyledCard } from "../VolunteerCard/styles";
import moment from "moment";

const PastShiftCard = ({ shift }) => {
  const { event_type, event_date } = shift;

  const formatEventType = (type) => {
    switch (type) {
      case "kitam":
        return "Kitchen AM";
      case "kitpm":
        return "Kitchen PM";
      default:
        return "Delivery";
    }
  };

  const formatEventDate = (date) => {
    // date format is YYMMDD
    console.log(date, "date");

    const year = "20" + date.slice(0, 2);
    const month = date.slice(2, 4);
    const day = date.slice(4, 6);
    return moment(`${year}-${month}-${day}`).format("MMMM Do YYYY");
  };

  return (
    <StyledCard title={formatEventDate(event_date.toString())}>
      <div
        style={{
          padding: "1rem",
        }}
      >
        <p>{`Event type: ${formatEventType(event_type)}`}</p>
      </div>
    </StyledCard>
  );
};

export default PastShiftCard;
