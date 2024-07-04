import React from "react";
import PropTypes from "prop-types";
import "./../../../styles/controlDrawerUnit.styles.scss";

const CheckboxControl = ({ name, value, onChange, description }) => {
  const handleCheckboxChange = (e) => {
    onChange(name, e.target.checked);
  };

  return (
    <div className="unit-container">
      <div className="control-section-unit">
        <div className="unit-name">{name.replace(/_/g, " ")}</div>
        <input
          type="checkbox"
          className="unit-input"
          id={name}
          name={name}
          checked={value}
          onChange={handleCheckboxChange}
        />
        <div className="unit-description">{description}</div>
      </div>
    </div>
  );
};

CheckboxControl.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  description: PropTypes.string,
};

export default CheckboxControl;
