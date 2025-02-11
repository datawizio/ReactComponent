import i18next from "i18next";
import React from "react";
import ListInfo from "../ListInfo";
import ShowAllModal from "./components/ShowAllModal";
import {
  DimensionsType,
  formatDateRangeType,
  WidgetParams,
  WidgetParamsDimension
} from "./types";

export const MAX_LENGTH_ITEM_LIST = 7;

export function getValue<TDimension = WidgetParamsDimension>(
  dimension: TDimension,
  formatDateRange: (from: string, to: string) => string
) {
  if (!dimension["values"]) return [i18next.t("ALL")];
  if (typeof dimension["values"] === "string") {
    return [i18next.t(dimension["values"].toUpperCase())];
  }
  if (Array.isArray(dimension["values"])) {
    if (dimension["type"] === "exclude") {
      const res = [...dimension["values"]];
      res[0] = `${i18next.t("ALL_EXCEPT")} ${res[0]}`;
      return res;
    }
    return dimension["values"];
  }
  if (dimension["values"]["from"]) {
    return [
      formatDateRange(dimension["values"]["from"], dimension["values"]["to"])
    ];
  }
}

export const parseDimension = (
  dimension: WidgetParamsDimension,
  formatDateRange: (from: string, to: string) => string
) => (
  <ListInfo
    key={dimension.name}
    //@ts-ignore
    items={getValue(dimension, formatDateRange)}
    label={i18next.t(dimension.name.toUpperCase())}
    maxLength={MAX_LENGTH_ITEM_LIST}
    expandButton={<ShowAllModal dimensionName={dimension.name} />}
    //@ts-ignore
    renderItem={(item: string) => item}
  />
);

export function parseLogic<TLogic>(logic: TLogic) {
  if (Array.isArray(logic)) {
    return logic.map(l => {
      if (typeof l !== "object") return l;
      if (l["var"]) return i18next.t(l["var"].toUpperCase());
      return parseLogic(l);
    });
  }
  const op = Object.keys(logic)[0];
  const l = logic[op];
  if (op === "!") return "!" + parseLogic(l);
  const res = parseLogic(l);
  if (Array.isArray(res) && res.length > 1)
    return `(${res.join(` ${i18next.t(op.toUpperCase())} `)})`;
  return res.join(` ${i18next.t(op.toUpperCase())}`);
}

export function getDimensions<
  TDimension,
  TReturn extends TDimension extends any[] ? DimensionsType[] : DimensionsType
>(dimension: TDimension, formatDateRange: formatDateRangeType): TReturn {
  if (!dimension) return null;

  if (Array.isArray(dimension)) {
    return dimension.map(filter => ({
      displayName: `${i18next.t("FILTER")}: ${i18next.t(
        filter["name"].toUpperCase()
      )}`,
      originalName: filter["name"],
      values: getValue(filter, formatDateRange)
    })) as TReturn;
  }

  return {
    displayName: `${i18next.t("DIMENSION")}: ${i18next.t(
      dimension["name"].toUpperCase()
    )}`,
    originalName: dimension["name"],
    values: getValue<TDimension>(dimension, formatDateRange)
  } as TReturn;
}

export function countValues<
  TDimension extends WidgetParamsDimension | WidgetParamsDimension[]
>(dimension: TDimension): number {
  if (!dimension.values) return 0;
  if (Array.isArray(dimension.values)) return dimension.values.length;
  return 1;
}

export function getCountValues<TDimension extends WidgetParams>(
  dimension: TDimension,
  formatDateRange: formatDateRangeType
): { [key: string]: number } {
  const returnObj = {};
  dimension.filters.forEach(
    d => (returnObj[d.name] = getValue(d, formatDateRange).length)
  );

  if (dimension.dimension) {
    returnObj[dimension.dimension.name] = getValue(
      dimension.dimension,
      formatDateRange
    ).length;
  }

  return returnObj;
}
