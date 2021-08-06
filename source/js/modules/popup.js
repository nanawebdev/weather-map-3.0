import { showHourlyWeather } from './main.js'

const popup = document.querySelector('.popup-hourly-weather')
const overlay = document.querySelector('.overlay')
const openPopupButton = document.querySelector('.js-open-current-weather')
const popupData = document.querySelector('.popup-hourly-weather__data')
const closePopupButton = document.querySelector('.js-close-popup')

function addDataInPopup(data) {
    popupData.innerHTML = ''
    const weatherData = showHourlyWeather(data)
    popupData.appendChild(weatherData)
}

function closePopup() {
    popup.style.display = 'none'
}

function openPopup() {
    popup.style.display = 'flex'
}

overlay.addEventListener('click', closePopup)
openPopupButton.addEventListener('click', openPopup)
closePopupButton.addEventListener('click', closePopup)

export { addDataInPopup }
