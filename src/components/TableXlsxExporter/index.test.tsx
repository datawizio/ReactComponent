import "jsdom-global/register";
import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { render, fireEvent } from "@testing-library/react";
import TableXlsxExporter from "./index";
import Table from "../Table";
import {
  getStaticColumn,
  getStaticDataSource,
  sortable
} from "../Table/__mocks__";
import { exportTableToXLSX } from "./exporters";

const mockTableProps = {
  height: "auto",
  width: "auto",
  dTypesConfig: {},

  dataProvider: jest.fn(() => {
    return {
      columns: [
        {
          title: "Name",
          key: "name",
          dataIndex: "name"
        }
      ],
      dataSource: [
        {
          key: "1",
          name: "John"
        }
      ]
    };
  })
};

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

const setUp = (props?) => mount(<TableXlsxExporter {...props} />);

describe("TableXlsxExporter component", () => {
  let component;

  beforeEach(() => {
    component = setUp();
  });

  it("should render corectly", () => {
    expect(component).toMatchSnapshot();
  });

  it("should render in Table ToolBar corectly", () => {
    const { container } = render(
      //@ts-ignore
      <Table {...mockTableProps}>
        <Table.ToolBar>
          <TableXlsxExporter exportHandler={exportTableToXLSX} />
        </Table.ToolBar>
      </Table>
    );
    expect(container).toMatchSnapshot();
  });

  it("should export corectly", async () => {
    const mockProps = {
      height: "auto",
      width: "auto",

      sortable,
      columns: getStaticColumn(),
      dataSource: getStaticDataSource()
    };

    const wrapper = render(
      //@ts-ignore
      <Table {...mockProps}>
        <Table.ToolBar>
          <TableXlsxExporter exportHandler={exportTableToXLSX} />
        </Table.ToolBar>
      </Table>
    );
    const saveButton = wrapper.getByTitle("SAVE_BTN_TITLE");
    act(() => {
      fireEvent.click(saveButton);
    });
    expect(
      document.querySelectorAll(".ant-message-notice")[0].textContent
    ).toBe("LOADING");
  });
});
