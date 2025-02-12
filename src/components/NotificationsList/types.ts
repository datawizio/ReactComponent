import React from "react";
import { ListProps as AntListProps } from "antd/es/list";

export interface IListItem {
  id: string;
  title: string;
  read: boolean;
  createdAt: string;
}

export type RenderItemProps<T> = {
  item: T;
  onCheckChange?: any;
  checked?: boolean;
};

export interface ListProps<T> extends Omit<AntListProps<T>, "renderItem"> {
  dataProvider: (
    state: ListState<T>
  ) => Partial<ListState<T>> | Promise<Partial<ListState<T>>> | void;
  dataProviderDeps: (state: ListState<T>) => any[];
  total?: number;
  pageSize?: number;
  currentPage?: number;
  showAllColumns?: boolean;
  renderItem?: (props: RenderItemProps<T>) => React.ReactElement;
  parseMessage?: (message: any) => Partial<ListState<T>> | null;
  messageId?: string;
  actions?: any;
  updateSubscription?: {
    message?: any;
    callback: (message: any, dispatch: any) => void;
  };
  groupListItems?: (item: Array<T>) => Array<T & { groupName?: string }>;
  nothingHereMessage?: React.ReactElement;
  showActions?: boolean;
}

export interface ListState<T> extends ListProps<T> {
  checkedKeys: Set<string>;
  checkedAllOnPage: null | "partial" | "all";
  checkedAll: boolean;
  force: number;
}

export type Action<T> =
  | { type: "update"; payload: Partial<ListState<T>> }
  | { type: "updateItems"; payload: Partial<ListState<T>>[] }
  | { type: "paginate"; payload: { page: number; pageSize: number } }
  | { type: "updatePaginate"; payload?: string }
  | { type: "check"; payload: string }
  | { type: "checkAllOnPage"; payload?: boolean }
  | { type: "checkAll" }
  | { type: "reload" }
  | { type: "loading"; payload: boolean }
  | { type: "setChecked"; payload: string[] };

// Notification

export interface INotification extends IListItem {
  read: boolean;
  archive: boolean;
  description: string;
  message: string;
  createdAt: string;
  dtype: string;
  clientId: string;
  conf: {
    app_id: number;
    dashboard_id: string;
    widget_id: string;
    text: string;
    rule: any;
    rule_id: number;
    rule_name: string;
    rule_names: string[];
    report_name?: string;
    date_from?: string;
    days_count?: number;
    media_name?: string;
    thumbnail?: string;
  };
}

export interface NotificationActions {
  onOpenLink?: (e: React.MouseEvent<HTMLElement>) => void;
  onDelete?: (e: React.MouseEvent<HTMLElement>) => void;
  onRestore?: (e: React.MouseEvent<HTMLElement>) => void;
  onMarkAsRead?: (e: React.MouseEvent<HTMLElement>) => void;
  onMarkAsUnread?: (e: React.MouseEvent<HTMLElement>) => void;
}

export type NotificationPageType = "unread_page" | "deleted_page" | null;
