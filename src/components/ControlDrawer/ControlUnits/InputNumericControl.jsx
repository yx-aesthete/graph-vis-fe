import React from "react";
import PropTypes from "prop-types";
import "./../../../styles/controlDrawerUnit.styles.scss";

const InputNumericControl = ({
  name,
  value,
  min,
  max,
  onChange,
  description,
  buttonChangeValue,
}) => {
  const handleInputChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onChange(name, newValue);
    }
  };

  const handleSliderChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onChange(name, newValue);
    }
  };

  const calculateThumbColor = (value, min, max) => {
    const ratio = (value - min) / (max - min);
    const red = Math.round(234 + ratio * (133 - 234));
    const green = Math.round(92 + ratio * (175 - 92));
    const blue = Math.round(92 + ratio * (251 - 92));
    return `rgba(${red}, ${green}, ${blue}, 1)`;
  };

  const thumbColor = calculateThumbColor(value, min, max);

  return (
    <div className="unit-container">
      <div className="number-values">
        <div className="control-section-unit">
          <div className="unit-name">{name.replace(/_/g, " ")}</div>
          <div>
            <input
              className="unit-input"
              type="number"
              id={name}
              name={name}
              value={value}
              min={min}
              max={max}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      <div className="unit-description">{description}</div>
    </div>
  );
};

InputNumericControl.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  description: PropTypes.string,
  buttonChangeValue: PropTypes.number.isRequired,
};

export default InputNumericControl;
