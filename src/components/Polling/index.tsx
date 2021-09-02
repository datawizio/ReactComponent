import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Row, notification } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Step from "./Step";
import {
  PollingPayload,
  PollingProps,
  PollingQuestion,
  PollingStep
} from "./types";
import "./index.less";

const Polling: React.FC<PollingProps> = ({
  questions,
  cancelGenerateId,
  onSubmit,
  onPollingHide,
  onPollingShow
}) => {
  const { t } = useTranslation();
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [pollingShown, setPollingShown] = useState<boolean>(!!questions.length);

  const steps = useMemo(() => {
    if (!questions || !questions.length) return [];

    return questions.map((q: PollingQuestion, index: number) => {
      const step: PollingStep = {
        question_key: q.question_key,
        polling_template: q.polling_template,
        feedback_type: q.feedback_type,
        id: cancelGenerateId
          ? index.toString()
          : String(new Date().getTime()) +
            String((Math.random() * 1000).toFixed())
      };

      if (q.feedback_type === "mark") {
        step.mark = null;
      }

      if (q.feedback_type === "text") {
        step.comment = "";
      }

      return step;
    });
  }, [questions]);

  const goToNextStep = useCallback(() => {
    setActiveStepIdx(activeStepIdx + 1);
    setPollingShown(!!steps[activeStepIdx + 1]);

    if (!steps[activeStepIdx + 1]) {
      notification.success({
        message: t("THANKS_FOR_FEEDBACK")
      });
    }
  }, [activeStepIdx, steps, t]);

  const submit = useCallback(
    (value = null, polled = true) => {
      const step = steps[activeStepIdx];
      if (!step) return;

      const payload: PollingPayload = {
        polling_template: step.polling_template,
        polled
      };

      if (step.feedback_type === "mark" && polled) {
        payload.mark = value;
      }

      if (step.feedback_type === "text" && polled) {
        payload.comment = value;
      }

      onSubmit(payload);

      polled && goToNextStep();
    },
    [activeStepIdx, goToNextStep, onSubmit, steps]
  );

  const close = useCallback(() => {
    setPollingShown(false);
    submit(null, false);
  }, [submit]);

  useEffect(() => {
    setPollingShown(!!steps.length);
  }, [steps]);

  useEffect(() => {
    pollingShown
      ? onPollingShow && onPollingShow()
      : onPollingHide && onPollingHide();
  }, [onPollingHide, onPollingShow, pollingShown]);

  return pollingShown ? (
    <Row className="polling-container" key={steps[activeStepIdx].id}>
      <Step step={steps[activeStepIdx]} onSubmit={submit} />
      <CloseOutlined className="polling-close-btn" onClick={close} />
    </Row>
  ) : null;
};

export default Polling;
