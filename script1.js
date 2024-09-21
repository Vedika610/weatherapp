document.addEventListener("DOMContentLoaded", function () {
    const citySearchInput = document.getElementById('city-search');
    const searchButton = document.getElementById('city-search-button');
    const apiKey = 'cf4fdf773a81a21abbd1e78fdb22e788'; // Replace with your OpenWeatherMap API key

    searchButton.addEventListener('click', function () {
        const city = citySearchInput.value;
        fetchWeatherData(city);
    });

    // Function to fetch weather data from the OpenWeatherMap API
    function fetchWeatherData(city) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log("Weather data received:", data); // Log the entire response data

                // Update current weather
                updateCurrentWeather(data);

                // Update forecast
                updateWeatherForecast(data.list); // Pass only the forecast data to the function
            })
            .catch(error => {
                console.error('Error fetching or parsing weather data:', error);
            });
    }

    // Function to update current weather on the webpage
    function updateCurrentWeather(data) {
        const location = document.getElementById('location');
        const temperature = document.getElementById('temperature');
        const condition = document.getElementById('condition');
        const humidity = document.getElementById('humidity');
        const maxTemp = document.getElementById('max-temp');
        const minTemp = document.getElementById('min-temp');
        const sunrise = document.getElementById('sunrise');
        const sunset = document.getElementById('sunset');
        const windDegrees = document.getElementById('wind-degrees');
        const windSpeed = document.getElementById('wind-speed');
        const cloudPct = document.getElementById('cloud-pct');

        const weatherCondition = data.list[0].weather[0].description; // Define weather condition

        // Update DOM elements with current weather data
        location.innerHTML = `<i class="fas fa-map-marker-alt"></i> Location: ${data.city.name}, ${data.city.country}`;
        temperature.innerHTML = `<i class="fas fa-thermometer-half"></i> Temperature: ${data.list[0].main.temp}°C`;
        condition.innerHTML = `<i class="fas fa-sun"></i> Feels Like: ${data.list[0].main.feels_like}°C`;
        humidity.innerHTML = `<i class="fas fa-tint"></i> Humidity: ${data.list[0].main.humidity}%`;
        maxTemp.innerHTML = `<i class="fas fa-thermometer-full"></i> Max Temp: ${data.list[0].main.temp_max}°C`;
        minTemp.innerHTML = `<i class="fas fa-thermometer-empty"></i> Min Temp: ${data.list[0].main.temp_min}°C`;
        sunrise.innerHTML = `<i class="fas fa-sun"></i> Sunrise: ${new Date(data.city.sunrise * 1000).toLocaleTimeString()}`;
        sunset.innerHTML = `<i class="fas fa-moon"></i> Sunset: ${new Date(data.city.sunset * 1000).toLocaleTimeString()}`;
        windDegrees.innerHTML = `<i class="fas fa-compass"></i> Wind Degrees: ${data.list[0].wind.deg}°`;
        windSpeed.innerHTML = `<i class="fas fa-wind"></i> Wind Speed: ${data.list[0].wind.speed} m/s`;
        cloudPct.innerHTML = `<i class="fas fa-cloud"></i> Cloud Percentage: ${data.list[0].clouds.all}%`;

        // Update the background image based on the weather condition
        document.body.style.backgroundImage = getBackgroundImage(weatherCondition);
    }

    // Function to update the 7-day forecast on the webpage
    function updateWeatherForecast(forecastData) {
        const forecastContainer = document.getElementById('forecast-container');
        forecastContainer.innerHTML = ''; // Clear previous forecast data

        const displayedDates = new Set(); // Set to track displayed dates

        // Iterate through the forecast data
        forecastData.forEach(forecastEntry => {
            const date = new Date(forecastEntry.dt * 1000).toLocaleDateString();

            // Check if date is already displayed
            if (!displayedDates.has(date)) {
                displayedDates.add(date); // Add date to the set

                const forecastDay = document.createElement('div');
                forecastDay.classList.add('forecast-day');
                forecastDay.innerHTML = `
                    <div>${date}</div>
                    <div>Temperature: ${forecastEntry.main.temp}°C</div>
                    <div>Condition: ${forecastEntry.weather[0].description}</div>
                `;
                forecastContainer.appendChild(forecastDay);
            }
        });
    }

    // Function to determine the background image based on weather condition
    function getBackgroundImage(condition) {
        switch (condition) {
            case 'clear sky':
                return 'url(clearsky.jpg)';
            case 'broken clouds':
            case 'scattered clouds':
                return 'url(broken clouds.jpg)';
            case 'overcast clouds':
            
                return 'url(overcastclouds.jpg)';
            case 'shower rain':
            case 'rain':
                return 'url(rainy.jpg)';
            case 'thunderstorm':
                return 'url(thunderstrom.jpg)';
            case 'snow':
                return 'url(snowy.jpg)';
            case 'mist':
                return 'url(mist.jpg)';
        }
    }
});
