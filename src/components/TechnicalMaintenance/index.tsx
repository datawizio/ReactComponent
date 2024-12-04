import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Row } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./index.less";

interface TechnicalMaintenanceProps {
  messageKey?: string;
}

const TechnicalMaintenance: React.FC<TechnicalMaintenanceProps> = ({
  messageKey = "THE_SERVICE_IS_TEMPORARILY_UNAVAILABLE"
}) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState<boolean>(true);

  const onClose = () => {
    setVisible(false);
  };

  return visible ? (
    <Row className="maintenance-container">
      <div className="maintenance-container-message">
        <p>{t(messageKey)}</p>
      </div>
      <CloseOutlined
        className="maintenance-container-close-btn"
        onClick={onClose}
      />
    </Row>
  ) : null;
};

export default TechnicalMaintenance;
