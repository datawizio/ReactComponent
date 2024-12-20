import {
  DownOutlined,
  SendOutlined,
  VerticalAlignBottomOutlined
} from "@ant-design/icons";
import { Dropdown, Menu, message } from "antd";
import React, { useCallback, useContext, useMemo } from "react";
import Button, { ButtonProps } from "../Button";
import Checkbox from "../Checkbox";
import ConfigContext from "../ConfigProvider/context";
import { TableContext } from "../Table/context";
import { TableState } from "../Table/types";
import { saveAs } from "file-saver";
import "./index.less";

export interface TableMenuProps extends ButtonProps {
  filename?: string;
  getFilename?: () => string;
  menuItems?: any;
  config?: any;
  settings?: any;
  duration?: number;
  exportHandler?: (
    tableState: TableState | null,
    filename: string,
    hideLoadingMessageFn?: () => void
  ) => Promise<BlobPart> | Promise<void> | null;
  exportHandlerCallback?: (fileData: BlobPart | Blob, filename: string) => any;
  onSendClick?: (expand?: "horizontally" | "grouped") => Promise<void>;
  onTotalClick?: (e: any) => void;
  onExpandVertical?: (e: any) => void;
  onExpandHorizontal?: (e: any) => void;
}

const TableMenu: React.FC<TableMenuProps> = props => {
  const {
    config = {},
    settings = {},
    onSendClick,
    exportHandler,
    exportHandlerCallback,
    getFilename,
    filename,
    duration,
    onTotalClick,
    onExpandHorizontal,
    onExpandVertical,
    ...restProps
  } = props;
  const { translate } = useContext(ConfigContext);

  const context = useContext(TableContext);

  const { expand_horizontally } = settings;
  const {
    fixed_total,
    expand_table_vertically,
    expand_table_horizontally,
    show_export_xls,
    show_send_to_email,
    is_visualization,
    max_level = 1
  } = config;

  const { tableState, dispatch } = useMemo(() => {
    if (context) {
      return { tableState: context.tableState, dispatch: context.dispatch };
    }
    return { tableState: null, dispatch: null };
  }, [context]);

  const handleExport = useCallback(
    async () => {
      if (exportHandler) {
        let file = filename;
        if (getFilename) {
          file = getFilename();
        }
        const messageKey = "exporting-" + file;

        const hideLoadingMessageFn = message.loading({
          content: translate("LOADING"),
          key: messageKey,
          duration: duration
        });

        const fileData = await exportHandler(
          tableState,
          file,
          hideLoadingMessageFn
        );

        if (!fileData) return;

        saveAs(new Blob([fileData]), file);

        message.success({ content: translate("SUCCESS"), key: messageKey });

        if (exportHandlerCallback && fileData) {
          await exportHandlerCallback(new Blob([fileData]), file);
        }
      }
    },
    //eslint-disable-next-line
    [
      tableState,
      translate,
      exportHandler,
      filename,
      getFilename,
      exportHandlerCallback
    ]
  );

  const handleTotalClick = useCallback(
    (e: any) => {
      e?.stopPropagation();
      e?.preventDefault();
      dispatch &&
        dispatch({
          type: "update",
          payload: {
            fixedTotal: !tableState?.fixedTotal,
            pagination: {
              ...tableState.pagination,
              current: 1
            }
          }
        });
    },
    [dispatch, tableState]
  );

  const handleMenuClick = (e: any) => {
    switch (e.key) {
      case "export_xlsx":
        void handleExport();
        break;
      case "send_xlsx":
        void onSendClick(expand_horizontally);
        break;
      default:
        break;
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick} className="table-menu-dropdown">
      {fixed_total && (
        <Menu.Item key="fixed_total" className="menu-item-checkbox">
          <Checkbox
            checked={Boolean(tableState?.fixedTotal)}
            onClick={handleTotalClick}
          >
            {translate("FIXED_TOTAL")}
          </Checkbox>
        </Menu.Item>
      )}
      {expand_table_vertically && (
        <Menu.Item key="expand_table_vertically" className="menu-item-checkbox">
          <Checkbox onClick={onExpandVertical}>
            {translate("EXPAND_THE_TABLE_VERTICALLY")}
          </Checkbox>
        </Menu.Item>
      )}
      {expand_table_horizontally && (
        <Menu.Item
          key="expand_table_horizontally"
          className="menu-item-checkbox"
        >
          <Checkbox onClick={onExpandHorizontal}>
            {translate("EXPAND_TABLE_HORIZONTALLY")}
          </Checkbox>
        </Menu.Item>
      )}
      {(fixed_total ||
        expand_table_vertically ||
        expand_table_horizontally) && (
        <Menu.Divider className={"table-menu-dropdown__divider"} />
      )}
      {show_export_xls !== false && (
        <Menu.Item
          key="export_xlsx"
          icon={
            <VerticalAlignBottomOutlined
              className={"table-menu-dropdown__icon"}
            />
          }
        >
          {translate("SAVE_XLS")}
        </Menu.Item>
      )}
      {show_send_to_email &&
        (is_visualization && max_level > 1 ? (
          <Menu.SubMenu
            key="send_xlsx_submenu"
            title={
              <>
                <SendOutlined className={"table-menu-dropdown__icon__send"} />
                {translate("SEND_XLS")}
              </>
            }
          >
            <Menu.Item key="without_expand_tree" onClick={() => onSendClick()}>
              {translate("WITHOUT_EXPAND_TREE")}
            </Menu.Item>
            <Menu.SubMenu
              key="send_xlsx_expand_submenu"
              title={translate("APPLY_EXPAND_TREE")}
            >
              {!expand_horizontally && (
                <Menu.Item
                  key="expand_tree_horizontally"
                  onClick={() => onSendClick("horizontally")}
                >
                  {translate("EXPAND_TREE_HORIZONTALLY")}
                </Menu.Item>
              )}
              <Menu.Item
                key="expand_tree_grouped"
                onClick={() => onSendClick("grouped")}
              >
                {translate("EXPAND_TREE_GROUPED")}
              </Menu.Item>
            </Menu.SubMenu>
          </Menu.SubMenu>
        ) : (
          <Menu.Item
            key="send_xlsx"
            icon={
              <SendOutlined className={"table-menu-dropdown__icon__send"} />
            }
          >
            {translate("SEND_XLS")}
          </Menu.Item>
        ))}
    </Menu>
  );

  const hasMenuItem =
    show_send_to_email ||
    show_export_xls !== false ||
    expand_table_horizontally ||
    expand_table_vertically ||
    fixed_total;

  return hasMenuItem ? (
    <div className="table-menu table-toolbar--right">
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button
          className="table-menu__button"
          icon={<DownOutlined className={"table-menu__icon"} />}
          border={false}
          {...restProps}
        />
      </Dropdown>
    </div>
  ) : null;
};

TableMenu.defaultProps = {
  filename: "exported_table.xlsx"
};

export default TableMenu;
