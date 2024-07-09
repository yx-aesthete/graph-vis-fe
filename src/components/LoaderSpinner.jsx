import React, { useEffect, useState } from "react";
import { Circles } from "react-loader-spinner";
import "./../styles/lodaer.styles.scss";
import PropTypes from "prop-types";

export default function LoaderSpinner({ isDisplayBlock, text }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (text && text.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % text.length);
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [text]);

  return (
    <div
      className={`loader-background ${isDisplayBlock ? "loader-block" : ""}`}
    >
      <div className="loader-container">
        <Circles
          height="80"
          width="80"
          color="#fb6161"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
        {text && text.length > 0 && (
          <div className="loader-text">
            <div className="loader-text-item">{text[currentIndex]}</div>
          </div>
        )}
      </div>
    </div>
  );
}

LoaderSpinner.propTypes = {
  isDisplayBlock: PropTypes.bool,
  text: PropTypes.arrayOf(PropTypes.string),
};

LoaderSpinner.defaultProps = {
  isDisplayBlock: false,
  text: [],
};
