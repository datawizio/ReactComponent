import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../Modal";
import { CollapseList } from "./components/CollapseList";

import { useRuleInfo } from "./reducer";
import { RuleInfoContext } from "./context";
import { RuleInfoProps } from "./types";
import { parseDimension, parseLogic } from "./helpers";

import "./index.less";

const RuleInfo: React.FC<RuleInfoProps> = memo(
  ({ logic, widget_params, formatDateRange, name }) => {
    const { t } = useTranslation();
    const [state, dispatch] = useRuleInfo({
      logic,
      widget_params,
      formatDateRange,
      name
    });

    const handleCancel = () => {
      dispatch({
        type: "toggleModalShow",
        payload: { show: false, defaultActiveKey: [] }
      });
    };

    return (
      <RuleInfoContext.Provider value={{ ruleInfoState: state, dispatch }}>
        <div className="rule-info">
          <div className="rule-info-title">{t("CONDITION")}</div>
          {typeof logic === "string" ? (
            <div>{logic}</div>
          ) : (
            <div>{parseLogic(logic)}</div>
          )}

          {!!widget_params.dimension && (
            <>
              <div className="rule-info-title">{t("DIMENSIONS")}</div>
              <div>
                {parseDimension(widget_params.dimension, formatDateRange)}
              </div>
            </>
          )}

          {!!widget_params.filters?.length && (
            <>
              <div className="rule-info-title">{t("FILTERS")}</div>
              <div>
                {widget_params.filters.map(filter =>
                  parseDimension(filter, formatDateRange)
                )}
              </div>
            </>
          )}
        </div>
        <Modal
          title={name}
          className="rule-info-modal"
          visible={state.modalShow}
          width={"65%"}
          destroyOnClose={true}
          onCancel={handleCancel}
          footer={null}
          centered
        >
          <CollapseList />
        </Modal>
      </RuleInfoContext.Provider>
    );
  }
);

export default RuleInfo;
