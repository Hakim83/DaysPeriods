import { Select } from "@thisbeyond/solid-select";
import { Component, Show, createSignal } from "solid-js";
import "@thisbeyond/solid-select/style.css";

interface AutocompleteProps {
  selectionUpdated: (info: CityInfo) => void;
}

export class CityInfo {
  name: string;
  countryName: string;
  lat: number;
  lng: number;
  timeOffset: number;
  constructor(name: string, countryName: string, lat: number, lng: number, timeOffset: number) {
    this.name = name;
    this.countryName = countryName;
    this.lat = lat;
    this.lng = lng;
    this.timeOffset = timeOffset;
    this.cityDescription = `${this.name}, ${this.countryName}`;
  }
  cityDescription: string;
}


interface GeonamesParams {
  username: string;
  name_startsWith: string;
  maxRows: number;
  style: string;
  orderby: string;
  cities: string;
  featureClass: string;
}

export const Autocomplete: Component<AutocompleteProps> = (props) => {
  const [cityInfos, setCityInfos] = createSignal<CityInfo[]>([]);
  const [selectCity, setSelectCity] = createSignal<boolean>(false);
  const fetchData2 = async (inputValue: string) => {
    return await new Promise<string[]>((resolve) => {
      setTimeout(
        () => {
          const result = ["apple", "banana", "pear", "pineapple", "kiwi"].filter((option) =>
            inputValue.length > 2 && option.startsWith(inputValue));
          resolve(result);
        },
        500
      );
    });
  };
  const chooseMethod = (method: string) => {
    switch (method) {
      case "myLocation":
        setSelectCity(false);
        updateFromMyLocation();
        break;
      case "selectCity":
        setSelectCity(true);
        break;
      default:
        break;
    }
  }
  const fetchData = async (inputValue: string) => {
    let result: CityInfo[] = [];

    if (inputValue.length > 2) {
      const url = "https://secure.geonames.org/searchJSON";
      const params: GeonamesParams = {
        username: "hakim83", // please replace with your own username
        name_startsWith: `${inputValue}`,  //key search
        maxRows: 5, //max result count
        style: "FULL",  //full result
        orderby: "population",
        cities: "cities15000",  // sities with population > 15000
        featureClass: "P",  //populated classes
      };
      // Create a query string from the parameters object
      const queryString = (Object.keys(params) as Array<keyof typeof params>)
        .map(key => `${key}=${params[key]}`)
        .join("&");

      // get key word city info
      try {
        const response = await fetch(`${url}?${queryString}`);
        const data = await response.json();
        if (data["totalResultsCount"]) {
          (data["geonames"] as any[])?.forEach(geoname => {
            const newInfo = new CityInfo(geoname["name"], geoname["countryName"], Number(geoname["lat"]), Number(geoname["lng"]), geoname["timezone"]["dstOffset"]);
            if (!result.some((inf) => inf.cityDescription == newInfo.cityDescription)) {
              result.push(newInfo);
            }
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    setCityInfos(result);
  };
  const updateSelection = (value: string) => {
    const info = cityInfos().find(i => i.cityDescription == value);
    if (info) {
      //console.log(`lat:${info?.lat}, lng:${info?.lng}, offset:${info?.timeOffset}`);
      props.selectionUpdated(info);
    }
  }

  const updateFromMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {

        const tz = -(new Date().getTimezoneOffset() / 60);
        const info = new CityInfo("My location", "", position.coords.latitude, position.coords.longitude, tz);
        props.selectionUpdated(info);
      });
    } else {
      alert("Geo-location is not supported or is blocked for this page, enable it and try again!");
    }
  }

  return (
    <>
      <div class="col-auto mt-1">
        <label class="align-middle">Location</label>
      </div>
      <div class="col-auto">
        <select class="form-select" onChange={(e) => chooseMethod(e.currentTarget.value)}>
          <option></option>
          <option value="myLocation">Use My Location</option>
          <option value="selectCity">Select a City</option>
        </select>
      </div>
      <Show when={selectCity()}>
        <div class="col-3 d-flex align-items-center">
          <Select placeholder="" class="bg-white border rounded w-100 h-100" emptyPlaceholder="" readonly={false} onInput={fetchData} onChange={updateSelection} options={cityInfos().map(i => i.cityDescription)} />
        </div>
      </Show>
    </>
  );
};