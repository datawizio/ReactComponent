import { createContext, Dispatch } from "react";
import { Action, IListItem, ListState } from "./types";

export const NotificationsListContext = createContext<{
  state: ListState<IListItem> | null;
  dispatch: Dispatch<Action<IListItem>> | null;
}>({ state: null, dispatch: null });

NotificationsListContext.displayName = "NotificationsListContext";
