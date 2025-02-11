import { Dispatch } from "react";

export interface RuleInfoProps {
  formatDateRange: formatDateRangeType;
  logic: object | string;
  widget_params: WidgetParams;
  name: string;
}

export type WidgetParamsDimension = {
  name: string;
  type?: "exclude" | "include";
  values?: string[] | string | { from: string; to: string };
};

export interface WidgetParams {
  dimension?: WidgetParamsDimension;
  filters?: WidgetParamsDimension[];
}
export interface DimensionsType {
  displayName: string;
  originalName: string;
  values: string[];
}

export type formatDateRangeType = (from: string, to: string) => string;

export interface IRuleInfoReducer {
  widgetParams: WidgetParams;
  dimensions?: DimensionsType;
  filters?: DimensionsType[];
  countValues: { [key: string]: number };
  logic: Object;
  formatDateRange: formatDateRangeType;
  name: string;
  modalShow: boolean;
  defaultActiveKey: string[];
}

export interface IRuleInfoContext {
  ruleInfoState: IRuleInfoReducer;
  dispatch: Dispatch<RuleInfoAction>;
}
export type ListType = keyof WidgetParams;

export type RuleInfoAction =
  | {
      type: "toggleModalShow";
      payload: { show: boolean; defaultActiveKey: string[] };
    }
  | {
      type: "search";
      payload: { value: string; type: ListType; name: string };
    };
