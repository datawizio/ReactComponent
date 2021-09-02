import React, { useContext } from "react";

import DatePicker from "../DatePicker";

import { TimeRangePickerProps } from "antd/es/time-picker";
import dayjs from "dayjs";
import ConfigContext from "../ConfigProvider/context";

export interface TimePickerProps
  extends Omit<TimeRangePickerProps, "value" | "onChange"> {
  fullWidth?: boolean;
  value?: { from: string; to: string };
  onChange?: (value: { from: string; to: string }) => void;
}

const TimeRangePicker = React.forwardRef<any, TimePickerProps>(
  ({ value, fullWidth, ...props }, ref) => {
    const { translate } = useContext(ConfigContext);
    const handleChange = (_, value) => {
      const [from, to] = value ? value : [null, null];
      props.onChange && props.onChange({ from, to });
    };
    return (
      //@ts-ignore
      <DatePicker.RangePicker
        {...props}
        onChange={handleChange}
        value={
          value && [
            //@ts-ignore
            value.from ? dayjs(value.from, props.format ?? "HH:mm") : null,
            //@ts-ignore
            value.to ? dayjs(value.to, props.format ?? "HH:mm") : null
          ]
        }
        //@ts-ignore
        dropdownClassName={props.popupClassName}
        picker="time"
        className={fullWidth ? "ant-picker-w100" : ""}
        mode={undefined}
        ref={ref}
        placeholder={[translate("START_TIME"), translate("END_TIME")]}
      />
    );
  }
);

export default TimeRangePicker;
