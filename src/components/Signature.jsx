import React from "react";
import PropTypes from "prop-types";
import "./../styles/signature.scss";

const Signature = ({ isHomePage }) => {
  return (
    <div className={"author-caption-small"}>
      <span className="created-by">
        Created by <br />
      </span>
      <div className="signature-link">
        <a
          href="https://www.linkedin.com/in/michał-madejski-671b60134/"
          className="signature-link michal"
        >
          Michał Madejski
          <span className="hover-text">LinkedIn</span>
        </a>
        &nbsp;
        <a href="https://github.com/yx-aesthete" className="signature-link yx">
          yx-aesthete
          <span className="hover-text">GitHub</span>
        </a>
      </div>
    </div>
  );
};

Signature.propTypes = {
  isHomePage: PropTypes.bool.isRequired,
};

export default Signature;
