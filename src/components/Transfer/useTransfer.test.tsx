import "jsdom-global/register";
import React from "react";
import { useTransfer } from "./useTransfer";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";

const setStateAC = payload => ({
  type: "setState",
  payload
});

const initialStoreMockData = {
  sourceChecked: ["a", "b"],
  targetChecked: ["c"]
};

function setUp(initialStore, action) {
  let newStore;
  function TestComponent() {
    const reducerResult = useTransfer(initialStore);
    const [store, dispatch] = reducerResult;
    const callAction = () => {
      act(() => {
        dispatch(action);
      });
    };
    newStore = store;
    return <button onClick={callAction} data-store={store}></button>;
  }
  const wrapper = mount(<TestComponent />);
  wrapper.update();

  return {
    wrapper,
    newStore
  };
}

it("setState action", () => {
  const propStoreKey = "value";
  const payload = {
    [propStoreKey]: "nextValue"
  };

  const { wrapper } = setUp(initialStoreMockData, setStateAC(payload));
  wrapper.find("button").simulate("click");
  const nextStore = wrapper.find("button").prop("data-store") as any;

  expect(nextStore[propStoreKey]).toBe(payload[propStoreKey]);
});
