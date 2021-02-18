import { useState } from 'react';
import { Hint } from 'react-autocomplete-hint';
import { stubForecast } from './helpers/Forecast';
import Cities from './data/nl.cities.json';
import { CITY_ACTIONTYPE } from './WeatherTable';

const options = Cities.map(city => city.name);

/** A form input to add new cities to the table. Includes autocomplete. */
const AddCityForm = ({
  dispatch,
}: {
  dispatch: React.Dispatch<CITY_ACTIONTYPE>;
}) => {
  const [value, setValue] = useState<string>('');
  const [showError, setShowError] = useState(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowError(false);
    setValue(event.target.value);
  };

  const onFill = (option: string) => {
    setValue(option);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newCity = Cities.find(
      city => city.name.toLowerCase() === value.toLowerCase()
    );
    if (!newCity) {
      setShowError(true);
    } else {
      dispatch({
        type: 'addCity',
        payload: { ...newCity, forecast: stubForecast },
      });
      setValue('');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="row">
        <div className="five columns">
          <Hint options={options} allowTabFill onFill={onFill}>
            <input
              className="u-full-width"
              type="text"
              name="newcity"
              id="newcity"
              required
              placeholder="+ Search another city"
              value={value}
              onChange={onChange}
            />
          </Hint>
        </div>
        <div className="one column">
          <input className="button-primary" type="submit" value="Add" />
        </div>
      </div>
      <div className="row">
        <p className="alert" hidden={!showError}>
          Sorry, but such a city was not found. Please, try another one
        </p>
      </div>
    </form>
  );
};

export default AddCityForm;
