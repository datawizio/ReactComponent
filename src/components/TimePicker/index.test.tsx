import "jsdom-global/register";
import React from "react";
import { shallow } from "enzyme";

import TimePicker from "./index";

const mockProps = {};

const setUp = (props?) => shallow(<TimePicker {...props} />);

describe("TimePicker component", () => {
  let component;
  beforeEach(() => {
    component = setUp(mockProps);
  });

  it("TimePicker rendered correctly", () => {
    expect(component).toMatchSnapshot();
  });
});
