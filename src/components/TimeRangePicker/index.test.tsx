import "jsdom-global/register";
import React from "react";
import { shallow } from "enzyme";

import TimeRangePicker from "./index";

const mockProps = {
  fullWidth: true,
  value: { from: "2020-10-22T13:06:36.873Z", to: "2020-10-22T17:06:36.873Z" },
  onChange: jest.fn()
};

const setUp = (props?) => shallow(<TimeRangePicker {...props} />);

describe("TimeRangePicker component", () => {
  let component;

  beforeEach(() => {
    component = setUp(mockProps);
  });

  it("TimeRangePicker rendered correctly", () => {
    expect(component).toMatchSnapshot();
  });

  it("TimeRangePicker rendered correctly with empty props", () => {
    const wrapper = setUp();
    expect(wrapper).toMatchSnapshot();
  });

  it("TimeRangePicker trigger onChange with empty", () => {
    const rangePicker = component.find("RangePicker").first();
    rangePicker.props().onChange("");
    expect(component).toMatchSnapshot();
  });

  it("TimeRangePicker trigger onChange with mock", () => {
    const timeRange = ["2021-06-14T02:04:03.000Z", "2021-06-14T06:06:05.000Z"];
    const rangePicker = component.find("RangePicker").first();
    rangePicker.props().onChange(timeRange);
    expect(component).toMatchSnapshot();
  });
});
