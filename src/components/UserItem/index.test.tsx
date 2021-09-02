import "jsdom-global/register";
import React from "react";
import { shallow } from "enzyme";

import UserItem from "./index";

const mockProps = {
  photo: "somePictures.png",
  email: "mock@mail.com",
  fullName: "Paul McCartney"
};

const setUp = (props?) => shallow(<UserItem {...props} />);

describe("UserItem component", () => {
  let component;
  beforeEach(() => {
    component = setUp(mockProps);
  });

  it("UserItem rendered correctly", () => {
    expect(component).toMatchSnapshot();
  });
});
