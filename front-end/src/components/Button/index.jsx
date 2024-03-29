import Button from "./styles";
import PropTypes from "prop-types";

const index = (props) => {
  const { children, ...rest } = props;
  //type : primary | secondary | tertiary
  return (
    <Button {...rest} onMouseDown={(e) => e.preventDefault()}>
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
  fullWidth: PropTypes.bool,
  isActive: PropTypes.bool,
  htmlType: PropTypes.string,
  style: PropTypes.object,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default index;
