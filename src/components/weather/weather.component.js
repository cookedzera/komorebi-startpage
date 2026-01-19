class Weather extends Component {
  refs = {
    temperature: '.weather-temperature-value',
    condition: '.weather-condition-icon',
    scale: '.weather-temperature-scale'
  };

  forecasts = [
    {
      conditions: ['clouds', 'mist', 'haze', 'smoke'],
      icon: 'cloud_queue',
      color: 'cloudy'
    },
    {
      conditions: ['drizzle', 'snow', 'rain'],
      icon: 'opacity',
      color: 'cloudy'
    },
    {
      conditions: ['clear'],
      icon: 'wb_sunny',
      color: 'sunny'
    },
    {
      conditions: ['thunderstorm'],
      icon: 'bolt',
      color: 'cloudy'
    }
  ];

  location;

  constructor() {
    super();

    this.setDependencies();
    this.setEvents();
  }

  setEvents() {
  }

  setDependencies() {
    const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    this.location = userSettings.weatherCity || CONFIG.temperature.location;
    this.temperatureScale = CONFIG.temperature.scale;
    this.weatherForecast = new WeatherForecastClient(this.location);

    if (!localStorage.getItem('weatherTimezone')) {
      localStorage.setItem('weatherTimezone', '32400');
    }
  }

  imports() {
    return [
      this.resources.icons.material,
      this.resources.fonts.roboto
    ];
  }

  style() {
    return `
      :host {
          display: flex;
          align-items: center;
          padding: 6px 10px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          pointer-events: none;
          user-select: none;
      }


      .weather-icon {
          margin-right: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.8;
      }

      .weather-temperature {
          font-family: var(--font-primary);
          color: var(--color-text-primary);
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          opacity: 0.9;
      }


      .weather-temperature-location {
          display: none;
      }

      .weather-temperature-value {
          font-weight: 600;
      }

      .weather-condition-icon {
          font-size: 16px;
          line-height: 1;
      }

      .weather-condition-icon.sunny { color: #eebb77; }
      .weather-condition-icon.cloudy { color: #8899cc; }
    `;
  }

  async template() {
    return `
        <p class="+ weather-temperature">
            <span class="weather-icon" class="+"><i class="material-icons weather-condition-icon sunny">wb_sunny</i></span>
            <span class="weather-temperature-location">${this.location}</span>
            <span class="weather-temperature-value">1</span>
            º<span class="weather-temperature-scale">${this.temperatureScale}</span>
        </p>`;
  }

  toC(f) { return Math.round((f - 32) * 5 / 9); }

  toF(c) { return Math.round(c * 9 / 5 + 32); }

  swapScale() {
    this.temperatureScale = this.temperatureScale === 'C' ? 'F' : 'C';

    CONFIG.temperature = {
      ...CONFIG.temperature,
      scale: this.temperatureScale
    };

    this.setTemperature();
  }

  convertScale(temperature) {
    if (this.temperatureScale === 'F')
      return this.toF(temperature);

    return temperature;
  }

  async setWeather() {
    this.weather = await this.weatherForecast.getWeather();

    if (!this.weather) return;

    this.setTemperature();

    if (this.weather.timezone !== undefined) {
      localStorage.setItem('weatherTimezone', this.weather.timezone);
      document.dispatchEvent(new CustomEvent('timezoneUpdate', {
        detail: { timezone: this.weather.timezone }
      }));
    }
  }

  setTemperature() {
    const { temperature, condition } = this.weather;
    const { icon, color } = this.getForecast(condition);

    this.refs.temperature.textContent = this.convertScale(temperature);
    this.refs.condition.textContent = icon;
    this.refs.scale.textContent = this.temperatureScale;
    this.refs.condition.classList.add(color);
  }

  getForecast(condition) {
    for (const forecast of this.forecasts)
      if (forecast.conditions.includes(condition))
        return forecast;

    return this.forecasts[0];
  }

  async connectedCallback() {
    await this.render();
    await this.setWeather();
  }
}
