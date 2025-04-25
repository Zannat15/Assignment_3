var apiKey = "511beda0ae7adc734f73b869ba8b10b4"; // Your actual OpenWeatherMap API key

function searchCountry() {
    var query = document.getElementById("searchInput").value;
    if (!query) {
        alert("Please enter a country name.");
        return;
    }

    var url = "https://restcountries.com/v3.1/name/" + query;
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            displayResults(data);
        })
        .catch(function(error) {
            alert("Country not found.");
            console.log(error);
        });
}

function displayResults(countries) {
    var container = document.getElementById("results");
    container.innerHTML = "";

    for (var i = 0; i < countries.length; i++) {
        var country = countries[i];
        var capital = country.capital ? country.capital[0] : "N/A";

        var card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h2>${country.name.common}</h2>
            <p>Region: ${country.region}</p>
            <p>Capital: ${capital}</p>
            <button onclick="showDetails(this, '${capital}', '${country.name.common}', '${country.flags.png}', '${country.population}', '${country.region}')">More Details</button>
            <div class="details" style="display: none;"></div>
        `;

        container.appendChild(card);
    }
}

function showDetails(button, capital, name, flagUrl, population, region) {
    var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + capital + "&appid=" + apiKey + "&units=metric";

    fetch(weatherUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(weatherData) {
            if (weatherData.cod !== 200) {
                alert("Weather data not found for capital: " + capital);
                return;
            }

            var detailsDiv = button.nextElementSibling;
            detailsDiv.style.display = "block";

            detailsDiv.innerHTML = `
                <img src="${flagUrl}" alt="Flag of ${name}" style="width: 100px;">
                <p><strong>Population:</strong> ${population}</p>
                <p><strong>Region:</strong> ${region}</p>
                <p><strong>Temperature:</strong> ${weatherData.main.temp} °C</p>
                <p><strong>Weather:</strong> ${weatherData.weather[0].description}</p>
            `;

            button.style.display = "none"; // Hide button after showing details
        })
        .catch(function(error) {
            alert("Weather data not found.");
            console.log(error);
        });
}
