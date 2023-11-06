const translations = {
    en: {
        title: "10-Day Temperature Forecast for Scandinavian Cities",
        cityLabel: "Enter a city:",
        cityPlaceholder: "Type city name here",
        btnText: "Get Forecast"
    },
    es: {
        title: "Previsión de Temperatura para 10 Días para Ciudades Escandinavas",
        cityLabel: "Introduce una ciudad:",
        cityPlaceholder: "Escribe el nombre de una ciudad aquí",
        btnText: "Obtener Previsión"
    },
    fi: {
        title: "10 Päivän Lämpötilaennuste Skandinavian Kaupungeille",
        cityLabel: "Syötä kaupunki:",
        cityPlaceholder: "Kirjoita kaupungin nimi tähän",
        btnText: "Hae Ennuste"
    },
    zh: {
        title: "斯堪的纳维亚城市10天温度预报",
        cityLabel: "输入城市：",
        cityPlaceholder: "在此输入城市名称",
        btnText: "获取预报"
    },
    sv: {
        title: "10-Dagars Temperaturprognos för Skandinaviska Städer",
        cityLabel: "Ange en stad:",
        cityPlaceholder: "Skriv stadens namn här",
        btnText: "Hämta Prognos"
    },
    no: {
        title: "10-Dagers Temperaturprognose for Skandinaviske Byer",
        cityLabel: "Angi en by:",
        cityPlaceholder: "Skriv bynavn her",
        btnText: "Hent Prognose"
    },
    da: {
        title: "10-Dages Temperaturprognose for Skandinaviske Byer",
        cityLabel: "Indtast en by:",
        cityPlaceholder: "Skriv bynavn her",
        btnText: "Hent Prognose"
    }
};

document.getElementById("langSelector").addEventListener("change", function() {
    const selectedLang = this.value;

    document.querySelector("h1").textContent = translations[selectedLang].title;
    document.querySelector("label[for='city']").textContent = translations[selectedLang].cityLabel;
    document.getElementById("city").setAttribute("placeholder", translations[selectedLang].cityPlaceholder);
    document.getElementById("fetchForecast").textContent = translations[selectedLang].btnText;
});
document.addEventListener("DOMContentLoaded", function() {
    const fetchForecastButton = document.getElementById('fetchForecast');
    const forecastContainer = document.getElementById("forecast");
    const langSelector = document.getElementById("langSelector");

    const translations = {
        en: {
            alertCity: "Please enter a city name.",
            errorFetch: "Failed to fetch data. Maybe the entered city is not supported?",
            errorNoData: "No temperature data found for the entered city.",
            highest: "Highest",
            lowest: "Lowest"
        },
        es: {
            alertCity: "Por favor, introduce el nombre de una ciudad.",
            errorFetch: "Error al obtener los datos. ¿Quizás la ciudad introducida no es soportada?",
            errorNoData: "No se encontraron datos de temperatura para la ciudad introducida.",
            highest: "Máxima",
            lowest: "Mínima"
        },
        fi: {
            alertCity: "Ole hyvä ja syötä kaupungin nimi.",
            errorFetch: "Tietojen haku epäonnistui. Kenties valittua kaupunkia ei tueta?",
            errorNoData: "Lämpötilatietoja ei löytynyt valitulle kaupungille.",
            highest: "Korkein",
            lowest: "Alhaisin"
        },
        zh: {
            alertCity: "请输入城市名称。",
            errorFetch: "获取数据失败。也许输入的城市不受支持？",
            errorNoData: "未找到为所输入城市的温度数据。",
            highest: "最高",
            lowest: "最低"
        },
        sv: {
            alertCity: "Ange en stad.",
            errorFetch: "Det gick inte att hämta data. Kanske stöds inte den angivna staden?",
            errorNoData: "Inga temperaturdata hittades för den angivna staden.",
            highest: "Högst",
            lowest: "Lägst"
        },
        no: {
            alertCity: "Vennligst skriv inn en by.",
            errorFetch: "Kunne ikke hente data. Kanskje den angitte byen ikke støttes?",
            errorNoData: "Ingen temperaturdata funnet for den angitte byen.",
            highest: "Høyest",
            lowest: "Lavest"
        },
        da: {
            alertCity: "Indtast venligst en by.",
            errorFetch: "Kunne ikke hente data. Måske understøttes den angivne by ikke?",
            errorNoData: "Ingen temperaturdata fundet for den angivne by.",
            highest: "Højeste",
            lowest: "Laveste"
        }
    };

    const getTranslation = (key) => {
        const selectedLang = langSelector.value;
        return translations[selectedLang][key];
    };

    fetchForecastButton.addEventListener('click', function() {
        forecastContainer.classList.remove('opened');
        forecastContainer.innerHTML = "";

        const city = document.getElementById('city').value.trim();

        if (!city) {
            alert(getTranslation("alertCity"));
            return;
        }

        const today = new Date();
        const urlBase = "https://opendata.fmi.fi/wfs";
        const params = {
            service: "WFS",
            version: "2.0.0",
            request: "getFeature",
            storedquery_id: "fmi::forecast::harmonie::surface::point::multipointcoverage",
            place: city.toLowerCase(),
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
                    throw new Error(getTranslation("errorFetch"));
                }
                return response.text();
            })
            .then(data => {
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(data, "text/xml");

                let temperatureValues = xmlDoc.querySelector('doubleOrNilReasonTupleList').textContent.trim().split(/\s+/).map(temp => parseFloat(temp));

                if (!temperatureValues.length) {
                    throw new Error(getTranslation("errorNoData"));
                }

                const readingsPerDay = temperatureValues.length / 10;  

                for (let index = 0; index < 10; index++) {
                    let dayTemperatures = temperatureValues.slice(index * readingsPerDay, (index + 1) * readingsPerDay);
                    let maxTemp = Math.max(...dayTemperatures);
                    let minTemp = Math.min(...dayTemperatures);
                
                    let forecastDate = new Date(today);
                    forecastDate.setDate(today.getDate() + index);
                    let dateString = forecastDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                
                    let dayForecast = document.createElement('div');
                    dayForecast.innerHTML = `<strong>${dateString}</strong>: ${getTranslation("highest")}: <strong>${maxTemp}°C</strong>, ${getTranslation("lowest")}: <strong>${minTemp}°C</strong>`;
                    forecastContainer.appendChild(dayForecast);
                }

                forecastContainer.classList.add('opened');
                
            })
            .catch(error => {
                forecastContainer.innerHTML = error.message;
                console.error("Error fetching or processing the data:", error);
            });
    });
});
