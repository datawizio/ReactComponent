import React, { useMemo } from "react";
import clsx from "clsx";
import Checkbox from "../Checkbox";
import List from "../List";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import { INotification, RenderItemProps } from "../NotificationsList/types";

import "./index.less";

interface ListItemProps extends RenderItemProps<INotification> {
  onClick?: () => void;
  iconSrc?: string;
  actions?: React.ReactNode;
  showCheckbox?: boolean;
  formatDate?: (date: string) => string;
}

const ListItem: React.FC<ListItemProps> = ({
  item,
  onCheckChange,
  checked,
  onClick,
  iconSrc,
  formatDate,
  actions,
  showCheckbox
}) => {
  const { t } = useTranslation();

  const className = clsx([
    !item.read && "list-item-unread",
    checked && "list-item-checked"
  ]);

  const translateOptions = useMemo(() => {
    return {
      ...item.conf,
      report_name: item.conf.report_name ? t(item.conf.report_name) : undefined
    };
  }, [item, t]);

  return (
    <List.Item key={item.id} className={className} onClick={onClick}>
      {showCheckbox && (
        <Checkbox
          onChange={onCheckChange?.bind(null, item.id)}
          onClick={e => e.stopPropagation()}
          checked={checked}
        />
      )}

      {iconSrc && <img src={iconSrc} alt={item.title} width={34} height={34} />}

      <div className="list-item-title">
        <Typography.Text title={t(item.title, translateOptions)} ellipsis>
          {t(item.title, translateOptions)}
        </Typography.Text>

        <div>{formatDate ? formatDate(item.createdAt) : item.createdAt}</div>
      </div>

      {actions}
      {!item.read && <div className="list-item-status" />}
    </List.Item>
  );
};

export default ListItem;
