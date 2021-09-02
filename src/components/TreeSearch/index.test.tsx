import "jsdom-global/register";
import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { generateData } from "./__mocks__";
import TreeSearch from "./index";

const gData = generateData();

const mockProps = {
  treeData: gData,
  setSearchValue: jest.fn(),
  showCheckAll: true
};

const setUp = (props?) => mount(<TreeSearch {...props} />);

describe("TreeSearch component", () => {
  let component;
  beforeEach(() => {
    component = setUp(mockProps);
  });

  it("should render corectly", async () => {
    expect(component.find(".ant-input-search").length).toBeTruthy();
    expect(component.find(".ant-tree").length).toBeTruthy();
  });

  it("should render corectly with empty data and without search", () => {
    const wrapper = setUp({
      ...mockProps,
      treeData: [],
      showSearchInput: false
    });
    expect(wrapper.find(".ant-input-search").length).toBeFalsy();
    expect(wrapper.find(".ant-empty").length).toBeTruthy();
  });

  it("should render corectly with default expand keys", () => {
    const wrapper = setUp({
      ...mockProps,
      searchValue: "label",
      defaultExpandedKeys: ["0-0-0-key", "0-0-0-0-key", "0-0-key"]
    });
    expect(wrapper.find(".ant-tree").length).toBeTruthy();
  });

  it("should search changed", () => {
    jest.useFakeTimers();
    act(() => {
      component
        .find("SearchInput")
        .props()
        .onChange({ target: { value: "value" } });
    });

    jest.advanceTimersByTime(200);

    component.update();

    expect(component.prop("setSearchValue")).toHaveBeenCalled();
  });

  it("should expand", () => {
    act(() => {
      component.find("Tree").first().props().onExpand(["0-0-key", "0-1-key"]);
    });
    component.update();
    expect(component.find("Tree").first().prop("expandedKeys")).toStrictEqual([
      "0-0-key",
      "0-1-key",
      "-1"
    ]);
  });

  it("should check all items", () => {
    const wrapper = setUp({ ...mockProps, checkable: true });
    wrapper.find(".ant-tree-checkbox").first().simulate("click");
    expect(
      wrapper
        .find(".ant-tree-checkbox")
        .first()
        .hasClass("ant-tree-checkbox-checked")
    ).toBeTruthy();
  });

  it("should check item", () => {
    const wrapper = setUp({
      ...mockProps,
      checkable: true,
      searchValue: "label"
    });
    wrapper.find(".ant-tree-checkbox").at(1).simulate("click");
    expect(
      wrapper
        .find(".ant-tree-checkbox")
        .at(1)
        .hasClass("ant-tree-checkbox-checked")
    ).toBeTruthy();
  });
});
