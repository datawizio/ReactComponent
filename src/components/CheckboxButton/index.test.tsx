import "jsdom-global/register";
import React from "react";
import { mount } from "enzyme";

import CheckboxButton from "./index";

const mockProps = {
  checked: false,
  text: "text",
  border: false,
  highlight: true,
  onChange: jest.fn()
};

const setUp = (props?) => mount(<CheckboxButton {...props} />);

describe("CheckboxButton component", () => {
  let component;
  beforeEach(() => {
    component = setUp();
  });

  it("CheckboxButton without props rendered correctly", () => {
    expect(component).toMatchSnapshot();
  });

  it("CheckboxButton with props rendered correctly", () => {
    const wrapper = setUp(mockProps);
    expect(wrapper).toMatchSnapshot();
  });

  it("CheckboxButton with custom classname", () => {
    const wrapper = setUp({ ...mockProps, className: "custom-class-name" });
    expect(wrapper.find("Button").hasClass("custom-class-name")).toBeTruthy();
  });

  it("CheckboxButton change", () => {
    const wrapper = setUp(mockProps);
    const button = wrapper.find("Button");
    button.simulate("click");
    expect(wrapper.prop("onChange")).toBeCalledTimes(1);
  });
});
