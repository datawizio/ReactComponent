import "jsdom-global/register";
import React from "react";
import { mount } from "enzyme";

import AppsList from "./index";
import { AppsListProps } from "./types";

const mockProps: AppsListProps = {
  apps: [
    {
      app_id: 1,
      name: "app",
      logo: "logoPath",
      dark_logo: "logoPath",
      host: "app.com",
      path: "/",
      description: "description",
      clients: [{ client_id: 1, name: "name", is_active: true }]
    }
  ],
  onSelect: jest.fn()
};

const setUp = (props: AppsListProps) => mount(<AppsList {...props} />);

describe("AppsList component", () => {
  let component;
  beforeEach(() => {
    component = setUp(mockProps);
  });
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

  it("Render AppsList correctly", () => {
    expect(component).toMatchSnapshot();
  });

  it("Simmulate Button click", () => {
    const button = component.find("App").first();
    button.props().onButtonClick();
    expect(component.props().onSelect).toBeCalled();
  });

  it("Render AppsList loader", () => {
    expect(setUp({ ...mockProps, loading: true })).toMatchSnapshot();
  });
});
