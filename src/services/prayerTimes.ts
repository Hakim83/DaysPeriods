import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { TimesData } from '../types/TimesData';
import { YearData } from '../types/YearData';

const getCurrentYearDays = () => {
    const year = new Date().getFullYear();
    let date = new Date(year, 0, 1);
    let dates = [];
    while (date.getFullYear() == year) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return dates;
}
const currentYearDays = getCurrentYearDays();
export const getYearData = (coordinates: Coordinates, timeOffset: number) => {
    const dates = currentYearDays;
    const yearData = dates.map(date => {
        return getDateData(date, coordinates, timeOffset);
    })
    const shortest = yearData.reduce((a, b) => (+a.sunset - +a.sunrise) < (+b.sunset - +b.sunrise) ? a : b);
    const longest = yearData.reduce((a, b) => (+a.sunset - +a.sunrise) > (+b.sunset - +b.sunrise) ? a : b);
    return new YearData(yearData,shortest,longest);
}

const getDateData = (date: Date, coordinates: Coordinates, timeOffset: number) => {
    const times = new PrayerTimes(coordinates, date, CalculationMethod.MoonsightingCommittee());
    return new TimesData(date, getDateLocal(times.sunrise, timeOffset), getDateLocal(times.sunset, timeOffset));
}

const getDateLocal = (date: Date, timeOffset: number) => {
    //local time zone (+ve hourse for east of GMT)
    const currentTimeZone = - (date.getTimezoneOffset() / 60);
    return new Date(date.setHours(date.getHours() + timeOffset - currentTimeZone));

}