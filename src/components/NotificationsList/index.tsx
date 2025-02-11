import React, { useCallback, useMemo, useReducer } from "react";
import List from "../List";
import { IListItem, ListProps } from "./types";
import { initializer, reducer } from "./reducer";
import { ListHeader } from "./ui/Header";
import { NotificationsListContext } from "./context";
import useWebSocket from "./useWebSocket";

import "./index.less";

const NotificationsList: React.FC<ListProps<IListItem>> = props => {
  const [state, dispatch] = useReducer(reducer, props, initializer);

  const {
    dataSource,
    total,
    loading,
    checkedKeys,
    checkedAllOnPage,
    checkedAll
  } = state;

  useWebSocket(state, dispatch, props);

  const onCheckChange = useCallback((key: string) => {
    dispatch({ type: "check", payload: key });
  }, []);

  const pagination = useMemo(() => {
    return {
      defaultPageSize: 20,
      pageSizeOptions: ["20", "35", "50", "100"],
      total,
      showSizeChanger: true,
      onChange: (page: number, pageSize: number) => {
        window.scrollTo(0, 0);
        dispatch({ type: "paginate", payload: { page, pageSize } });
      }
    };
  }, [total]);

  if (!dataSource?.length) {
    return props.nothingHereMessage ?? null;
  }

  return (
    <NotificationsListContext.Provider value={{ state, dispatch }}>
      <List
        className={`dw-list ${props.className}`}
        header={
          props.showActions ? (
            <ListHeader
              checkedCount={checkedAll ? total ?? 0 : checkedKeys.size}
              total={total}
              checkboxStatus={checkedAllOnPage}
              onChecked={() => dispatch({ type: "checkAllOnPage" })}
              onCheckAll={() => dispatch({ type: "checkAll" })}
              actions={props.actions}
            />
          ) : undefined
        }
        loading={loading}
        dataSource={
          props.groupListItems ? props.groupListItems(dataSource) : dataSource
        }
        pagination={props.showActions ? pagination : undefined}
        renderItem={(item: IListItem) =>
          props.renderItem ? (
            props.renderItem({
              item,
              checked: checkedKeys.has(item.id),
              onCheckChange
            })
          ) : (
            <List.Item>{item.id}</List.Item>
          )
        }
      />
    </NotificationsListContext.Provider>
  );
};

export default NotificationsList;
