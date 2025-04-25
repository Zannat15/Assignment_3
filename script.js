var apiKey = "62fd53ce7b97727e6c8e05120a7a32f7"; // OpenWeatherMap API Key

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
        var population = country.population || "Unknown";
        var flagUrl = country.flags && country.flags.png ? country.flags.png : "";
        var region = country.region || "Unknown";

        var card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h2>${country.name.common}</h2>
            <p>Region: ${region}</p>
            <p>Capital: ${capital}</p>
            <button class="details-btn"
                data-capital="${capital}"
                data-name="${country.name.common}"
                data-flag="${flagUrl}"
                data-population="${population}"
                data-region="${region}">
                More Details
            </button>
            <div class="details"></div>
        `;

        container.appendChild(card);
    }

    var buttons = document.querySelectorAll(".details-btn");
    buttons.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var capital = btn.getAttribute("data-capital");
            var name = btn.getAttribute("data-name");
            var flag = btn.getAttribute("data-flag");
            var population = btn.getAttribute("data-population");
            var region = btn.getAttribute("data-region");
            showDetails(btn, capital, name, flag, population, region);
        });
    });
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
                <img src="${flagUrl}" alt="Flag of ${name}">
                <p><strong>Population:</strong> ${population}</p>
                <p><strong>Region:</strong> ${region}</p>
                <p><strong>Temperature:</strong> ${weatherData.main.temp} °C</p>
                <p><strong>Weather:</strong> ${weatherData.weather[0].description}</p>
            `;

            button.style.display = "none";
        })
        .catch(function(error) {
            alert("Weather data not found.");
            console.log(error);
        });
}


