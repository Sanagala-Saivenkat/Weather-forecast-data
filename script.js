const apiKey = "6db8f582c81286569868538b363b4f44";

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please enter a city name.");

  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const currentRes = await fetch(currentUrl);
    const currentData = await currentRes.json();

    if (currentData.cod != 200) {
      alert(`Error: ${currentData.message}`);
      return;
    }

    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    if (forecastData.cod !== "200") {
      alert(`Forecast error: ${forecastData.message}`);
      return;
    }

    displayCurrentWeather(currentData);
    displayForecast(forecastData);
  } catch (error) {
    alert("Network error or invalid city name.");
    console.error(error);
  }
}

function displayCurrentWeather(data) {
  const html = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>🌡️ Temp: ${data.main.temp}°C</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>💨 Wind: ${data.wind.speed} m/s</p>
    <p>⛅ ${data.weather[0].description}</p>
  `;
  document.getElementById("currentWeather").innerHTML = html;
}

function displayForecast(data) {
  const container = document.getElementById("forecast");
  container.innerHTML = "<h3>5-Day Forecast</h3>";
  const forecast = {};

  data.list.forEach(entry => {
    const date = entry.dt_txt.split(" ")[0];
    if (!forecast[date] && Object.keys(forecast).length < 5) {
      forecast[date] = entry;
    }
  });

  for (const date in forecast) {
    const weather = forecast[date];
    const html = `
      <div class="forecast-day">
        <h4>${date}</h4>
        <p>🌡️ ${weather.main.temp}°C</p>
        <p>${weather.weather[0].main}</p>
      </div>
    `;
    container.innerHTML += html;
  }
}
