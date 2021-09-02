import "jsdom-global/register";
import React from "react";
import { mount } from "enzyme";
import ListBodyWrapper from "./ListBody";

const listBodyProps = {
  prefixCls: "list-body",
  filteredItems: [
    {
      key: "a",
      title: "a",
      ifLeaf: false,
      level: 1
    },
    {
      key: "b",
      title: "b",
      ifLeaf: false,
      level: 2
    },
    {
      key: "c",
      title: "c",
      ifLeaf: false,
      level: 2
    }
  ],
  selectedKeys: [],
  loading: false,
  type: "tree",
  value: { exclude: [], include: [] },
  loadData: jest.fn(() => {
    const obj = {
      data: [
        {
          key: "a",
          title: "a",
          ifLeaf: false,
          level: 1
        },
        {
          key: "b",
          title: "b",
          ifLeaf: false,
          level: 2
        },
        {
          key: "c",
          title: "c",
          ifLeaf: false,
          level: 2
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
  it("ListBody render corectly", async () => {
    expect(component.find(".list-body-content").length).toBeTruthy();
  });
});
