import { useEffect, useState } from "react";
import HandleError from "./Component/HandleError";
import Start from "./Component/Start";

function App() {
  const [data, setData] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);
  const [units, setUnits] = useState("metric");
  const [start, setStart] = useState(true);

  const setUnitsHandler = function (type) {
    setUnits(type);
  };

  const unitsSign = function (units) {
    if (units === "standard") return "K";
    if (units === "metric") return "°C";
    if (units === "imperial") return "°F";
  };

  const speedSign = function (units) {
    if (units === "standard") return "M/S";
    if (units === "metric") return "M/S";
    if (units === "imperial") return "MPH";
  };

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${units}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;

  const fetchingData = async function () {
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Please Enter A Right City ${response.status}`);

      const data = await response.json();
      setData(data);
    } catch (err) {
      setLocation("");
      setData("");
      setError(`${err.message} 💥`);
    }
  };

  const searchLocation = async function (e) {
    if (e.key === "Enter") {
      setStart(false);
      setError(null);
      await fetchingData();
    }
  };

  useEffect(() => {
    if (!start) fetchingData();
  }, [units]);

  return (
    <div className="app">
      <div className="search">
        <input
          type="text"
          placeholder="Enter Location.."
          onChange={(e) => setLocation(e.target.value)}
          onKeyPress={searchLocation}
          value={location}
        />
      </div>

      {data.name && (
        <div className="container">
          <div className="top">
            <div className="location">
              <p>
                {data.name}, {data.sys.country}
              </p>
            </div>

            <div className="temp">
              {data.main ? (
                <h1>
                  {data.main.temp.toFixed(1)}
                  {unitsSign(units)}
                </h1>
              ) : null}
            </div>

            <div className="discription">
              {data.weather ? <p>{data.weather[0].main}</p> : null}
            </div>
          </div>

          <div className="button-container">
            <button className="btn" onClick={() => setUnitsHandler("standard")}>
              To Kelvin
            </button>
            <button className="btn" onClick={() => setUnitsHandler("imperial")}>
              To Fahrenheit
            </button>
            <button className="btn" onClick={() => setUnitsHandler("metric")}>
              To Celsius
            </button>
          </div>

          <div className="bottom">
            <div className="feels">
              {data.main ? (
                <p className="bold">
                  {data.main.feels_like.toFixed(1)}
                  {unitsSign(units)}
                </p>
              ) : null}
              <p>Feels Like</p>
            </div>

            <div className="humidity">
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>

            <div className="wind">
              {data.wind ? (
                <p className="bold">
                  {data.wind.speed} {speedSign(units)}
                </p>
              ) : null}
              <p>Wind Speed</p>
            </div>
          </div>
        </div>
      )}

      {!data.name && <HandleError error={error} />}

      {start && <Start />}
    </div>
  );
}

export default App;
