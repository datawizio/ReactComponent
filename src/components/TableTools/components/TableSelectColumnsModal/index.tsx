import * as React from "react";

import Tree from "../../../Tree";
import Modal from "../../../Modal";
import Button from "../../../Button";
import { SettingOutlined } from "@ant-design/icons";

import { TableContext } from "../../../Table/context";
import { useState, useCallback, useMemo, useContext } from "react";

import "./index.less";
import { deepFilter } from "../../../../utils/deepFilter";

export interface TableSelectColumnsModalProps {
  locale?: {
    apply: string;
    checkAll: string;
    openButton: string;
    headerModal: string;
  };
}

const TableSelectColumnsModal: React.FC<TableSelectColumnsModalProps> = props => {
  const { locale } = props;
  const [tableState, setTableState, tableProps] = useContext(TableContext);

  const [isOpened, setIsOpened] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState(() => {
    return (
      tableState.visibleColumnsKeys ||
      tableProps.columns.map(column => column.key)
    );
  });

  const treeData = useMemo(() => {
    if (!isOpened) return [];
    return (function rec(columns) {
      return columns.map(column => ({
        key: column.key,
        title: column.title,
        disabled: Boolean(column.fixed),
        children: column.children && rec(column.children)
      }));
    })(tableProps.columns);
  }, [isOpened, tableProps.columns]);

  const handleApply = useCallback(() => {
    setTableState({ visibleColumnsKeys: checkedKeys });
    setIsOpened(false);
  }, [checkedKeys, setTableState]);

  const onCheck = useCallback(
    checkedKeys => {
      const parentKeys = [];
      const nextCheckedKeys = checkedKeys || [];

      deepFilter(
        treeData,
        column => checkedKeys.includes(column.key),
        parent => parentKeys.push(parent.key)
      );

      setCheckedKeys(nextCheckedKeys.concat(parentKeys));
    },
    [treeData]
  );

  return (
    <div className="select-columns table-toolbar--right">
      <Button border={false} onClick={() => setIsOpened(true)}>
        <SettingOutlined className="select-columns__icon" />
        {locale.openButton}
      </Button>

      <Modal
        visible={isOpened}
        onCancel={() => setIsOpened(false)}
        title={locale.headerModal}
        className="select-columns__modal"
        footer={
          <Button
            type="primary"
            disabled={!checkedKeys.length}
            onClick={handleApply}
          >
            {locale.apply}
          </Button>
        }
      >
        <Tree
          checkable
          showCheckAll
          onCheck={onCheck}
          treeData={treeData}
          onExpand={setExpandedKeys}
          expandedKeys={expandedKeys}
          checkAllKey={locale.checkAll}
          checkedKeys={checkedKeys}
        />
      </Modal>
    </div>
  );
};

TableSelectColumnsModal.defaultProps = {
  locale: {
    apply: "Apply",
    checkAll: "Check All",
    openButton: "Columns",
    headerModal: "Select columns"
  }
};

export default TableSelectColumnsModal;
