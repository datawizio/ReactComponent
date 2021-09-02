import * as React from "react";
import { Dropdown, Menu, message } from "antd";
import { saveAs } from "file-saver";
import { TableState } from "../Table/types";

import { useContext, useCallback, useMemo, useState } from "react";
import { TableContext } from "../Table/context";
import ConfigContext from "../ConfigProvider/context";

import Button, { ButtonProps } from "../Button";
import { DownloadOutlined } from "@ant-design/icons";

import "./index.less";

export interface TableXlsxExporterProps extends ButtonProps {
  filename?: string;
  getFilename?: () => string;
  menuItems?: any;
  duration?: number;
  exportHandler?: (
    tableState: TableState | null,
    filename: string
  ) => Promise<BlobPart> | Promise<void> | null;
  exportHandlerCallback?: (fileData: BlobPart | Blob, filename: string) => any;
}

const TableXlsxExporter: React.FC<TableXlsxExporterProps> = props => {
  const {
    menuItems,
    exportHandler,
    exportHandlerCallback,
    getFilename,
    duration,
    filename,
    title,
    children,
    ...restProps
  } = props;

  const { translate } = useContext(ConfigContext);
  const [loading, setLoading] = useState<boolean>(false);
  const context = useContext(TableContext);

  const tableState = useMemo(() => {
    if (context) {
      return context.tableState;
    }
    return null;
  }, [context]);

  const handleMenuClick = e => {
    if (e.key === "exporter") {
      handleExport();
    }
  };

  const handleExport = useCallback(async () => {
    if (exportHandler) {
      let file = filename;
      if (getFilename) {
        file = getFilename();
      }
      const messageKey = "exporting-" + file;

      message.loading({
        content: translate("LOADING"),
        key: messageKey,
        duration: duration
      });
      setLoading(true);
      const fileData = await exportHandler(tableState, file);
      fileData && saveAs(new Blob([fileData]), file);

      message.success({ content: translate("SUCCESS"), key: messageKey });
      setLoading(false);
      if (exportHandlerCallback && fileData) {
        await exportHandlerCallback(new Blob([fileData]), file);
      }
    }
  }, [
    tableState,
    translate,
    exportHandler,
    filename,
    getFilename,
    exportHandlerCallback
  ]);

  const menu = useMemo(
    () =>
      menuItems ? <Menu onClick={handleMenuClick}>{menuItems}</Menu> : null,
    [menuItems]
  );
  // console.log(menu);

  return (
    <div className="table-xlsx-exporter table-toolbar--right">
      {menu ? (
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button
            icon={<DownloadOutlined className={"table-xlsx-exporter__icon"} />}
            loading={loading}
            border={false}
            {...restProps}
            // onClick={handleExport}
            title={title ? title : translate("SAVE_BTN_TITLE")}
          />
        </Dropdown>
      ) : (
        <Button
          icon={<DownloadOutlined className={"table-xlsx-exporter__icon"} />}
          loading={loading}
          border={false}
          {...restProps}
          onClick={handleExport}
          title={title ? title : translate("SAVE_BTN_TITLE")}
        />
      )}
    </div>
  );
};

TableXlsxExporter.defaultProps = {
  filename: "exported_table.xlsx"
};

export default TableXlsxExporter;
