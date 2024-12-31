import "jsdom-global/register";
import "@testing-library/jest-dom";

import React from "react";
import { render, screen } from "@testing-library/react";

import Breadcrumb from "./index";
import ConfigContext from "../ConfigProvider/context";

const mockProps = {
  className: "custom-class-name"
};

describe("Breadcrumb component", () => {
  it("is rendered correctly and matches snapshot", () => {
    const { container } = render(
      <Breadcrumb {...mockProps}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>About</Breadcrumb.Item>
      </Breadcrumb>
    );
    expect(container).toMatchSnapshot();
  });

  it("is rendered with the correct separator", () => {
    render(
      <Breadcrumb {...mockProps} separator=">">
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>About</Breadcrumb.Item>
      </Breadcrumb>
    );
    const separator = screen.getAllByText(">")[0];
    expect(separator).toBeInTheDocument();
  });

  it("applies the correct class name", () => {
    const { container } = render(
      <Breadcrumb {...mockProps}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
      </Breadcrumb>
    );
    const breadcrumb = container.querySelector(`.${mockProps.className}`);
    expect(breadcrumb).toBeInTheDocument();
  });

  it("renders the correct separator based on RTL context", () => {
    const mockContextValue = { direction: "rtl" } as const;

    render(
      <ConfigContext.Provider value={mockContextValue}>
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Breadcrumb>
      </ConfigContext.Provider>
    );

    // Assuming the LeftOutlined icon has an `aria-label` of "left".
    expect(screen.getByLabelText("left")).toBeInTheDocument();
  });
});
