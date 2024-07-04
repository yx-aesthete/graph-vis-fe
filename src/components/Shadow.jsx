import React from "react";
import PropTypes from "prop-types";
import "./../styles/shadow.styles.scss";

const Shadow = ({ isVisible }) => {
  return isVisible ? <div className="shadow" /> : null;
};

Shadow.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default Shadow;
