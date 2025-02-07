import React from "react";
import Icon from "@ant-design/icons";

const EnvelopeSvg = () => (
  <svg
    width="18"
    height="17"
    viewBox="0 0 18 17"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 4.32011C18 3.77127 17.667 3.29102 17.154 3.02422L9.2954 0.536859C9.10298 0.475954 8.89975 0.473749 8.70666 0.532484C7.30145 0.959911 1.3076 2.78884 0.855 3.02422C0.342 3.29102 0 3.77127 0 4.32011L0 11.3113V15.1227C0 15.9612 0.81 16.6473 1.8 16.6473H16.2C17.19 16.6473 18 15.9612 18 15.1227V4.32011ZM16.2 4.49479L9 8.54834L1.66928 4.32011L9 2.08572L16.2 4.49479ZM1.8 15.1227V6.1727L8.48487 10.1903C8.80187 10.3808 9.19813 10.3808 9.51513 10.1903L16.2 6.1727V15.1227H1.8Z" />
  </svg>
);

export const EnvelopeIcon = () => <Icon component={EnvelopeSvg} />;
