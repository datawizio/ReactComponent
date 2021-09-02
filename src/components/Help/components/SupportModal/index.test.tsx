import "jsdom-global/register";
import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { file } from "./__mocks__";

import SupportModal from "./index";

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

const waitForComponentToPaint = async wrapper => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve));
    wrapper.update();
  });
};

const mockProps = {
  onSubmit: jest.fn(),
  visible: true,
  setVisible: jest.fn(),
  uploadFileURL: "url"
};

const setUp = (props?) => mount(<SupportModal {...props} />);

describe("SupportModal component", () => {
  let component;
  beforeEach(() => {
    component = setUp(mockProps);
  });

  it("SupportModal rendered correctly", () => {
    expect(component.find(".support-modal").length).toBeTruthy();
  });
  it("SupportModal close", () => {
    const close = component.find(".ant-modal-close").first();
    close.simulate("click");
    expect(component.prop("setVisible")).toBeCalledTimes(1);
  });

  it("SupportModal submit", () => {
    const mockedEvent = { target: { value: "Lorem Ipsum sit amen" } };
    const select = component.find("Select").first();
    act(() => {
      select.prop("onChange")("value");
    });
    const textArea = component.find("TextArea").first();

    act(() => {
      textArea.simulate("change", mockedEvent);
    });
    const footer = component.find(".ant-modal-footer").first();
    const submitButton = footer.find(".dw-btn").first();
    submitButton.simulate("click");
    expect(component.prop("onSubmit")).toBeCalledTimes(1);
  });

  it("SupportModal fileUpload triger maxFilesNumber", () => {
    const state = {
      subject: "lorem",
      comment: "Lorem Ipsum sit amen",
      uploads: [
        "Gw6zeacBaxwV6hmB2i5j1yIaD",
        "U28gMRsJnwVobcgDp8M62ovw8",
        "PpxioNNLq2lgYpshPHxrzPmjy",
        "6RoGUaMgKC0lXAfanir9gpPVR",
        "RfkxIIIqWhzDBVBxFtwDoNkON"
      ]
    };
    const wrapper = setUp({ ...mockProps, _testState: state });
    const uploadButton = wrapper.find(".ant-upload-select").first();
    act(() => {
      uploadButton.find("input").simulate("change", {
        target: {
          files: [file]
        }
      });
    });

    waitForComponentToPaint(wrapper);
    expect(
      document.querySelectorAll(".ant-message-notice")[0].textContent
    ).toBe("MAX_FILE_NUMBER - 5");
  });
  it("SupportModal fileUpload not available file type", () => {
    const mockFile = new File(["foo"], "foo.gif", { type: "image/gif" });

    const uploadButton = component.find("Upload").first();
    act(() => {
      uploadButton.find("input").simulate("change", {
        target: {
          files: [mockFile]
        }
      });
    });
    waitForComponentToPaint(component);
    component.update();
    expect(
      document.querySelectorAll(".ant-message-notice")[1].textContent
    ).toBe("WRONG_FILE_FORMAT");
  });

  it("SupportModal fileUpload trigger sizeLimit", () => {
    const mockFile = new File(["foo"], "foo.png", { type: "image/png" });
    Object.defineProperty(mockFile, "size", { value: 2048 * 2048 + 3 });
    const uploadButton = component.find("Upload").first();
    act(() => {
      uploadButton.find("input").simulate("change", {
        target: {
          files: [mockFile]
        }
      });
    });
    waitForComponentToPaint(component);
    component.update();

    expect(
      document.querySelectorAll(".ant-message-notice")[2].textContent
    ).toBe("FILE_MUST_BE_SMALLER_THAN 2 MB");
  });
});
