import React from "react";
import PropTypes from "prop-types";
import "./../../../styles/controlDrawerUnit.styles.scss";

const NumericControl = ({
  name,
  value,
  min,
  max,
  onChange,
  description,
  buttonChangeValue,
}) => {
  const incrementValue = () => {
    onChange(name, Math.min(value + buttonChangeValue, max));
  };

  const decrementValue = () => {
    onChange(name, Math.max(value - buttonChangeValue, min));
  };

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
            <button
              className="control-button decrement"
              onClick={decrementValue}
            >
              -{buttonChangeValue}
            </button>
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
            <button
              className="control-button increment"
              onClick={incrementValue}
            >
              +{buttonChangeValue}
            </button>
          </div>
        </div>
      </div>
      <input
        className="range-input"
        type="range"
        id={name}
        name={name}
        value={value}
        min={min}
        max={max}
        onChange={handleSliderChange}
        // @ts-ignore
        style={{ "--thumb-color": thumbColor }}
      />
      <div className="unit-description">{description}</div>
    </div>
  );
};

NumericControl.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  description: PropTypes.string,
  buttonChangeValue: PropTypes.number.isRequired,
};

export default NumericControl;
