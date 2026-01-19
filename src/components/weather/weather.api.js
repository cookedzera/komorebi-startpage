class WeatherForecastClient {
  constructor(location) {
    this.appId = '50a34e070dd5c09a99554b57ab7ea7e2';
    this.url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(location)}&units=metric&appid=${this.appId}`;
  }

  async getWeather() {
    return await fetch(this.url)
      .then(res => res.json())
      .then(data => {
        const temperature = Math.round(data.main.temp);
        const condition = data.weather[0].main.toLowerCase();
        const timezone = data.timezone;

        return {
          temperature,
          condition,
          timezone
        };
      })
      .catch(err => console.warn('Weather API returned an error:', err));
  }
}
