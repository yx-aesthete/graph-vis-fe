import React from "react";
import PropTypes from "prop-types";
import "./../styles/controlDrawerUnit.styles.scss";

const ButtonControl = ({ onClick, label }) => {
  return (
    <button
      className="control-button"
      onClick={onClick}
      style={{ backgroundColor: "#fb6161" }}
    >
      {label}
    </button>
  );
};

ButtonControl.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default ButtonControl;
