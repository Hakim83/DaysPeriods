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
    const daysData = dates.map(date => {
        return getDateData(date, coordinates, timeOffset);
    })
    const shortest = daysData.reduce((a, b) => (+a.sunset - +a.sunrise) < (+b.sunset - +b.sunrise) ? a : b);
    const longest = daysData.reduce((a, b) => (+a.sunset - +a.sunrise) > (+b.sunset - +b.sunrise) ? a : b);
    return new YearData(daysData, shortest, longest);
}

const getDateData = (date: Date, coordinates: Coordinates, timeOffset: number) => {
    const times = new PrayerTimes(coordinates, date, CalculationMethod.MoonsightingCommittee());
    return new TimesData(date, getTimeLocal(times.sunrise, timeOffset), getTimeLocal(times.sunset, timeOffset));
}

const getTimeLocal = (date: Date, timeOffset: number) => {
    //local time zone (+ve hourse for east of GMT)
    //note also we are interested in time part only
    const currentTimeZone = - (date.getTimezoneOffset() / 60);
    return new Date(date.getFullYear(), 0, 1, (date.getHours() + timeOffset - currentTimeZone), date.getMinutes());

}