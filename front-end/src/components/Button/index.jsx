import Button from "./styles";
import PropTypes from "prop-types";

const index = (props) => {
  const { children } = props;
  return (
    <Button {...props} onMouseDown={(e) => e.preventDefault()}>
      {children}
    </Button>
  );
};

index.propTypes = {
  type: PropTypes.string,
  rounded: PropTypes.bool,
  rest: PropTypes.element,
  children: PropTypes.any,
  size: PropTypes.string,
  onClick: PropTypes.func,
};

export default index;
