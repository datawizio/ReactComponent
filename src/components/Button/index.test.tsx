import "jsdom-global/register";
import "@testing-library/jest-dom";

import React from "react";
import { render, screen } from "@testing-library/react";

import Button from "./index";

const mockProps = {
  border: false,
  className: "custom-class-name"
};

describe("Button component", () => {
  it("is rendered correctly and matches snapshot", () => {
    const { container } = render(<Button {...mockProps}>Click me</Button>);
    expect(container).toMatchSnapshot();
  });

  it("has the correct base class", () => {
    render(<Button {...mockProps}>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("dw-btn");
  });

  it("is rendered without border and applies the correct class", () => {
    render(<Button {...mockProps}>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("no-border");
  });

  it("is rendered with border and does not have the no-border class", () => {
    render(
      <Button {...mockProps} border={true}>
        Click me
      </Button>
    );
    const button = screen.getByRole("button");
    expect(button).not.toHaveClass("no-border");
  });

  it("applies the correct custom class name", () => {
    render(<Button {...mockProps}>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass(mockProps.className);
  });

  it("renders button text correctly", () => {
    render(<Button {...mockProps}>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
