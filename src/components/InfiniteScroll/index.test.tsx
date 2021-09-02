import "jsdom-global/register";
import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import InfiniteScroll, { InfiniteScrollRef } from "./index";

const waitForComponentToPaint = async wrapper => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve));
    wrapper.update();
  });
};

const mockProps = {
  height: 550,
  maxPage: 3,
  onBottom: jest.fn(),
  triggerCoeff: 10,
  showLoader: true
};

const setUp = (props?) => mount(<InfiniteScroll {...props} />);

describe("InfiniteScroll component", () => {
  let component;
  beforeEach(() => {
    component = setUp(mockProps);
  });

  it("Render InfiniteScroll correctly", () => {
    expect(component).toMatchSnapshot();
  });

  it("should scrolled and spin loader render and stoped scroll when handling", () => {
    const mEvent = {
      target: { scrollHeight: 100, scrollTop: 50, clientHeight: 50 }
    };
    waitForComponentToPaint(component);
    act(() => {
      component.find(".infinite-scroll").simulate("scroll", mEvent);
    });
    component.update();
    act(() => {
      component.find(".infinite-scroll").simulate("scroll", mEvent);
    });
    expect(component.find(".infinite-scroll__default-loader").length).toBe(1);
  });

  it("shoutld reset called", () => {
    const mEvent = {
      target: { scrollHeight: 100, scrollTop: 50, clientHeight: 50 }
    };
    const resetRef = React.createRef<InfiniteScrollRef>();
    const wrapper = mount(<InfiniteScroll {...mockProps} ref={resetRef} />);
    act(() => {
      wrapper.find(".infinite-scroll").simulate("scroll", mEvent);
    });
    wrapper.update();
    expect(wrapper.find(".infinite-scroll__default-loader").length).toBe(1);
    act(() => {
      resetRef.current.reset();
    });
    wrapper.update();
    expect(wrapper.find(".infinite-scroll__default-loader").length).toBe(0);
  });
});
