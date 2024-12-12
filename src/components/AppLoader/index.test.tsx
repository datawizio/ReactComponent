import "jsdom-global/register";
import React from "react";
import { mount } from "enzyme";

import AppLoader from "./index";

const mockProps = {
  imageSrc: "https://bi.datawiz.io/static/images/logo.svg"
};

const setUp = (props?: React.ComponentProps<typeof AppLoader>) => {
  return mount(<AppLoader {...props} />);
};

describe("AppLoader component", () => {
  let component: ReturnType<typeof setUp>;

  beforeEach(() => {
    component = setUp(mockProps);
  });

  it("is rendered correctly", () => {
    expect(component).toMatchSnapshot();
  });

  it("has the correct class", () => {
    expect(component.find(".loader").length).toBeTruthy();
  });

  it("has the correct image", () => {
    expect(component.find("img").props().src).toBe(mockProps.imageSrc);
  });
});
