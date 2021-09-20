import dayjs, { Dayjs } from "dayjs";
const format = "DD-MM-YYYY";
class FiscalCalendar {
  DAYS_IN_YEAR = 364;
  DAYS_IN_QUARTAL = (4 + 4 + 5) * 7;
  PATTERN = [4, 4, 5];
  calendar = {};
  startDate: Dayjs;

  constructor(startDate: Dayjs) {
    this.startDate = startDate;
  }

  getEndDate(date: Dayjs) {
    if (isNaN(date.month())) return date;
    const month = this.getMonth(date) + 1;
    const quater = Math.ceil(month / 3);
    const res = month - (quater - 1) * 3;
    let dayInYear = (quater - 1) * this.DAYS_IN_QUARTAL;
    for (let i = 0; i < res; i++) {
      dayInYear += this.PATTERN[i] * 7;
    }
    return this.startDate.add(dayInYear, "day");
  }

  getMonth(date: Dayjs) {
    const yearNumber = this.getYear(date);

    const year = this.calendar[yearNumber];

    const dayInYear = date.diff(year.from, "day") + 1;

    const quartal = Math.ceil(dayInYear / this.DAYS_IN_QUARTAL);
    const dayInQuartal = dayInYear - (quartal - 1) * this.DAYS_IN_QUARTAL;

    let temp = dayInQuartal;
    let month = 0;

    for (let p of this.PATTERN) {
      if (temp - p * 7 <= 0) return (quartal - 1) * 3 + month;
      temp -= p * 7;
      month++;
    }
    return (quartal - 1) * 3 + month;
  }

  getStartOfMonth(date: Dayjs) {
    debugger;
    if (isNaN(date.month())) return date;
    const month = this.getMonth(date);
    const quater = Math.ceil(month / 3);
    const res = month - (quater - 1) * 3;
    let dayInYear = (quater - 1) * this.DAYS_IN_QUARTAL;
    for (let i = 0; i < res; i++) {
      dayInYear += this.PATTERN[i] * 7;
    }
    return this.startDate.add(dayInYear, "day");
  }

  getStartOfQuater(date: Dayjs) {
    debugger;
    if (isNaN(date.month())) return date;
    const month = this.getMonth(date);
    const quater = Math.ceil(month / 3);
    let dayInYear = (quater - 1) * this.DAYS_IN_QUARTAL;
    return this.startDate.add(dayInYear, "day");
  }

  getStartOfYear(date: Dayjs) {
    if (isNaN(date.month())) return date;
    const yearNumber = this.getYear(date);
    return dayjs(this.calendar[yearNumber].from);
  }

  getYear(date: Dayjs) {
    let year = date.year();
    const checks = [0, 1, -1];
    for (let c of checks) {
      if (this.checkDateInYear(year + c, date)) {
        return year + c;
      }
    }
  }

  checkDateInYear(year: number, date: Dayjs) {
    if (!this.calendar[year]) this._generateCalendar(year);
    const from = dayjs(this.calendar[year].from).hour(0).minute(0);
    const to = dayjs(this.calendar[year].to).hour(23).minute(59);
    return from <= date && date <= to;
  }

  presetCurrentMonth(maxDate = null) {
    const min = maxDate
      ? this.getStartOfMonth(dayjs(maxDate, format))
      : this.getStartOfMonth(dayjs());
    const max = maxDate ? dayjs(maxDate, format) : dayjs();
    return [min, max];
  }

  presetCurrentQuater(maxDate = null) {
    const min = maxDate
      ? this.getStartOfQuater(dayjs(maxDate, format))
      : this.getStartOfQuater(dayjs());
    const max = maxDate ? dayjs(maxDate, format) : dayjs();
    return [min, max];
  }

  presetCurrentYear(maxDate = null) {
    const min = maxDate
      ? this.getStartOfYear(dayjs(maxDate, format))
      : this.getStartOfYear(dayjs());
    const max = maxDate ? dayjs(maxDate, format) : dayjs();
    return [min, max];
  }

  _generateCalendar(year: number) {
    let arr = [];
    let clone = this.startDate.clone();
    const diff = year - clone.year();

    // const obj = {};
    const startYear = clone.year();

    if (diff < 0) {
      for (let i = 1; i <= Math.abs(diff); i++) {
        const current = startYear - i;
        if (this.calendar[current]) {
          clone = dayjs(this.calendar[current].from);
          continue;
        }
        clone = clone.add(-1, "day");
        this.calendar[current] = {
          from: "",
          to: clone.format("YYYY-MM-DD"),
          weeks: 52
        };
        clone = clone.add(-(this.DAYS_IN_YEAR - 1), "day");
        if (clone.month() === 1 && clone.date() >= 5) {
          clone = clone.add(-7, "day");
          this.calendar[current].weeks = 53;
        }
        this.calendar[current].from = clone.format("YYYY-MM-DD");
        // start = start.add(-1, "day");
      }
    } else {
      for (let i = 0; i <= diff; i++) {
        const current = startYear + i;
        if (this.calendar[current]) {
          clone = dayjs(this.calendar[current].to).add(1, "day");
          continue;
        }
        this.calendar[current] = {
          from: clone.format("YYYY-MM-DD"),
          to: "",
          weeks: 52
        };
        clone = clone.add(this.DAYS_IN_YEAR - 1, "day");
        if (clone.month() === 0 && clone.date() <= 27) {
          clone = clone.add(7, "day");
          this.calendar[current].weeks = 53;
        }
        this.calendar[current].to = clone.format("YYYY-MM-DD");
        clone = clone.add(1, "day");
      }
    }
  }
}

export const fiscalCalendar = new FiscalCalendar(dayjs("2021-01-31"));
