import "jsdom-global/register";
import React from "react";
import { mount } from "enzyme";
import { Dropdown } from "antd";
import AppSwitcher from "./index";
import ConfigContext from "../ConfigProvider/context";

type AppSwitcherProps = React.ComponentProps<typeof AppSwitcher>;

const mockTranslate = (key: string) => `${key}_TRANSLATED`;

const mockProps: AppSwitcherProps = {
  apps: [
    {
      app_id: 30,
      name: "PlanoHero",
      icon: "/app-icons/ph-dark.png",
      dark_icon: "/app-icons/ph-light.png",
      host: "https://planohero.datawiz.io",
      path: "/c/:client_id",
      description: "BENTO_PH_DESCRIPTION",
      bento_menu_description: "BENTO_PH_DESCRIPTION",
      is_main: false
    },
    {
      app_id: 22,
      name: "Admin Panel",
      icon: "/app-icons/ap-dark.png",
      dark_icon: "/app-icons/ap-light.png",
      host: "https://admin-panel.datawiz.io",
      path: "/c/:client_id",
      description: "BENTO_AP_DESCRIPTION",
      bento_menu_description: "BENTO_AP_DESCRIPTION",
      is_main: false
    },
    {
      app_id: 32,
      name: "Data Console",
      icon: "/app-icons/dc-dark.png",
      dark_icon: "/app-icons/dc-light.png",
      host: "https://data-console.datawiz.io",
      path: "/c/:client_id",
      description: "BENTO_DC_DESCRIPTION",
      bento_menu_description: "BENTO_DC_DESCRIPTION",
      is_main: false
    },
    {
      app_id: 29,
      name: "BES",
      icon: "/app-icons/bes-dark.png",
      dark_icon: "/app-icons/bes-light.png",
      host: "https://bes.datawiz.io",
      path: null,
      description: "BENTO_MAIN_DESCRIPTION",
      bento_menu_description: "BENTO_MAIN_DESCRIPTION",
      is_main: true
    },
    {
      app_id: 51,
      name: "Connector",
      icon: "/app-icons/connector-light.png",
      dark_icon: "/app-icons/connector-dark.png",
      host: "https://connector.datawiz.io",
      path: "/c/:client_id",
      description: "UPLOAD_DATA",
      bento_menu_description: "UPLOAD_DATA",
      is_main: false
    }
  ],
  client: 123,
  theme: "light",
  onAppClick: jest.fn()
};

const setUp = (props?: AppSwitcherProps) =>
  mount(
    <ConfigContext.Provider value={{ translate: mockTranslate }}>
      <AppSwitcher {...props} />
    </ConfigContext.Provider>
  );

describe("AppSwitcher component", () => {
  let component: ReturnType<typeof setUp>;

  beforeEach(() => {
    component = setUp(mockProps);
  });

  it("is rendered correctly with provided props", () => {
    expect(component.find(".app-switcher-link").exists()).toBe(true);
    expect(component.find(Dropdown).exists()).toBe(true);
    expect(component).toMatchSnapshot();
  });

  it("renders the translated title for the dropdown link", () => {
    const dropdownLink = component.find(".app-switcher-link");
    expect(dropdownLink.prop("title")).toBe(
      mockTranslate("CHANGE_APP_BTN_TITLE")
    );
  });

  it("verifies that the correct app URLs are constructed", () => {
    const appNodes = component.find(".logo");
    const appUrls = mockProps.apps.map(
      app =>
        `${app.host}${
          app.path
            ? app.path.replace(":client_id", mockProps.client.toString())
            : ""
        }`
    );

    appNodes.forEach((node, index) => {
      const expectedUrl = appUrls[index];
      const onClickHandler = node.prop("onClick") as () => void;

      // Mock window.open and verify that the correct URL is passed
      onClickHandler();
      expect(window.open).toHaveBeenCalledWith(expectedUrl, "_blank");
    });
  });

  it("applies the dark theme class when theme is 'dark'", () => {
    const darkThemeComponent = setUp({ ...mockProps, theme: "dark" });
    expect(darkThemeComponent.find(".dw-dark").exists()).toBe(true);
  });

  it("handles missing or empty apps", () => {
    const emptyAppsComponent = setUp({ ...mockProps, apps: [] });
    expect(emptyAppsComponent.find(".app-switcher-container").exists()).toBe(
      false
    );
  });
});
