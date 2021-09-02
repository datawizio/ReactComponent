import "jsdom-global/register";
import React from "react";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";

import PeriodSelect from "./index";
import dayjs from "dayjs";

const waitForComponentToPaint = async wrapper => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve));
    wrapper.update();
  });
};

const mockProps = {
  clientDate: "2021-06-29",
  clientStartDate: "2020-01-01",
  dateConfig: {
    datePicker: {
      endDate: "2021-06-09",
      startDate: "2021-06-03"
    },
    prevDatePicker: {
      endDate: "2021-06-02",
      startDate: "2021-05-07"
    },
    selectedPeriod: "last_7_days",
    selectedPrevPeriod: "previous"
  },
  format: "DD-MM-YYYY",
  onChange: jest.fn()
};

const setUp = (props?) => mount(<PeriodSelect {...props} />);

describe("PeriodSelect", () => {
  let component;
  beforeEach(() => {
    component = setUp(mockProps);
  });

  it("should render correctly", () => {
    expect(component).toMatchSnapshot();
  });

  it("should render correctly with default props", () => {
    const wrapper = setUp({ onChange: jest.fn() });
    expect(wrapper).toMatchSnapshot();
  });

  it("should select period changed", () => {
    waitForComponentToPaint(component);
    const select = component.find("SingleSelector").first();
    //LAST_UPDATE_DATE
    select.props().onChange("last_update_date");
    expect(component.find(".ant-select-selection-item").first().text()).toBe(
      "LAST_UPDATE_DATE"
    );
    //PENULTIMATE_UPDATE_DATE
    select.props().onChange("penultimate_update_date");
    expect(component.find(".ant-select-selection-item").first().text()).toBe(
      "PENULTIMATE_UPDATE_DATE"
    );
    //LAST_7_DAYS
    select.props().onChange("last_7_days");
    expect(component.find(".ant-select-selection-item").first().text()).toBe(
      "LAST_7_DAYS"
    );
    //PREV_WEEK
    select.props().onChange("prev_week");
    expect(component.find(".ant-select-selection-item").first().text()).toBe(
      "PREV_WEEK"
    );
    //WEEK_BEGIN
    select.props().onChange("week_begin");
    expect(component.find(".ant-select-selection-item").first().text()).toBe(
      "WEEK_BEGIN"
    );
    //MONTH_BEGIN
    select.props().onChange("month_begin");
    expect(component.find(".ant-select-selection-item").first().text()).toBe(
      "MONTH_BEGIN"
    );
    //PREV_MONTH
    select.props().onChange("prev_month");
    expect(component.find(".ant-select-selection-item").first().text()).toBe(
      "PREV_MONTH"
    );
    //SEASON_BEGIN
    select.props().onChange("season_begin");
    expect(component.find(".ant-select-selection-item").first().text()).toBe(
      "SEASON_BEGIN"
    );
    //YEAR_BEGIN
    select.props().onChange("year_begin");
    expect(component.find(".ant-select-selection-item").first().text()).toBe(
      "YEAR_BEGIN"
    );
    //LAST_30_DAYS
    select.props().onChange("last_30_days");
    expect(component.find(".ant-select-selection-item").first().text()).toBe(
      "LAST_30_DAYS"
    );
    //LAST_180_DAYS
    select.props().onChange("last_180_days");
    expect(component.find(".ant-select-selection-item").first().text()).toBe(
      "LAST_180_DAYS"
    );
    //LAST_365_DAYS
    select.props().onChange("last_365_days");
    expect(component.find(".ant-select-selection-item").first().text()).toBe(
      "LAST_365_DAYS"
    );
    //ALL_TIME
    select.props().onChange("all_time");
    expect(component.find(".ant-select-selection-item").first().text()).toBe(
      "ALL_TIME"
    );
  });

  it("should select prev period changed", () => {
    const select = component.find("SingleSelector").last();
    //PREV_LAST_WEEK
    select.props().onChange("prev_last_week");
    expect(component.find(".ant-select-selection-item").last().text()).toBe(
      "PREV_LAST_WEEK"
    );
    //PREV_LAST_MONTH
    select.props().onChange("prev_last_month");
    expect(component.find(".ant-select-selection-item").last().text()).toBe(
      "PREV_LAST_MONTH"
    );
    //PREV_LAST_QUARTER
    select.props().onChange("prev_last_quarter");
    expect(component.find(".ant-select-selection-item").last().text()).toBe(
      "PREV_LAST_QUARTER"
    );
    //PREV_LAST_YEAR
    select.props().onChange("prev_last_year");
    expect(component.find(".ant-select-selection-item").last().text()).toBe(
      "PREV_LAST_YEAR"
    );
  });
  Object.defineProperty(window, "cancelAnimationFrame", () => {});
  it("should select period with custom data", () => {
    const select = component.find("SingleSelector").first();
    select.props().onChange("date");
    expect(component.find(".ant-select-selection-item").first().text()).toBe(
      "SET_DATE"
    );
    component.update();
    const dateRange = [
      dayjs("2021-10-22T13:06:36.873Z"),
      dayjs("2021-11-22T13:06:36.873Z")
    ];
    component.find("DateRangePicker").props().onClear();
    component.find("DateRangePicker").props().onChange(dateRange);
    component.update();
    expect(component).toMatchSnapshot();
  });

  it("should select prev period with custom data", () => {
    const select = component.find("SingleSelector").last();
    select.props().onChange("prev_date");
    expect(component.find(".ant-select-selection-item").last().text()).toBe(
      "PREV_DATE"
    );
    component.update();
    const dateRange = [
      dayjs("2021-10-22T13:06:36.873Z"),
      dayjs("2021-11-22T13:06:36.873Z")
    ];
    component.find("DateRangePicker").props().onClear();
    component.find("DateRangePicker").props().onChange(dateRange);
    component.update();
    expect(component).toMatchSnapshot();
  });
});
