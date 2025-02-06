import React from "react";

import Checkbox from "../../Checkbox";
import { Button } from "antd";

import { useTranslation } from "react-i18next";
import { CheckboxChangeEvent } from "antd/es/checkbox";

import "./Header.less";

interface ListHeaderProps {
  checkedCount: number;
  checkboxStatus: null | "partial" | "all";
  total?: number;
  actions?: any;
  onChecked: (e: CheckboxChangeEvent) => void;
  onCheckAll: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ListHeader: React.FC<ListHeaderProps> = ({
  checkboxStatus,
  checkedCount,
  total,
  actions,
  onChecked,
  onCheckAll
}) => {
  const { t } = useTranslation();

  return (
    <div className="dw-list-header">
      <div>
        <Checkbox
          checked={checkboxStatus === "all"}
          indeterminate={checkboxStatus === "partial"}
          onChange={onChecked}
        />
      </div>
      {checkedCount > 0 && (
        <div className="selected-count">
          {t("SELECTED_NOTIFICATIONS", { count: checkedCount, total })}
        </div>
      )}
      {checkboxStatus === "all" && (
        <div className="select-all-container">
          <Button type="link" onClick={onCheckAll}>
            {t("SELECT_ALL_NOTIFICATIONS", { total })}
          </Button>
        </div>
      )}
      <div className="fill-place"></div>
      {actions}
    </div>
  );
};
