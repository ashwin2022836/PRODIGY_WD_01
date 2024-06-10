document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('location-form');
    const weatherInfo = document.getElementById('weather-info');
    const resetButton = document.getElementById('reset-button');
    const localWeatherButton = document.getElementById('local-weather-button');
    const apiKey = '04321359531fbbd6e65d4bc75ac21465'; // Replace with your OpenWeatherMap API key

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const location = document.getElementById('location-input').value;
        fetchWeatherDataByLocation(location);
    });

    resetButton.addEventListener('click', () => {
        document.getElementById('location-input').value = '';
        weatherInfo.innerHTML = '';
    });

    localWeatherButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                    fetchWeatherDataByCoordinates(latitude, longitude);
                },
                error => {
                    console.error(`Error getting location: ${error.message}`);
                    weatherInfo.innerHTML = `<p>Error getting location: ${error.message}</p>`;
                }
            );
        } else {
            weatherInfo.innerHTML = `<p>Geolocation is not supported by this browser.</p>`;
        }
    });

    function fetchWeatherDataByLocation(location) {
        console.log(`Fetching weather data for location: ${location}`);
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&lang=en`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Weather data:', data);
                displayWeatherData(data);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherInfo.innerHTML = `<p>Error fetching weather data: ${error.message}</p>`;
            });
    }

    const latitude = 37.5682;
    const longitude = 126.9977;
    fetchWeatherDataByCoordinates(latitude, longitude);
    

    function fetchWeatherDataByCoordinates(lat, lon) {
        console.log(`Fetching weather data for coordinates: ${lat}, ${lon}`);
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=en`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Weather data:', data);
                displayWeatherData(data);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherInfo.innerHTML = `<p>Error fetching weather data: ${error.message}</p>`;
            });
    }

    function displayWeatherData(data) {
        if (data.cod === 200) {
            const { name, weather, main, wind } = data;
            const description = translateDescription(weather[0].description); // Translate description
            const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
            weatherInfo.innerHTML = `
                <h2>${name}</h2>
                <img src="${iconUrl}" alt="${description}">
                <p>${description}</p>
                <p>Temperature: ${main.temp}&deg;C</p>
                <p>Humidity: ${main.humidity}%</p>
                <p>Pressure: ${main.pressure} hPa</p>
                <p>Wind Speed: ${wind.speed} m/s</p>
            `;
        } else {
            weatherInfo.innerHTML = `<p>${data.message}</p>`;
        }
    }
    
    // Function to translate weather description to English or use original description if not found
    function translateDescription(description) {
        switch (description) {
            case 'ясно': return 'Clear';
            case 'небольшая облачность': return 'Partly Cloudy';
            case 'облачно с прояснениями': return 'Mostly Clear';
            // Add more translations for other descriptions as needed
            default: return description; // Return original description if not translated
        }
    }
});    