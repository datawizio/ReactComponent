import React from "react";
import Icon from "@ant-design/icons";

const OpenPageSvg = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.5833 15.5833H1.41667V1.41667H8.5L7.55556 0H1.88889C0.840556 0 0 0.85 0 1.88889V15.1111C0 16.15 0.840556 17 1.88889 17H15.1111C16.15 17 17 16.15 17 15.1111V9.44444L15.5833 8.5V15.5833ZM10.3889 0L11.3333 1.41667H14.6389L4.72222 11.3333L5.66667 12.2778L15.5833 2.36111V5.66667L17 6.61111V0H10.3889Z"
      fill="currentColor"
    />
  </svg>
);

export const OpenPageIcon = () => (
  <Icon component={OpenPageSvg} height={16} style={{ fontSize: 16 }} />
);
