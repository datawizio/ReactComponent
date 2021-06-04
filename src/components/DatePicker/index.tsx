import { Dayjs } from "dayjs";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import generatePicker from "antd/lib/date-picker/generatePicker";

import "./index.less";

// dayjsGenerateConfig.getEndDate = date => {
//   return date.startOf("month");
// };

// dayjsGenerateConfig.getWeekDay = date => {
//   const clone = date.locale("en");
//   //@ts-ignore
//   return clone.weekday() + clone.localeData().firstDayOfWeek() - 1;
// };

dayjsGenerateConfig.getMonth = date => {
  return date.date() >= 30 ? date.month() + 1 : date.month();
};

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

export default DatePicker;
