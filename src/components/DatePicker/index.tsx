import dayjs, { Dayjs } from "dayjs";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import generatePicker from "antd/lib/date-picker/generatePicker";

import "./index.less";
import { fiscalCalendar } from "../../utils/retailCalendar";

// console.log();

// generateFiscalCalendar(dayjs("2021-01-31"), 2030);

dayjsGenerateConfig.getEndDate = date => {
  // console.log(date, calendar.getEndDate(date));
  return fiscalCalendar.getEndDate(date);
};

// dayjsGenerateConfig.getWeekDay = date => {
//   const clone = date.locale("en");
//   //@ts-ignore
//   return clone.weekday() + clone.localeData().firstDayOfWeek() - 1;
// };

dayjsGenerateConfig.getMonth = date => {
  // console.log(date.format("DD-MM-YYYY"), calendar.getMonth(date));
  return fiscalCalendar.getMonth(date);
  // return date.date() >= 30 ? date.month() + 1 : date.month();
};

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

export default DatePicker;
