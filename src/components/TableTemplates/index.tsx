import * as React from "react";
import { TableTemplate } from "./types";
import { useState, useCallback, useContext, useEffect } from "react";

import Select from "../Select";
import { TableState } from "../Table/types";

import Dropdown from "./components/Dropdown";
import Template from "./components/Template";
import ConfigContext from "../ConfigProvider/context";

import { TableContext } from "../Table/context";

import "./index.less";

function pickState(state: TableState): TableTemplate["state"] {
  const columnsPositions = (function rec(columns) {
    return columns.map(column => ({
      dataIndex: column.dataIndex,
      children:
        column.children && column.children.length && rec(column.children)
    }));
  })(state.columns);

  return {
    columnsPositions,
    pagination: state.pagination,
    sortParams: state.sortParams,
    filterParams: state.filterParams,
    visibleColumnsKeys: state.visibleColumnsKeys
  };
}

type MaybePromise<T> = T | Promise<T>;

export interface TableTemplatesProps {
  templates?: () => MaybePromise<TableTemplate>;
  onDelete: (template: TableTemplate) => void;
  onSelectFavorite: (template: TableTemplate) => void;
  onCreate: (template: TableTemplate) => void | Promise<TableTemplate>;
}

const TableTemplates: React.FC<TableTemplatesProps> = props => {
  const { onCreate, onDelete, onSelectFavorite } = props;

  const { translate } = useContext(ConfigContext);
  const { tableState, dispatch } = useContext(TableContext);

  const [templates, setTemplates] = useState([]);
  const [value, setValue] = useState<string>(null);

  const setTemplateToState = useCallback(
    template => {
      dispatch({ type: "recoveryState", payload: template.state });
    },
    [dispatch]
  );

  const handleSelect = useCallback(
    value => {
      const template = templates.find(template => template.title === value);
      setTemplateToState(template);
      setValue(value);
    },
    [templates, setTemplateToState]
  );

  const handleSelectFavorite = useCallback(
    template => {
      setTemplates(templates =>
        templates.map(item => ({
          ...item,
          favorite: item.title === template.title && !item.favorite
        }))
      );
      onSelectFavorite && onSelectFavorite(template);
    },
    [onSelectFavorite]
  );

  const handleDelete = useCallback(
    template => {
      setTemplates(templates =>
        templates.filter(item => item.id !== template.id)
      );
      value === template.title && setValue(null);
      onDelete && onDelete(template);
    },
    [onDelete, value]
  );

  const handleCreate = useCallback(
    async title => {
      let template = {
        title,
        favorite: false,
        state: pickState(tableState)
      };

      if (onCreate) {
        const createResponse = await onCreate(template);
        if (createResponse) template = createResponse;
      }

      setValue(title);
      setTemplates(templates => templates.concat(template));
    },
    [tableState, onCreate]
  );

  useEffect(() => {
    function _setTemplates(templates) {
      const favorite = templates.find(template => template.favorite);

      if (favorite && favorite.state) {
        setValue(favorite.title);
        setTemplateToState(favorite);
      }

      setTemplates(templates);
    }

    if (tableState.templates) {
      _setTemplates(tableState.templates);
    } else if (props.templates) {
      typeof props.templates === "function"
        ? (props.templates() as any).then(_setTemplates)
        : _setTemplates(props.templates);
    }
    // eslint-disable-next-line
  }, [props.templates, tableState.templates]);

  return (
    <div className="table-templates table-toolbar--right">
      <Select
        listHeight={150}
        onChange={handleSelect}
        className="table-templates__selector"
        value={(<>{value || translate("TEMPLATES")}</>) as any}
        dropdownRender={originNode => (
          <Dropdown onCreate={handleCreate}>{originNode}</Dropdown>
        )}
      >
        {templates.map((template, idx) => (
          <Select.Option idx={idx} value={template.title}>
            <Template
              onDelete={handleDelete}
              onSelectFavorite={handleSelectFavorite}
              {...template}
            />
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default TableTemplates;
