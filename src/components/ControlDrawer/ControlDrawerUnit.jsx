import React from "react";
import PropTypes from "prop-types";

import "./../../styles/controlDrawerUnit.styles.scss";
import NumericControl from "./ControlUnits/NumericControl.jsx";
import DropdownControl from "./ControlUnits/DropdownControl";

const ControlDrawerUnit = ({
  type,
  name,
  value,
  min,
  max,
  options,
  onChange,
  description,
  buttonChangeValue,
}) => {
  switch (type) {
    case "numeric":
      return (
        <NumericControl
          name={name}
          value={value}
          min={min}
          max={max}
          onChange={onChange}
          description={description}
          buttonChangeValue={buttonChangeValue}
        />
      );
    case "dropdown":
      return (
        <DropdownControl
          name={name}
          value={value}
          options={options}
          onChange={onChange}
          description={description}
        />
      );
    default:
      return null;
  }
};

ControlDrawerUnit.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  options: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  description: PropTypes.string,
  buttonChangeValue: PropTypes.number,
};

export default ControlDrawerUnit;
