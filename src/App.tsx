import React from 'react';
import './App.css';
import WeatherTable from './components/weather/WeatherTable';

function App() {
  return (
    <div className="container">
      <div className="row">
        <div className="title text-center">
          <h2>Weather Forecast for Netherlands</h2>
        </div>
      </div>
      <WeatherTable />
    </div>
  );
}

export default App;
