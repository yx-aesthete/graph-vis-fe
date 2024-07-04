import React from "react";
import { Circles } from "react-loader-spinner";
import "./../styles/lodaer.styles.scss";

export default function FullPageReloaderSpinner() {
  return (
    <div className="loader-background">
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
      </div>
    </div>
  );
}
