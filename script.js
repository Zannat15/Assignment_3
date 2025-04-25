function searchCountry() {
    var countryName = document.getElementById("searchInput").value.trim();
  
    if (countryName === "") {
      alert("Please enter a country name.");
      return;
    }
  
    var url = `https://restcountries.com/v3.1/name/${countryName}`;
  
    fetch(url)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        showCountryData(data);
      })
      .catch(function (error) {
        console.error("Error fetching country data:", error);
        alert("Country not found. Try another name.");
      });
  }
  
  function showCountryData(data) {
    var results = document.getElementById("results");
    results.innerHTML = "";
  
    for (var i = 0; i < data.length; i++) {
      var country = data[i];
      var name = country.name.common;
      var capital = country.capital ? country.capital[0] : "N/A";
      var population = country.population.toLocaleString();
      var flag = country.flags.svg;
      var lat = country.latlng[0];
      var lon = country.latlng[1];
  
      var card = document.createElement("div");
      card.classList.add("card");
  
      card.innerHTML = `
        <h2>${name}</h2>
        <img src="${flag}" alt="Flag of ${name}" class="flag">
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Population:</strong> ${population}</p>
        <button class="more-btn" onclick="getWeather(${lat}, ${lon}, '${name}', this)">More Details</button>
      `;
  
      results.appendChild(card);
    }
  }
  
  function getWeather(lat, lon, countryName, button) {
    var apiKey = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your actual API key
    var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
    fetch(url)
      .then(function (res) {
        return res.json();
      })
      .then(function (weatherData) {
        var temp = weatherData.main.temp;
        var desc = weatherData.weather[0].description;
        var icon = weatherData.weather[0].icon;
  
        var card = button.parentElement;
        var weatherInfo = document.createElement("div");
        weatherInfo.innerHTML = `
          <p><strong>Weather:</strong> ${desc}, ${temp}&deg;C</p>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" class="weather-icon" alt="Weather icon">
        `;
  
        button.style.display = "none"; // Hide button after showing
        card.appendChild(weatherInfo);
      })
      .catch(function (error) {
        console.error("Error fetching weather data:", error);
        alert("Weather info could not be loaded.");
      });
  }
  