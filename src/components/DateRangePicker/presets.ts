import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DateRange, DefaultPresetPrevType, DefaultPresetType } from "./types";
import { genPrevPeriod, reverseDate } from "./utils";
import { fiscalCalendar } from "../../utils/retailCalendar";

dayjs.extend(quarterOfYear);
dayjs.extend(customParseFormat);

const format = "DD-MM-YYYY";

export const DefaultPresetRanges: DefaultPresetType = {
  yesterday: (maxDate = null): DateRange => {
    const max = maxDate
      ? dayjs(maxDate, format).subtract(1, "d")
      : dayjs().subtract(1, "d");
    return [max, max];
  },

  lastWeek: (maxDate = null): DateRange => {
    const min = maxDate
      ? dayjs(maxDate, format).subtract(6, "d")
      : dayjs().subtract(6, "d");
    const max = maxDate ? dayjs(maxDate, format) : dayjs();
    return [min, max];
  },

  currentMonth: (maxDate = null): DateRange => {
    const min = maxDate
      ? dayjs(maxDate, format).startOf("month")
      : dayjs().startOf("month");
    const max = maxDate ? dayjs(maxDate, format) : dayjs();
    return [min, max];
  },

  last_30_days: (maxDate = null): DateRange => {
    const min = maxDate
      ? dayjs(maxDate, format).subtract(29, "d")
      : dayjs().subtract(29, "d");
    const max = maxDate ? dayjs(maxDate, format) : dayjs();
    return [min, max];
  },

  last_90_days: (maxDate = null): DateRange => {
    const min = maxDate
      ? dayjs(maxDate, format).subtract(89, "d")
      : dayjs().subtract(89, "d");
    const max = maxDate ? dayjs(maxDate, format) : dayjs();
    return [min, max];
  },

  quarterBegin: (maxDate = null): DateRange => {
    const min = maxDate
      ? dayjs(maxDate, format).startOf("quarter")
      : dayjs().startOf("quarter");
    const max = maxDate ? dayjs(maxDate, format) : dayjs();
    return [min, max];
  },

  last_180_days: (maxDate = null): DateRange => {
    const min = maxDate
      ? dayjs(maxDate, format).subtract(179, "d")
      : dayjs().subtract(179, "d");
    const max = maxDate ? dayjs(maxDate, format) : dayjs();
    return [min, max];
  },

  last_365_days: (maxDate = null): DateRange => {
    const min = maxDate
      ? dayjs(maxDate, format).subtract(1, "year")
      : dayjs().subtract(1, "year");
    const max = maxDate ? dayjs(maxDate, format) : dayjs();
    return [min, max];
  },

  currentYear: (maxDate = null): DateRange => {
    const min = maxDate
      ? dayjs(maxDate, format).startOf("y")
      : dayjs().startOf("y");
    const max = maxDate ? dayjs(maxDate, format) : dayjs();
    return [min, max];
  },

  allPeriod: (minDate = null, maxDate = null): DateRange => {
    const min = minDate ? dayjs(minDate, format) : dayjs().subtract(10, "year");
    const max = maxDate ? dayjs(maxDate, format) : dayjs();
    return [min, max];
  }
};

export const DefaultPresetPrevRanges: DefaultPresetPrevType = {
  previous: (dateFrom = null, dateTo = null): DateRange => {
    let [min, max] = genPrevPeriod(dateFrom, dateTo);
    min = min ? dayjs(min, format) : null;
    max = max ? dayjs(max, format) : null;
    return [min, max];
  },
  prev_last_week: (dateFrom = null, dateTo = null): DateRange => {
    const min = dayjs(dateFrom, format).subtract(1, "week");
    const max = dayjs(dateTo, format).subtract(1, "week");
    return [min, max];
  },
  prev_last_month: (dateFrom = null, dateTo = null): DateRange => {
    const min = dayjs(dateFrom, format).subtract(1, "month");
    const max = dayjs(dateTo, format).subtract(1, "month");
    return [min, max];
  },
  prev_last_quarter: (dateFrom = null, dateTo = null): DateRange => {
    const min = dayjs(dateFrom, format).subtract(1, "quarter");
    const max = dayjs(dateTo, format).subtract(1, "quarter");
    return [min, max];
  },
  prev_last_year: (dateFrom = null, dateTo = null): DateRange => {
    // @ts-ignore
    const diff = dayjs(reverseDate(dateTo)).diff(reverseDate(dateFrom), "day");
    const min = dayjs(dateFrom, format).subtract(1, "year");
    const max = min.add(+diff, "day");
    return [min, max];
  }
};

// export const DefaultPreset = (minDate, maxDate) => {
//   return {
//     "Yesterday": DefaultPresetRanges.yesterday(maxDate),
//     "Last_week": DefaultPresetRanges.lastWeek(maxDate),
//     "Current_month": DefaultPresetRanges.currentMonth(maxDate),
//     "Last_30_Days": DefaultPresetRanges.last_30_days(maxDate),
//     "Last_90_Days": DefaultPresetRanges.last_90_days(maxDate),
//     "LAST_180_DAYS": DefaultPresetRanges.last_180_days(maxDate),
//     "SEASON_BEGIN": DefaultPresetRanges.quarterBegin(maxDate),
//     "cur_year": DefaultPresetRanges.currentYear(maxDate),
//     "LAST_365_DAYS": DefaultPresetRanges.last_365_days(maxDate),
//     "All_period": DefaultPresetRanges.allPeriod(minDate, maxDate)
//   };
// };

export const DefaultPreset = (minDate, maxDate) => {
  return {
    "Yesterday": DefaultPresetRanges.yesterday(maxDate),
    "Last_week": DefaultPresetRanges.lastWeek(maxDate),
    "Current_month": fiscalCalendar.presetCurrentMonth(maxDate),
    "Last_30_Days": DefaultPresetRanges.last_30_days(maxDate),
    "Last_90_Days": DefaultPresetRanges.last_90_days(maxDate),
    "LAST_180_DAYS": DefaultPresetRanges.last_180_days(maxDate),
    "SEASON_BEGIN": fiscalCalendar.presetCurrentQuater(maxDate),
    "cur_year": fiscalCalendar.presetCurrentYear(maxDate),
    "LAST_365_DAYS": DefaultPresetRanges.last_365_days(maxDate),
    "All_period": DefaultPresetRanges.allPeriod(minDate, maxDate)
  };
};

export const DefaultPresetPrev = (dateFrom, dateTo) => {
  return {
    "PREVIOUS": DefaultPresetPrevRanges.previous(dateFrom, dateTo),
    "PREV_LAST_WEEK": DefaultPresetPrevRanges.prev_last_week(dateFrom, dateTo),
    "PREV_LAST_MONTH": DefaultPresetPrevRanges.prev_last_month(
      dateFrom,
      dateTo
    ),
    "PREV_LAST_QUARTER": DefaultPresetPrevRanges.prev_last_quarter(
      dateFrom,
      dateTo
    ),
    "PREV_LAST_YEAR": DefaultPresetPrevRanges.prev_last_year(dateFrom, dateTo)
  };
};
