import "jsdom-global/register";
import React from "react";
import { mount } from "enzyme";
import { tableColumns, mockData } from "./__mocks__";

import TransferTable from "./index";

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

const onTableChange = jest.fn();

const mockProps = {
  showSearch: true,
  direction: "right",
  filteredInfo: { right: null, left: null },
  columns: tableColumns,
  dataSource: mockData,
  onTableChange
};

const setUp = (props?) => mount(<TransferTable {...props} />);

describe("TransferTable component", () => {
  let component;
  beforeEach(() => {
    component = setUp(mockProps);
  });

  it("TransferTable rendered correctly", () => {
    expect(component).toMatchSnapshot();
  });
  it("should click on row", () => {
    const tableRow = component.find(".ant-table-row").first();
    expect(tableRow.hasClass("ant-table-row-selected")).toBeFalsy();
    tableRow.simulate("click");
    expect(tableRow.render().hasClass("ant-table-row-selected")).toBeTruthy();
    tableRow.simulate("click");
    expect(tableRow.render().hasClass("ant-table-row-selected")).toBeFalsy();
  });
  it("should all select", () => {
    const checkBox = component.find(".ant-checkbox").first();
    expect(checkBox.hasClass("ant-checkbox-checked")).toBeFalsy();
    checkBox.find("input").simulate("change");
    expect(checkBox.render().hasClass("ant-checkbox-checked")).toBeTruthy();
    checkBox.find("input").simulate("change");
    expect(checkBox.render().hasClass("ant-checkbox-checked")).toBeFalsy();
  });
});
