import { Collapse, List } from "antd";
import React, { FC, useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import LiteSearchInput from "../../LiteSearchInput";
import { RuleInfoContext } from "../context";
import { MAX_LENGTH_ITEM_LIST } from "../helpers";
import { DimensionsType, ListType } from "../types";

const ROW_HEIGHT = 61;

export const CollapseList: FC = () => {
  const { t } = useTranslation();
  const { ruleInfoState, dispatch } = useContext(RuleInfoContext);
  const { filters, dimensions, countValues } = ruleInfoState;

  const handleSearch = useCallback(
    (value: string, type: ListType, name: string) => {
      dispatch({ type: "search", payload: { value, type, name } });
    },
    [dispatch]
  );

  const renderList = useCallback(
    (dimension: DimensionsType, type: ListType) => {
      const { values } = dimension;
      return (
        <>
          {countValues[dimension.originalName] <=
          MAX_LENGTH_ITEM_LIST ? null : (
            <div className="list-search">
              <LiteSearchInput
                onSearch={value =>
                  handleSearch(value, type, dimension.originalName)
                }
                placeholder={t("SEARCH")}
                debounceDelay={500}
              />
            </div>
          )}
          <div
            style={{
              maxHeight: ROW_HEIGHT * MAX_LENGTH_ITEM_LIST,
              overflow: "auto"
            }}
          >
            <List
              size="small"
              dataSource={values}
              renderItem={value => <List.Item>{value}</List.Item>}
            />
          </div>
        </>
      );
    },
    [countValues, handleSearch, t]
  );

  const renderExtra = useCallback(
    (dimension: DimensionsType) => {
      return countValues[dimension.originalName] <=
        MAX_LENGTH_ITEM_LIST ? null : (
        <div>
          {t("TOTAL")}:&nbsp;{countValues[dimension.originalName]}
        </div>
      );
    },
    [countValues, t]
  );

  const renderDimensionItems = useMemo(
    () =>
      dimensions ? (
        <Collapse.Panel
          key={dimensions.originalName}
          extra={renderExtra(dimensions)}
          header={<b>{dimensions.displayName}</b>}
        >
          {renderList(dimensions, "dimension")}
        </Collapse.Panel>
      ) : null,
    [dimensions, renderExtra, renderList]
  );

  const renderFilterItems = useMemo(
    () =>
      filters?.map(filter => (
        <Collapse.Panel
          key={filter.originalName}
          extra={renderExtra(filter)}
          header={<b>{filter.displayName}</b>}
        >
          {renderList(filter, "filters")}
        </Collapse.Panel>
      )),
    [filters, renderExtra, renderList]
  );

  return (
    <>
      <Collapse
        bordered={false}
        defaultActiveKey={ruleInfoState.defaultActiveKey}
        className="rule-info-collapse-list"
      >
        {renderDimensionItems}
        {renderFilterItems}
      </Collapse>
    </>
  );
};
