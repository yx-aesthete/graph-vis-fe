import React, { useState } from "react";
import PropTypes from "prop-types";
import { RiArrowRightWideFill, RiHomeFill } from "react-icons/ri";
import "./../../styles/navButton.styles.scss";

const HoverCircleIcon = ({
  icon: Icon,
  icon2: Icon2,
  hoverText1,
  hoverText2,
  onClick,
  onClick2,
  showSecondCircle,
  isOpen,
  isHomePage,
  isHovering,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  const [hovered, setHovered] = useState(null);

  const handleMouseEnterInternal = (element) => {
    setHovered(element);
  };

  const handleMouseLeaveInternal = () => {
    setHovered(null);
  };

  return (
    <div className="arrow-always-visible-right-container">
      <div
        className={`toggle-arrow ${isOpen ? "open" : "closed"}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <>
        <div
          onClick={onClick2}
          onMouseEnter={() => handleMouseEnterInternal("firstCircle")}
          onMouseLeave={handleMouseLeaveInternal}
          className={`background-circle ${isOpen ? "open" : "closed"} ${
            hovered === "firstCircle" ? "hovered-first" : ""
          }`}
        ></div>
        <div
          className={`second-background-circle ${isOpen ? "open" : "closed"} ${
            hovered === "secondCircle" ? "hovered-second" : ""
          } ${!showSecondCircle && "hide"}`}
          onMouseEnter={() => handleMouseEnterInternal("secondCircle")}
          onMouseLeave={handleMouseLeaveInternal}
          onClick={onClick}
        ></div>

        <Icon2
          onClick={onClick2}
          className={`second-icon ${
            hovered === "secondCircle" ? "hovered-second" : ""
          }
          ${isOpen ? "open" : "closed"}
          ${!showSecondCircle && "hide"}
          `}
          onMouseEnter={() => handleMouseEnterInternal("secondCircle")}
          onMouseLeave={handleMouseLeaveInternal}
        />
        <div
          className={`first-icon-container ${
            hovered === "firstCircle" ? "hovered-first" : ""
          }`}
        >
          <Icon
            className={`first-icon 
            ${hovered === "firstCircle" ? "hovered-first" : ""}               
            ${isOpen ? "open" : "closed"}`}
            onMouseEnter={() => handleMouseEnterInternal("firstCircle")}
            onMouseLeave={handleMouseLeaveInternal}
            onClick={onClick}
          />
        </div>
      </>
    </div>
  );
};

HoverCircleIcon.propTypes = {
  icon: PropTypes.elementType.isRequired,
  icon2: PropTypes.elementType,
  hoverText1: PropTypes.string,
  hoverText2: PropTypes.string,
  onClick: PropTypes.func,
  onClick2: PropTypes.func,
  showSecondCircle: PropTypes.bool,
  isOpen: PropTypes.bool,
  isHomePage: PropTypes.bool,
  isHovering: PropTypes.bool,
  handleMouseEnter: PropTypes.func,
  handleMouseLeave: PropTypes.func,
};

HoverCircleIcon.defaultProps = {
  onClick: () => {},
  onClick2: () => {},
  showSecondCircle: false,
  isOpen: false,
  isHomePage: false,
  isHovering: false,
  handleMouseEnter: () => {},
  handleMouseLeave: () => {},
};

export default HoverCircleIcon;
