document.addEventListener("DOMContentLoaded", function() {
    const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrb25zdGFsYXVyZWxsQGdtYWlsLmNvbSIsImp0aSI6IjAxNWU3ZTVmLWQxZjgtNGU1OC1iMDI2LWRkNjg3NGJhN2QxNSIsImlzcyI6IkFFTUVUIiwiaWF0IjoxNjk4MzM1Mjg3LCJ1c2VySWQiOiIwMTVlN2U1Zi1kMWY4LTRlNTgtYjAyNi1kZDY4NzRiYTdkMTUiLCJyb2xlIjoiIn0.Y38wM0NddHyehOEEwXPTh87JdwOjVGB7nQntfpD0B0k";
    const BASE_URL = "https://api.aemet.es";
    
    // Fetch the weather data
    function fetchWeatherData() {
        const url = `${BASE_URL}/path_to_endpoint`; // Replace with the correct endpoint

        fetch(url, {
            headers: {
                "api-key": API_KEY
            }
        })
        .then(response => response.json())
        .then(data => {
            const temperature = data.temperature; // Replace with the correct path to get temperature
            document.getElementById("temperature").textContent = temperature;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
    }

    fetchWeatherData();
});
