import React from "react";
import PropTypes from "prop-types";
import "./../../../styles/controlDrawerUnit.styles.scss";

const DropdownControl = ({ name, value, options, onChange, description }) => {
  const handleSelectChange = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    onChange(name, e.target.value);
  };

  return (
    <div className="unit-container">
      <div className="control-section-unit">
        <div className="unit-name">{name.replace(/_/g, " ")}</div>
        <div className="dropdown-input-row">
          <select
            className="unit-input-dropdown"
            value={value}
            onChange={handleSelectChange}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <div className="unit-name">{value}</div>
          </select>
        </div>
        <div className="unit-description">{description}</div>
      </div>
    </div>
  );
};

DropdownControl.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  description: PropTypes.string,
};

export default DropdownControl;
