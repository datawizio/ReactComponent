import "jsdom-global/register";
import React from "react";
import { usePeriodSelect } from "./usePeriodSelect";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";

const setStateAC = payload => ({
  type: "setState",
  payload
});

const initialStoreMockData = {
  selectedPeriod: "last_update_date",
  selectedPrevPeriod: "previous",
  period: {
    startDate: "2020-10-22",
    endDate: "2020-11-22"
  },
  prevPeriod: {
    startDate: "2020-09-20",
    endDate: "2020-10-21"
  },
  showPeriodPicker: true,
  showPrevPeriodPicker: true,
  isPickerEmpty: false,
  isPrevPickerEmpty: false,
  availablePrevPeriods: "any",
  clientDate: "2021-11-28",
  clientStartDate: "2020-10-21"
};

function setUp(initialStore, action) {
  let newStore;
  function TestComponent() {
    const reducerResult = usePeriodSelect(initialStore);
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

describe("Period select reducer", () => {
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
});
