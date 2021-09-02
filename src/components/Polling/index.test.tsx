import "jsdom-global/register";
import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";

import Polling from "./index";

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

const mockProps = {
  questions: [
    { question_key: "1", polling_template: 2, feedback_type: "test" }
  ],
  cancelGenerateId: true,
  onSubmit: jest.fn(),
  onPollingHide: jest.fn(),
  onPollingShow: jest.fn()
};

const setUp = (props?) => mount(<Polling {...props} />);

describe("Polling component", () => {
  let component;
  beforeEach(() => {
    component = setUp(mockProps);
  });

  it("Polling rendered correctly", () => {
    console.log(component.props());
    expect(component).toMatchSnapshot();
  });

  it("Polling with empty questions rendered correctly", () => {
    const wrapper = setUp({ ...mockProps, questions: [] });
    console.log(wrapper.props());
    expect(wrapper).toMatchSnapshot();
  });

  it("Polling with feedback type mark rendered correctly", () => {
    const wrapper = setUp({
      ...mockProps,
      questions: [
        { question_key: "1", polling_template: 2, feedback_type: "mark" }
      ]
    });
    console.log(wrapper.props());
    expect(wrapper).toMatchSnapshot();
  });

  it("Polling with feedback type text rendered correctly", () => {
    const wrapper = setUp({
      ...mockProps,
      questions: [
        { question_key: "1", polling_template: 2, feedback_type: "text" }
      ]
    });
    console.log(wrapper.props());

    expect(wrapper).toMatchSnapshot();
  });

  it("Polling send mark", () => {
    const wrapper = setUp({
      ...mockProps,
      questions: [
        { question_key: "1", polling_template: 2, feedback_type: "mark" }
      ]
    });
    const mark = wrapper.find(".polling-mark").last();
    mark.simulate("click");
    expect(wrapper.prop("onSubmit")).toBeCalledTimes(1);
  });

  it("Polling send text", () => {
    const wrapper = setUp({
      ...mockProps,
      questions: [
        { question_key: "1", polling_template: 2, feedback_type: "text" }
      ]
    });
    const mockedEvent = { target: { value: "test text" } };
    const input = wrapper.find(".polling-text").find("Input");
    //@ts-ignore
    act(() => input.prop("onChange")(mockedEvent));
    const submitButton = wrapper.find("Button").first();
    submitButton.simulate("click");
    expect(wrapper.prop("onSubmit")).toBeCalledTimes(1);
  });

  it("Polling close", () => {
    const close = component.find(".polling-close-btn").first();
    close.simulate("click");
    expect(component.prop("onSubmit")).toBeCalledTimes(1);
  });
});
