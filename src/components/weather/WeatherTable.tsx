import { useCallback, useReducer, useState } from 'react';
import AddCityForm from './AddCityForm';
import DaysSelector from './DaysSelector';
import { stubForecast } from './helpers/Forecast';
import Cities from './data/nl.cities.json';
import SorterSpan, { SorterSpanOrder } from './helpers/SorterSpan';
import { WeatherTableRow } from './WeatherTableRow';

const defaultCity = Cities.find(city => city.name === 'Amsterdam')!;
/** cities-reducer's initial state */
export const initialState = [{ ...defaultCity, forecast: stubForecast }];

/** cities-reducer's actions */
export type CITY_ACTIONTYPE =
  | { type: 'addCity'; payload: typeof initialState[0] }
  | { type: 'updateCity'; payload: typeof initialState[0] }
  | { type: 'removeCity'; payload: number }
  | {
      type: 'sortByTemp';
      payload: { order: 'asc' | 'desc'; dateIndex: number };
    }
  | {
      type: 'sortByWind';
      payload: { order: 'asc' | 'desc'; dateIndex: number };
    };

/** cities-reducer itslef */
function cititesReducer(cities: typeof initialState, action: CITY_ACTIONTYPE) {
  let dateIndex: number;
  switch (action.type) {
    case 'addCity':
      if (cities.find(city => city.id === action.payload.id)) {
        return cities;
      } else {
        return [...cities, action.payload];
      }
    case 'updateCity':
      const targetCity = cities.find(city => city.id === action.payload.id);
      if (targetCity) {
        return [
          ...cities.filter(city => city.id !== action.payload.id),
          action.payload,
        ];
      } else {
        return cities;
      }
    case 'removeCity':
      return cities.filter(city => city.id !== action.payload);
    case 'sortByTemp':
      dateIndex = action.payload.dateIndex;
      return cities.sort((a, b) => {
        const aTemp = a.forecast.daily[dateIndex].temp.day,
          bTemp = b.forecast.daily[dateIndex].temp.day;
        return action.payload.order === 'asc' ? aTemp - bTemp : bTemp - aTemp;
      });
    case 'sortByWind':
      dateIndex = action.payload.dateIndex;
      return cities.sort((a, b) => {
        const aWind = a.forecast.daily[dateIndex].wind_speed,
          bWind = b.forecast.daily[dateIndex].wind_speed;
        return action.payload.order === 'asc' ? aWind - bWind : bWind - aWind;
      });
    default:
      throw new Error('Invalid reducer action');
  }
}

/** Main component with a weather table, controls all other parts */
const WeatherTable = () => {
  const [cities, dispatch] = useReducer(cititesReducer, initialState);
  const [dateIndex, setDateIndex] = useState(0);

  const [orderingState, setOrderingState] = useState<{
    temp: SorterSpanOrder;
    wind: SorterSpanOrder;
  }>({
    temp: 'none',
    wind: 'none',
  });

  const onClickTemp = () => {
    const newOrder = orderingState.temp === 'asc' ? 'desc' : 'asc';
    setOrderingState({ temp: newOrder, wind: 'none' });
    dispatch({ type: 'sortByTemp', payload: { order: newOrder, dateIndex } });
  };

  const onClickWind = () => {
    const newOrder = orderingState.wind === 'asc' ? 'desc' : 'asc';
    setOrderingState({ temp: 'none', wind: newOrder });
    dispatch({ type: 'sortByWind', payload: { order: newOrder, dateIndex } });
  };

  const changeDateIndex = useCallback(index => {
    setDateIndex(index);
    setOrderingState({ temp: 'none', wind: 'none' });
  }, []);

  return (
    <>
      <div className="row">
        <DaysSelector
          selectedDateIndex={dateIndex}
          setDateIndex={changeDateIndex}
        />
      </div>
      <div className="row">
        <table className="u-full-width">
          <thead>
            <tr>
              <th>City</th>
              <th
                className="clickable"
                onClick={onClickTemp}
                title="Temperature during a day"
              >
                <SorterSpan order={orderingState.temp}>Temp</SorterSpan>
              </th>
              <th className="clickable" onClick={onClickWind}>
                <SorterSpan order={orderingState.wind}>Wind speed</SorterSpan>
              </th>
              <th>Weather</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cities.map(city => (
              <WeatherTableRow
                key={city.id}
                city={city}
                dateIndex={dateIndex}
                dispatch={dispatch}
              />
            ))}
          </tbody>
        </table>
        <AddCityForm dispatch={dispatch} />
      </div>
    </>
  );
};

export default WeatherTable;
