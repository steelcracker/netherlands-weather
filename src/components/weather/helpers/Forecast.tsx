/** Openwether forecast API excerpt */
export interface Forecast {
  /** Shift in seconds from UTC */
  timezone_offset: number;
  /** Daily forecast weather data API response */
  daily: {
    /** Time of the forecasted data, Unix, UTC */
    dt: number;
    temp: {
      /** Day temperature */
      day: number;
    };
    wind_speed: number;
    weather: [
      {
        /** Group of weather parameters (Rain, Snow, Extreme etc.) */
        main: string;
        /** Weather condition within the group */
        description: string;
        /** Weather icon id */
        icon: string;
      }
    ];
  }[];
}

/** Fake forecast object */
export const stubForecast: Forecast = {
  timezone_offset: 3600,
  daily: [
    {
      dt: NaN,
      temp: {
        day: NaN,
      },
      wind_speed: NaN,
      weather: [
        {
          main: '',
          description: '',
          icon: '',
        },
      ],
    },
  ],
};
