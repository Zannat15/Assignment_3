var apiKey = "62fd53ce7b97727e6c8e05120a7a32f7"; 

function searchCountry() {
    var query = document.getElementById("searchInput").value;
    if (!query) return alert("Please enter a country name.");

    fetch(`https://restcountries.com/v3.1/name/${query}`)
        .then(res => res.json())
        .then(data => {
            displayResults(data);
            document.getElementById("searchInput").value = ""; 
        })
        .catch(err => alert("Country not found."));
}

function displayResults(countries) {
    var container = document.getElementById("results");
    container.innerHTML = "";
    countries.forEach(country => {
        var capital = country.capital ? country.capital[0] : "N/A";
        var flagUrl = country.flags?.png || "";
        var population = country.population || "Unknown";
        var region = country.region || "Unknown";

        var card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h2>${country.name.common}</h2>
            <p>Region: ${region}</p>
            <p>Capital: ${capital}</p>
            <button class="details-btn" data-capital="${capital}" data-name="${country.name.common}" data-flag="${flagUrl}" data-population="${population}" data-region="${region}">More Details</button>
            <div class="details"></div>
        `;
        container.appendChild(card);

        card.querySelector(".details-btn").addEventListener("click", function() {
            showDetails(this);
        });
    });
}

function showDetails(button) {
    var { capital, name, flag, population, region } = button.dataset;
    var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`;

    fetch(weatherUrl)
        .then(res => res.json())
        .then(weatherData => {
            if (weatherData.cod !== 200) return alert("Weather data not found.");

            var detailsDiv = button.nextElementSibling;
            detailsDiv.style.display = "block";
            detailsDiv.innerHTML = `
                <img src="${flag}" alt="Flag of ${name}">
                <p><strong>Population:</strong> ${population}</p>
                <p><strong>Region:</strong> ${region}</p>
                <p><strong>Temperature:</strong> ${weatherData.main.temp} °C</p>
                <p><strong>Weather:</strong> ${weatherData.weather[0].description}</p>
            `;
            button.style.display = "none";
        })
        .catch(err => alert("Weather data not found."));
}
