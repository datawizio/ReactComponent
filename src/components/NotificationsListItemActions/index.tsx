import React from "react";

import Button from "../Button";
import { useTranslation } from "react-i18next";

import { UndoOutlined } from "@ant-design/icons";

import { DeleteIcon } from "../Icons/DeleteIcon";
import { EnvelopeIcon } from "../Icons/EnvelopeIcon";
import { MailIcon } from "../Icons/MailIcon";
import { OpenPageIcon } from "../Icons/OpenPageIcon";

import {
  INotification,
  NotificationActions,
  NotificationPageType
} from "../NotificationsList/types";

import "./index.less";

interface ListItemActionsProps extends NotificationActions {
  item: INotification;
  pageType?: NotificationPageType;
  link?: string | null;
}

const ListItemActions: React.FC<ListItemActionsProps> = ({
  item,
  pageType,
  link,
  onOpenLink,
  onDelete,
  onRestore,
  onMarkAsRead,
  onMarkAsUnread
}) => {
  const { t } = useTranslation();

  return (
    <div className="list-item-actions">
      {link && (
        <Button
          icon={<OpenPageIcon />}
          title={t("NAVIGATE_TO")}
          border={false}
          type="default"
          className="dw-list-go-to"
          onClick={onOpenLink}
        />
      )}
      {item.read ? (
        <Button
          icon={<MailIcon />}
          title={t("MARK_AS_UNREAD")}
          border={false}
          highlight
          type="default"
          className="dw-list-mail"
          onClick={onMarkAsUnread}
        />
      ) : (
        <Button
          icon={<EnvelopeIcon />}
          title={t("MARK_AS_READ")}
          border={false}
          highlight
          type="default"
          className="dw-list-mail"
          onClick={onMarkAsRead}
        />
      )}
      {pageType === "deleted_page" && (
        <Button
          icon={<UndoOutlined />}
          title={t("REVERT")}
          danger
          border={false}
          highlight
          type="default"
          className="dw-list-restore"
          onClick={onRestore}
        />
      )}
      <Button
        icon={<DeleteIcon />}
        title={t("DELETE")}
        danger
        border={false}
        highlight
        type="default"
        className="dw-list-delete"
        onClick={onDelete}
      />
    </div>
  );
};

ListItemActions.defaultProps = {
  pageType: null
};

export default ListItemActions;
