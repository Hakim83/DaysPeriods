import { createSignal, type Component, JSX, createEffect, Show } from 'solid-js';
import { Autocomplete, CityInfo } from "./components/autocomplete/autocomplete";
import "./services/prayerTimes";
import { Coordinates } from 'adhan';
import { getYearData } from './services/prayerTimes';
import LineChart from './components/lineChart/lineChart';
import { TimeDataPoint } from './types/TimeDataPoint';
import { TimesData } from './types/TimesData';

const [coordinates, setCoordinates] = createSignal<Coordinates>();
const [timeZone, setTimeZone] = createSignal<number>();
const [sunriseDate, setSunriseData] = createSignal<TimeDataPoint[]>([]);
const [sunsetDate, setSunsetData] = createSignal<TimeDataPoint[]>([]);
const [shortestData, setShortestData] = createSignal<TimesData>();
const [longestData, setLongestData] = createSignal<TimesData>();

const App: Component = () => {

  const canUpdateGraph: () => boolean = () => !!coordinates() && !!timeZone();

  const updateZone = (newVal: string) => {
    const oldVal = timeZone();
    const regex = /^[-+]?\d+(\.\d+)?$/;
    if (regex.test(newVal)) {
      const num = Number(newVal);
      if (num >= -12 && num <= 14) {
        setTimeZone(num);
        return;
      }
    }
    //invalid valid, reset
    alert("invalid time zone offset, insert a valid number");
    setTimeZone(timeZone());
  }

  const UpdateCityInfo = (info: CityInfo) => {
    setTimeZone(info.timeOffset);
    setCoordinates(new Coordinates(info.lat, info.lng));
    console.log(`city info updated: ${info.cityDescription}, lat: ${info.lat}, lng: ${info.lng}, time zone: ${info.timeOffset}`);
  }

  const updateGraph = () => {
    const data = getYearData(coordinates()!, timeZone()!);
    const year = new Date().getFullYear();
    setSunriseData(data.timesData.map(d => { return { x: d.date, y: new Date(year, 0, 1, d.sunrise.getHours(), d.sunrise.getMinutes()) } }));
    setSunsetData(data.timesData.map(d => { return { x: d.date, y: new Date(year, 0, 1, d.sunset.getHours(), d.sunset.getMinutes()) } }));
    setShortestData(data.minDate);
    setLongestData(data.maxDate);
  }

  const formatPeriod = (t1: Date, t2: Date) => {
    const sec = Math.floor((+t1 - +t2) / 1000);
    return `${Math.floor(sec / 3600)} hr, ${sec % 60} min`;
  }
  return (
    <div class="m-3">
      <div class="row ">
        <Autocomplete selectionUpdated={UpdateCityInfo}></Autocomplete>
        <div class="col-auto mt-1">
          <label class="form-label align-middle">Select Time Zone</label>
          </div>
        <div class="col-auto">
          <input class="form-control" type="text" value={timeZone() || ""} onchange={e => updateZone(e.currentTarget.value)} />
        </div>
        <div class="col-2 d-grid">
          <button class="btn btn-primary" onClick={updateGraph} disabled={!canUpdateGraph()}>Update</button>
        </div>
      </div>
      <div class="row">
        <label id="result"></label>
      </div>
      <div class="row">
        <Show when={sunsetDate().length && sunriseDate().length}>
          <LineChart data={{ sunriseData: sunriseDate(), sunsetData: sunsetDate() }} />
        </Show>
      </div>
      <div class="row">
        <Show when={longestData() && shortestData()}>
          <div class="col"> <strong>Longest period:</strong> {formatPeriod(longestData()?.sunset!, longestData()?.sunrise!)}, <strong>On:</strong> {longestData()?.date.toLocaleDateString()}</div>
          <div class="col"> <strong>Shortest period:</strong> {formatPeriod(shortestData()?.sunset!, shortestData()?.sunrise!)}, <strong>On:</strong> {shortestData()?.date.toLocaleDateString()}</div>
        </Show>
      </div>
    </div>
  );
};

export default App;
