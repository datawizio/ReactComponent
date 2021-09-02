import React, { useCallback, useContext, useMemo, useState } from "react";
import { Form, Modal, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ConfigContext from "../../../ConfigProvider/context";
import Select from "../../../Select";
import TextArea from "../../../TextArea";
import Button from "../../../Button";
import { subjectsList } from "./subjects";
import { ISupportModal, ISupportFormData } from "./types";
import "./index.less";

const SupportModal: React.FC<ISupportModal> = ({
  onSubmit,
  visible,
  setVisible,
  uploadFileURL,
  _testState
}) => {
  const { translate } = useContext(ConfigContext);

  const defaultState = {
    subject: "",
    comment: "",
    uploads: []
  };

  const [formData, setFormData] = useState<ISupportFormData>(
    _testState || defaultState
  );
  const [filename, setFilename] = useState<string>("");

  const [form] = Form.useForm();

  const fileProps = useMemo(() => {
    return {
      name: "uploaded_data",
      action: `${uploadFileURL}&filename=${filename}`,
      beforeUpload(file) {
        const sizeLimit = 2;
        const maxFilesNumber = 5;
        const availableFileTypes = new Set([
          "image/jpeg",
          "image/png",
          "image/svg+xml",
          "text/csv",
          "text/plain",
          "application/zip",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ]);

        if (formData.uploads.length >= maxFilesNumber) {
          message.error(
            `${translate("MAX_FILE_NUMBER")} - ${maxFilesNumber}`,
            8
          );
          return false;
        }

        if (file.size / 1024 / 1024 > sizeLimit) {
          message.error(
            `${translate("FILE_MUST_BE_SMALLER_THAN")} ${sizeLimit} MB`,
            8
          );
          return false;
        }

        if (!availableFileTypes.has(file.type)) {
          message.error(`${translate("WRONG_FILE_FORMAT")}`, 8);
          return false;
        }

        setFilename(file.name);

        return true;
      },
      onChange(info) {
        const uid = info.file.uid;

        // if beforeUpload() returned false
        if (!info.file.status) {
          const idx = info.fileList.findIndex(file => file.uid === uid);
          if (idx === -1) return;
          info.fileList.splice(idx, 1);
        }

        if (info.file.status === "done") {
          const token = info.file.response?.upload?.token;
          token &&
            setFormData(prevState => {
              return {
                ...prevState,
                "uploads": [...prevState.uploads, token]
              };
            });
        }
      },
      onRemove(file) {
        const token = file.response?.upload?.token;
        const idx = formData.uploads.findIndex(item => item === token);
        if (idx === -1) return;
        setFormData(prevState => {
          const nextUploads = [...prevState.uploads];
          nextUploads.splice(idx, 1);
          return {
            ...prevState,
            "uploads": nextUploads
          };
        });
      }
    };
  }, [filename, formData.uploads, translate, uploadFileURL]);

  const handleFieldChange = useCallback((name, value) => {
    setFormData(prevState => {
      return {
        ...prevState,
        [name]: value.trim()
      };
    });
  }, []);

  const resetFormData = useCallback(() => {
    setFormData(defaultState);
    form.setFieldsValue(defaultState);
  }, [defaultState, form]);

  const handleSubmit = useCallback(() => {
    setVisible(false);
    onSubmit(formData);
    resetFormData();
  }, [formData, onSubmit, resetFormData, setVisible]);

  const handleCancel = useCallback(() => {
    setVisible(false);
    resetFormData();
  }, [resetFormData, setVisible]);

  const Footer = (
    <Button
      onClick={handleSubmit}
      type="primary"
      disabled={!formData.subject || !formData.comment}
    >
      {translate("SEND")}
    </Button>
  );

  return (
    <>
      <Modal
        className="support-modal"
        title={translate("SUPPORT")}
        centered
        destroyOnClose={true}
        visible={visible}
        footer={Footer}
        onCancel={handleCancel}
      >
        <Form
          name="support_form"
          layout="vertical"
          form={form}
          initialValues={{ ...defaultState, subject: undefined }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="subject"
            label={translate("CHOOSE_PROBLEM")}
            rules={[
              { required: true, message: translate("REQUIRED_FIELD_ERROR") }
            ]}
          >
            <Select
              placeholder={translate("CHOOSE_PROBLEM")}
              dropdownClassName="subjects-dropdown"
              onChange={value => handleFieldChange("subject", value)}
            >
              {subjectsList.map(item => (
                <Select.Option key={item} value={item} label={translate(item)}>
                  {translate(item)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="comment"
            label={translate("COMMENT")}
            rules={[
              { required: true, message: translate("REQUIRED_FIELD_ERROR") }
            ]}
          >
            <TextArea
              rows={5}
              required
              onChange={e => handleFieldChange("comment", e.target.value)}
            />
          </Form.Item>
          <Upload {...fileProps}>
            <Button icon={<UploadOutlined />}>
              {translate("CLICK_TO_UPLOAD_FILE")}
            </Button>
          </Upload>
        </Form>
      </Modal>
    </>
  );
};

export default SupportModal;
