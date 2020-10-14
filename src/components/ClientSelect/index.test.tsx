import "jsdom-global/register";
import React from "react";
import { mount } from "enzyme";

import ClientSelect from "./index";
const clients = [
  {
    id: 1,
    name: "cl1"
  },
  {
    id: 2,
    name: "cl2"
  }
];
const mockProps = {
  clients,
  client: 1,
  onChange: jest.fn()
};

const setUp = (props?) => mount(<ClientSelect {...props} />);

describe("ClientSelect component", () => {
  let component;
  beforeEach(() => {
    component = setUp(mockProps);
  });

  it("ClientSelect rendered correctly", () => {
    expect(component).toMatchSnapshot();
  });

  it("ClientSelect with one child", () => {
    const wrapper = setUp({ ...mockProps, clients: [clients[0]] });
    expect(wrapper.html()).toContain(clients[0].name);
  });

  //TODO cover handleChange
});
