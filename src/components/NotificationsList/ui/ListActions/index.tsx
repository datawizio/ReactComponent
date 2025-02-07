import React, { useContext } from "react";
import Button from "../../../Button";
import { useTranslation } from "react-i18next";

import { UndoOutlined } from "@ant-design/icons";
import { EnvelopeIcon } from "../../../Icons/EnvelopeIcon";
import { DeleteIcon } from "../../../Icons/DeleteIcon";
import { MailIcon } from "../../../Icons/MailIcon";

import { NotificationsListContext } from "../../context";
import { NotificationPageType } from "../../types";

import "./index.less";

interface ListActionsProps {
  pageType?: NotificationPageType;
  onMarkRead: () => void;
  onMarkUnread: () => void;
  onRestore: () => void;
  onDelete: () => void;
}

export const ListActions: React.FC<ListActionsProps> = React.memo(
  ({ pageType, onMarkRead, onMarkUnread, onRestore, onDelete }) => {
    const { t } = useTranslation();
    const { state } = useContext(NotificationsListContext);

    const checkedKeysData = state?.dataSource?.filter(item =>
      state.checkedKeys.has(item.id)
    );

    const isSomeRead = checkedKeysData?.some(item => item.read);
    const isSomeUnread = checkedKeysData?.some(item => !item.read);

    return state?.checkedKeys && state?.checkedKeys.size > 0 ? (
      <div className="notifications-actions">
        {isSomeUnread && (
          <Button onClick={onMarkRead} type="link" icon={<EnvelopeIcon />}>
            {t("MARK_AS_READ")}
          </Button>
        )}
        {isSomeRead && (
          <Button onClick={onMarkUnread} type="link" icon={<MailIcon />}>
            {t("MARK_AS_UNREAD")}
          </Button>
        )}
        {pageType === "deleted_page" && (
          <Button onClick={onRestore} type="link" icon={<UndoOutlined />}>
            {t("REVERT")}
          </Button>
        )}
        <Button onClick={onDelete} type="link" icon={<DeleteIcon />}>
          {t("DELETE")}
        </Button>
      </div>
    ) : null;
  }
);

ListActions.defaultProps = {
  pageType: null
};
