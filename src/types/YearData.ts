import { TimesData } from "./TimesData";

export class YearData {
    timesData: TimesData[];
    minDate: TimesData;
    maxDate: TimesData;
    constructor(timesData: TimesData[], minDate: TimesData, maxDate: TimesData) {
        this.timesData = timesData;
        this.minDate = minDate;
        this.maxDate = maxDate;
    }
}