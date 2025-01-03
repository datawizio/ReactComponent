import "jsdom-global/register";
import "@testing-library/jest-dom";

import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";

import SideButton, { SideButtonProps } from "./index";

const mockProps: SideButtonProps = {
  text: "Test Button",
  className: "test-class",
  icon: <span>Icon</span>,
  side: "right"
};

const setUp = (props: Partial<SideButtonProps> = {}) => {
  return shallow(<SideButton {...mockProps} {...props} />);
};

describe("SideButton component", () => {
  let component: ReturnType<typeof setUp>;

  beforeEach(() => {
    component = setUp();
  });

  it("is rendered correctly", () => {
    expect(component.exists()).toBeTruthy();
  });

  it("matches snapshot", () => {
    expect(component.debug()).toMatchSnapshot();
  });

  it("has the correct class for the 'right' side", () => {
    expect(component.find(".side-button--right").length).toBeTruthy();
  });

  it("has the correct class for the 'left' side", () => {
    const wrapper = setUp({ side: "left" });
    expect(wrapper.find(".side-button--left").length).toBeTruthy();
  });

  it("renders text correctly", () => {
    expect(component.find(".side-button__text").text()).toBe(mockProps.text);
  });

  it("renders icon correctly", () => {
    expect(
      component
        .find(".side-button__icon")
        .contains(mockProps.icon as ReactElement)
    ).toBeTruthy();
  });

  it("applies custom className", () => {
    expect(component.find(".test-class").length).toBeTruthy();
  });

  it("is rendered on the default side when no side is provided", () => {
    const wrapper = setUp({ side: undefined });
    expect(wrapper.find(".side-button--right").length).toBeTruthy();
  });

  it("renders extra content when provided", () => {
    const extraContent = <div className="extra-content">Extra</div>;
    const wrapper = setUp({ extra: extraContent });
    expect(wrapper.contains(extraContent)).toBeTruthy();
  });

  it("is rendered in the specified container using `createPortal`", () => {
    const customContainer = document.createElement("div");
    const portalMock = jest
      .spyOn(ReactDOM, "createPortal")
      .mockImplementation(node => node);

    setUp({ renderTo: customContainer });
    expect(portalMock).toHaveBeenCalledWith(expect.anything(), customContainer);

    portalMock.mockRestore();
  });
});
