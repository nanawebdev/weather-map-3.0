import { addDataInPopup } from './popup.js'

const weatherInfo = document.querySelector('.weather-info')
const currentTimeWeatherTemp = document.querySelector('.current-time-weather__temp span')
const currentTimeWeatherWind = document.querySelector('.current-time-weather__wind span')
const currentTimeWeatherHumidinity = document.querySelector('.current-time-weather__humidity span')
const currentTimeWeatherFeelsLike = document.querySelector('.current-time-weather__feels-like span')
const weekWeatherList = document.querySelector('.week-weather-list')
const currentDate = document.querySelector('.current-time-weather__date')

const currentLatLng = {
    lat: 55.7522,
    lng: 37.6156,
}

const API_KEY = '5c0dd7e9430af5befd25507b528a6e51'

const map = L.map('map').setView(currentLatLng, 13)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);


const mapPin = L.marker({
    lat: currentLatLng.lat,
    lng: currentLatLng.lng,
},
    {
        draggable: true,
    })

mapPin.addTo(map)

fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${currentLatLng.lat}&lon=${currentLatLng.lng}&exclude={part}&units=metric&appid=${API_KEY}`)
    .then((response) => {
        if (response.ok) {
            return response.json()
        } else {
            throw response
        }
    })
    .then((data) => {
        showCurrentWeather(data)
        showWeeklyWeather(data)
        showHourlyWeather(data)
        addDataInCurrentWeather(data)
        addDataInPopup(data)
    })

mapPin.on('moveend', (evt) => {
    const latlng = evt.target.getLatLng()
    const userLat = latlng.lat
    const userLng = latlng.lng

    currentLatLng.lat = userLat
    currentLatLng.lng = userLng

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${currentLatLng.lat}&lon=${currentLatLng.lng}&exclude={part}&units=metric&appid=${API_KEY}`)
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                throw response
            }
        })
        .then((data) => {
            showCurrentWeather(data)
            showWeeklyWeather(data)
            showHourlyWeather(data)
            addDataInCurrentWeather(data)
            addDataInPopup(data)
        })
})

const showCurrentWeather = (data) => {
    const temp = data.current.feels_like
    currentTimeWeatherTemp.textContent = `${temp.toFixed()}`
    const wind = data.current.wind_speed
    currentTimeWeatherWind.textContent = wind
    const humidinity = data.current.humidity
    currentTimeWeatherHumidinity.textContent = humidinity
    const feelsLike = data.current.feels_like
    currentTimeWeatherFeelsLike.textContent = `${feelsLike.toFixed()}`
    const date = new Date(data.current.dt * 1000)
    const toDateString = date.toLocaleDateString()
    currentDate.textContent = toDateString
}

const showHourlyWeather = (data) => {
    const hourlyArray = data.hourly
    console.log(hourlyArray)
    const currentWeatherList = document.createElement('ul')
    currentWeatherList.classList.add('hourly-weather-list')

    // дата из Daily 
    const date = new Date(data.daily[0].dt * 1000)
    const today = date.toLocaleDateString()

    for (let index = 0; index < hourlyArray.length; index++) {
        // дата из Hourly
        const element = hourlyArray[index]
        const sameDate = new Date(element.dt * 1000)
        const sameToday = sameDate.toLocaleDateString()

        // Сравниваем дату из Daily с датой из Hourly, чтобы показать почасовой прогноз для конкретно этого дня 
        if (today === sameToday) {
            const currentWeatherItem = document.createElement('li')
            const hourlyTemp = document.createElement('span')
            const hour = document.createElement('span')
            const temp = element.temp
            const hourData = new Date(element.dt * 1000)

            hour.classList.add('hourly-weather-list__hours')
            hourlyTemp.classList.add('hourly-weather-list__hourly-temp')

            hourlyTemp.textContent = `${temp.toFixed()}°C`
            hour.textContent = `${hourData.toLocaleTimeString()}`

            currentWeatherItem.appendChild(hour)
            currentWeatherItem.appendChild(hourlyTemp)
            currentWeatherList.appendChild(currentWeatherItem)
        }
    }
    
    return currentWeatherList
}

function addDataInCurrentWeather(data) {
    const currentTimeWeatherList = document.querySelector('.current-time-weather__hourly')
    const weatherData = showHourlyWeather(data)
    currentTimeWeatherList.appendChild(weatherData)
}

const showWeeklyWeather = (data) => {
    const daylyArray = data.daily
    weekWeatherList.innerHTML = ''

    daylyArray.forEach(day => {
        const dayEl = document.createElement('li')
        const dayDateWrapper = document.createElement('div')
        const dayTempWrapper = document.createElement('div')
        const dayTempDay = document.createElement('span')
        const dayTempNight = document.createElement('span')
        const dayTemp = day.temp.day
        const nightTemp = day.temp.night
        const dayDate = new Date(day.dt * 1000)
        const toDateString = dayDate.toLocaleDateString()

        dayTempDay.textContent = `${dayTemp.toFixed()}°C днем `
        dayTempNight.textContent = `${nightTemp.toFixed()}°C ночью `
        dayDateWrapper.textContent = toDateString

        dayEl.classList.add('week-weather-list__item')
        dayDateWrapper.classList.add('week-weather-list__date')
        dayTempWrapper.classList.add('week-weather-list__temp')

        dayTempWrapper.appendChild(dayTempDay)
        dayTempWrapper.appendChild(dayTempNight)
        dayEl.appendChild(dayDateWrapper)
        dayEl.appendChild(dayTempWrapper)
        weekWeatherList.appendChild(dayEl)
    })
}

if (navigator.geolocation) {
    window.onload = function () {
        var geoSuccess = function (position) {
            mapPin.setLatLng(L.latLng(position.coords.latitude, position.coords.longitude))
            map.setView(L.latLng(position.coords.latitude, position.coords.longitude), 13)
        };
        navigator.geolocation.getCurrentPosition(geoSuccess);
    }
}
else {
    console.log('Geolocation is not supported for this Browser/OS version yet.');
}


export { showHourlyWeather }