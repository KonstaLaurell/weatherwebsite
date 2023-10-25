document.addEventListener("DOMContentLoaded", function() {
    const fetchForecastButton = document.getElementById('fetchForecast');
    fetchForecastButton.addEventListener('click', function() {
        const city = document.getElementById('city').value.trim();

        if (!city) {
            alert('Please enter a city name.');
            return;
        }

        const today = new Date();
        const urlBase = "https://opendata.fmi.fi/wfs";
        const params = {
            service: "WFS",
            version: "2.0.0",
            request: "getFeature",
            storedquery_id: "fmi::forecast::harmonie::surface::point::multipointcoverage",
            place: city,
            parameters: "temperature",
            timestep: "24"
        };

        const url = new URL(urlBase);
        for (const key in params) {
            url.searchParams.append(key, params[key]);
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data. Maybe the entered city is not supported?");
                }
                return response.text();
            })
            .then(data => {
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(data, "text/xml");

                // Clear previous forecast data
                const forecastContainer = document.getElementById("forecast");
                forecastContainer.innerHTML = "";

                // Extract temperature values
                let temperatureValues = xmlDoc.querySelector('doubleOrNilReasonTupleList').textContent.trim().split(/\s+/).map(temp => parseFloat(temp));

                if (!temperatureValues.length) {
                    throw new Error("No temperature data found for the entered city.");
                }

                // Assuming multiple readings per day, split the array for each day
                const readingsPerDay = temperatureValues.length / 10;  // Assuming 10 days of data

                for (let index = 0; index < 10; index++) {
                    let dayTemperatures = temperatureValues.slice(index * readingsPerDay, (index + 1) * readingsPerDay);
                    let maxTemp = Math.max(...dayTemperatures);
                    let minTemp = Math.min(...dayTemperatures);
                
                    let forecastDate = new Date(today);
                    forecastDate.setDate(today.getDate() + index);
                    let dateString = forecastDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                
                    let dayForecast = document.createElement('div');
                    dayForecast.innerHTML = `<strong>${dateString}</strong>: Highest: <strong>${maxTemp}°C</strong>, Lowest: <strong>${minTemp}°C</strong>`;
                    forecastContainer.appendChild(dayForecast);
                }
                
            })
            .catch(error => {
                const forecastContainer = document.getElementById("forecast");
                forecastContainer.innerHTML = error.message; // Displaying the error message to the user
                console.error("Error fetching or processing the data:", error);
            });
    });
});
