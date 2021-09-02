import "jsdom-global/register";
import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import TransferList from "./index";
import { TransferDirection } from "../types";

const waitForComponentToPaint = async wrapper => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve));
    wrapper.update();
  });
};

const direction: TransferDirection = "right";
const listCommonProps = {
  prefixCls: "ant-transfer-list",
  dataSource: [
    {
      key: "a",
      title: "a"
    },
    {
      key: "b",
      title: "b"
    },
    {
      key: "c",
      title: "c",
      disabled: false
    }
  ],
  value: { exclude: [], include: [] },
  checkedKeys: ["a"],
  direction,
  selectedText: "string",
  searchText: "string",
  titleText: "string",
  onItemSelect: jest.fn(),
  onItemSelectAll: jest.fn(),
  onScroll: jest.fn(),
  loadData: jest.fn(() => {
    const obj = {
      data: [
        {
          key: "a",
          title: "a"
        },
        {
          key: "b",
          title: "b"
        },
        {
          key: "c",
          title: "c"
        }
      ]
    };
    return obj;
  }),
  noDataText: "Not Found"
};

const setUp = (props?) => mount(<TransferList {...props} />);

describe("TransferList", () => {
  let component;
  let instance;
  beforeEach(() => {
    component = setUp(listCommonProps);
    component.setState({ loading: false });
    instance = component.instance();
  });

  it("should render corectly", () => {
    expect(component).toMatchSnapshot();
  });

  it("should render corectly with search", () => {
    const wrapper = setUp({ ...listCommonProps, showSearch: true });
    wrapper.setState({ loading: false });
    expect(wrapper).toMatchSnapshot();
  });
  it("should check top Checkbox while all available items are checked", () => {
    const wrapper = setUp({ ...listCommonProps, checkedKeys: ["a", "b"] });

    waitForComponentToPaint(wrapper);
    // console.log(component.state());
    expect(
      wrapper
        .find(".ant-transfer-list-header")
        .find("Checkbox")
        .first()
        .prop("checked")
    ).toBeTruthy();
  });
  it("when component has been unmounted, componentWillUnmount should be called", () => {
    const willUnmount = jest.spyOn(instance, "componentWillUnmount");
    component.unmount();
    expect(willUnmount).toHaveBeenCalled();
  });

  it("render item", () => {
    const wrapper = setUp({
      ...listCommonProps,
      render: jest.fn(item => {
        return <span>{item.title}</span>;
      })
    });
    const item = {
      key: "a",
      title: "a"
    };
    //@ts-ignore
    wrapper.instance().renderItem(item);
    expect(wrapper.prop("render")).toHaveBeenCalled();
  });

  it("default render item", () => {
    const item = {
      key: "a",
      title: "a"
    };
    expect(component.instance().renderItem(item)).toStrictEqual({
      "renderedText": null,
      "renderedEl": null,
      "item": {
        "key": "a",
        "title": "a"
      }
    });
  });

  it("check item", () => {
    instance.setExceptedKeys(["a"]);
    instance.addExceptedKeys(["b"]);
    expect(instance.exceptedKeys).toStrictEqual(["a", "b"]);
  });

  it("should search changed", () => {
    const wrapper = setUp({ ...listCommonProps, showSearch: true });
    const searchBtn = wrapper.find(".lite-search__input");
    const mockedEvent = { target: { value: "value" } };
    searchBtn.simulate("change", mockedEvent);
    expect(searchBtn.html()).toBe(
      '<input placeholder="string" class="lite-search__input" value="value">'
    );
  });

  it("should search cleared", () => {
    const wrapper = setUp({ ...listCommonProps, showSearch: true });
    const searchBtn = wrapper.find(".lite-search__input");
    const mockedEvent = { target: { value: "value" } };
    searchBtn.simulate("change", mockedEvent);
    expect(searchBtn.html()).toBe(
      '<input placeholder="string" class="lite-search__input" value="value">'
    );
    const clearBtn = wrapper.find(".lite-search__cancel-icon").first();
    clearBtn.simulate("click");
    expect(searchBtn.html()).toBe(
      '<input placeholder="string" class="lite-search__input" value="">'
    );
  });
});
