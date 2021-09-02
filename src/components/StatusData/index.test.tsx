import "jsdom-global/register";
import React from "react";
import { shallow } from "enzyme";

import StatusData from "./index";

const mockProps = {
  inProcess: false,
  lastUpdateDate: "2021-06-01 04:02:37"
};

const setUp = (props?) => shallow(<StatusData {...props} />);

describe(" StatusData component", () => {
  let component;
  beforeEach(() => {
    component = setUp(mockProps);
  });

  it("StatusData rendered correctly", () => {
    expect(component).toMatchSnapshot();
  });

  it("StatusData in process", () => {
    const wrapper = setUp({ ...mockProps, inProcess: true });
    expect(wrapper.html()).toContain("DATA_IN_PROGRESS");
  });
});
