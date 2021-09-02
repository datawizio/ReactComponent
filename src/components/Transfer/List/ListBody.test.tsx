import "jsdom-global/register";
import React from "react";
import { mount } from "enzyme";
import ListBodyWrapper from "./ListBody";

const listBodyProps = {
  prefixCls: "list-body",
  filteredItems: [
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
  ],
  selectedKeys: ["a", "b"],
  loading: false,
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
  onItemSelect: jest.fn()
};

const setUp = (props?) => mount(<ListBodyWrapper {...props} />);

describe("ListBody component", () => {
  let component;
  beforeEach(() => {
    component = setUp(listBodyProps);
  });
  it("ListBody render corectly", () => {
    expect(component).toMatchSnapshot();
  });

  it("ListBody skeleton with filteredItems", () => {
    const wrapper = setUp({
      ...listBodyProps,
      loading: true,
      filteredItems: [
        {
          key: "a",
          title: "a"
        }
      ]
    });
    expect(wrapper.find("SkeletonListItem").prop("count")).toBe(2);
  });

  it("ListBody select item", () => {
    component
      .find(".list-body-content-item")
      .not(".list-body-content-item-checked")
      .first()
      .simulate("click");

    expect(component.prop("onItemSelect")).toBeCalledTimes(1);
  });
});
