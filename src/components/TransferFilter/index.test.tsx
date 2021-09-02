import "jsdom-global/register";
import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import TransferFilter from "./index";

const mockProps = {
  value: { exclude: [], include: null },
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
  onChange: jest.fn(),
  loadDataByIds: jest.fn(() => {
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
  })
};

const setUp = (props?) => mount(<TransferFilter {...props} />);

describe("TransferFilter component", () => {
  let component;
  beforeEach(() => {
    component = setUp(mockProps);
  });

  it("TransferFilter rendered correctly", () => {
    component.find("ListBody").first().props().loading = false;
    component.update();
    expect(component).toMatchSnapshot();
  });

  it("should move all keys to right list", () => {
    component.find("ListBody").first().props().loading = false;
    component
      .find(".ant-transfer-operation")
      .find(".ant-btn-icon-only")
      .at(0)
      .simulate("click");
    expect(component.prop("onChange")).toHaveBeenCalled();
  });
  it("should move selected item to right list", () => {
    const wrapper = setUp({
      ...mockProps,
      value: { exclude: [], include: null }
    });
    wrapper.render();
    wrapper
      .find("TransferList")
      .first()
      .setState({
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
        loading: false,
        count: 3
      });
    wrapper.render();
    wrapper.update();
    wrapper.find(".ant-transfer-list-content-item").first().simulate("click");
    wrapper
      .find(".ant-transfer-operation")
      .find(".ant-btn-icon-only")
      .at(1)
      .simulate("click");
    wrapper.update();

    expect(wrapper.prop("onChange")).toHaveBeenCalled();
  });
  it("should move selected item to left list", () => {
    const wrapper = setUp({
      ...mockProps,
      value: { exclude: [], include: ["a"] }
    });
    wrapper.render();
    wrapper
      .find("TransferList")
      .last()
      .setState({
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
        loading: false,
        count: 3
      });
    wrapper.render();
    wrapper
      .find("TransferList")
      .last()
      .find(".ant-transfer-list-content-item")
      .first()
      .simulate("click");
    wrapper
      .find(".ant-transfer-operation")
      .find(".ant-btn-icon-only")
      .at(2)
      .simulate("click");
    expect(wrapper.prop("onChange")).toHaveBeenCalled();
  });

  it("should move all keys to left list", () => {
    component
      .find(".ant-transfer-operation")
      .find(".ant-btn-icon-only")
      .at(3)
      .simulate("click");
    expect(component.prop("onChange")).toHaveBeenCalled();
  });

  it("should left item checked", () => {
    const wrapper = setUp({
      ...mockProps,
      value: { exclude: [], include: null }
    });
    wrapper.render();
    wrapper
      .find("TransferList")
      .first()
      .setState({
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
        loading: false,
        count: 3
      });
    wrapper.render();
    wrapper
      .find(".ant-transfer-list-content")
      .find(".ant-transfer-list-content-item")
      .at(2)
      .simulate("click");
    expect(
      wrapper
        .find(".ant-transfer-list-content")
        .find(".ant-transfer-list-content-item")
        .at(2)
        .hasClass("ant-transfer-list-content-item-checked")
    ).toBeTruthy();
    wrapper
      .find(".ant-transfer-list-content")
      .find(".ant-transfer-list-content-item")
      .at(2)
      .simulate("click");
    expect(
      wrapper
        .find(".ant-transfer-list-content")
        .find(".ant-transfer-list-content-item")
        .at(2)
        .hasClass("ant-transfer-list-content-item-checked")
    ).toBeFalsy();
  });

  it("should left items checked", () => {
    const wrapper = setUp({
      ...mockProps,
      value: { exclude: [], include: null }
    });
    wrapper.render();
    wrapper
      .find("TransferList")
      .first()
      .setState({
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
        loading: false,
        count: 3
      });
    wrapper.render();

    act(() => {
      wrapper
        .find(".ant-transfer-list-header")
        .find("Checkbox")
        .first()
        .props()
        //@ts-ignore
        .onChange();
    });
    wrapper.update();
    expect(
      wrapper
        .find(".ant-transfer-list-header")
        .find(".ant-checkbox")
        .first()
        .hasClass("ant-checkbox-checked")
    ).toBeTruthy();
  });
});
