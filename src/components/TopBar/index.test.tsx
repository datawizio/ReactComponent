import "jsdom-global/register";
import React from "react";
import { shallow } from "enzyme";

import TopBar from "./index";

const mockProps = {
  theme: "ligth"
};

const setUp = (props?) => shallow(<TopBar {...props} />);

describe("TopBar component", () => {
  let component;
  beforeEach(() => {
    component = setUp(mockProps);
  });
  it("TopBar rendered correctly", () => {
    expect(component).toMatchSnapshot();
  });
  it("TopBar ligth theme rendered correctly", () => {
    expect(component.hasClass("dw-dark")).toBeFalsy();
  });
  it("TopBar dark theme rendered correctly", () => {
    const wrapper = setUp({ theme: "dark" });
    expect(wrapper.hasClass("dw-dark")).toBeTruthy();
  });
});
