import React from "react";
import clsx from "clsx";

import "./index.less";

export interface AppLoaderProps {
  /**
   * The source URL for the image
   * that will be displayed within the loader component.
   */
  imageSrc: string;
}

const AppLoader: React.FC<AppLoaderProps> = ({ imageSrc }) => {
  const theme = localStorage.getItem("theme");
  const isDark = theme === "dark";

  return (
    <div className={clsx("loader", isDark && "loader-dark")}>
      <div className="loader-wrapper">
        <div className="loader-container">
          <div className="loader-logo-container">
            <div className="loader-logo">
              <img alt="loader" src={imageSrc} />
            </div>
          </div>
        </div>
        <div className="loader-spinner"></div>
      </div>
    </div>
  );
};

export default AppLoader;
