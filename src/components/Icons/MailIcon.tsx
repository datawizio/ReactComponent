import React from "react";
import Icon from "@ant-design/icons";

const MailSvg = () => (
  <svg
    width="18"
    height="15"
    viewBox="0 0 18 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 2.35547C18 1.39297 17.19 0.605469 16.2 0.605469H9H1.8C0.81 0.605469 0 1.39297 0 2.35547V12.8555C0 13.818 0.81 14.6055 1.8 14.6055H16.2C17.19 14.6055 18 13.818 18 12.8555V2.35547ZM16.2 2.35547L9 6.72172L1.8 2.35547H16.2ZM16.2 12.8555H1.8V4.10547L8.48071 8.16493C8.79976 8.3588 9.20024 8.3588 9.51929 8.16493L16.2 4.10547V12.8555Z" />
  </svg>
);

export const MailIcon = () => <Icon viewBox="0 0 18 13" component={MailSvg} />;
