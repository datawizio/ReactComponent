import "jsdom-global/register";
import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import Help from "./index";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

const waitForComponentToPaint = async wrapper => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve));
    wrapper.update();
  });
};

const mockProps = {
  onTutorialLinkClick: jest.fn(),
  onSupportLinkClick: jest.fn(),
  onServiceUpdateClick: jest.fn(),
  onSupportModalSubmit: jest.fn(),
  onHelperClick: jest.fn(),
  uploadFileURL: "url"
};

const setUp = (props?) => mount(<Help {...props} />);

describe("Help component", () => {
  let component;
  beforeEach(() => {
    component = setUp(mockProps);
  });

  it("Help rendered correctly", () => {
    expect(component).toMatchSnapshot();
  });

  it("Help rendered correctly", () => {
    const menu = component.find("HelpMenu").first();
    menu.simulate("click");
    const support = component
      .findWhere(n => {
        return n.text() === "SUPPORT";
      })
      .first();
    support.simulate("click");
    waitForComponentToPaint(component);
    expect(component.prop("onSupportLinkClick")).toBeCalledTimes(1);
  });
});
