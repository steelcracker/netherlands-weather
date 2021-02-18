import { useEffect } from 'react';
import { Forecast } from './helpers/Forecast';
import Cities from './data/nl.cities.json';
import { CITY_ACTIONTYPE, initialState } from './WeatherTable';

/** A row item for the WeatherTable, controls fetching data for its bound city */
export const WeatherTableRow = ({
  city,
  dateIndex,
  dispatch,
}: {
  city: typeof initialState[0];
  dateIndex: number;
  dispatch: React.Dispatch<CITY_ACTIONTYPE>;
}) => {
  useEffect(() => {
    fetchWeather(city)
      .then(forecast =>
        dispatch({ type: 'updateCity', payload: { ...city, forecast } })
      )
      .catch(error => {
        // console.log(error.toString());
        // TODO: add error message somewhere 'Couldn't fetch weather data'
      });
  }, []);

  const remove = () => {
    dispatch({ type: 'removeCity', payload: city.id });
  };

  return (
    <tr>
      <td>{city.name}</td>
      <td>{city.forecast.daily[dateIndex]?.temp.day || '...'}°C</td>
      <td>{city.forecast.daily[dateIndex]?.wind_speed || '...'} m/s</td>
      <td>{city.forecast.daily[dateIndex]?.weather[0]?.main || '...'}</td>
      <td className="column-remove">
        <button onClick={remove}>x</button>
      </td>
    </tr>
  );
};

/** Fetches daily weather forecast for a given city for an upcoming 7 days*/
async function fetchWeather(city: typeof Cities[0]) {
  // TODO:  Warning! API key exposure
  const API_KEY = '2e0d2545a860f3660559744a33b0bb57';

  const apiUrl =
    'https://api.openweathermap.org/data/2.5/onecall?' +
    'exclude=current,minutely,hourly,alerts' +
    '&units=metric' +
    `&appid=${API_KEY}` +
    `&lat=${city.coord.lat}&lon=${city.coord.lon}`;

  // throw new Error('API calls turned off');
  // console.log('API CALL!!');
  const response = await fetch(apiUrl, { cache: 'force-cache' });
  if (!response.ok) {
    throw new Error('HTTP status' + response.status);
  }
  const forecast: Forecast = await response.json();

  return forecast;
}
