import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { JSDOM } from "jsdom";
import React from "react";

const dom = new JSDOM();
React.useLayoutEffect = React.useEffect;
// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

global.document = dom.window.document;

global.console.error = message => {
  throw new Error(message);
};

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  key: jest.fn(),
  length: 1
};

global.cancelAnimationFrame = function () {
  // setTimeout(callback, 0);
};
