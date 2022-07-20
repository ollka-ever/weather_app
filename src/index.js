//showing current weekday & time
function showDate(date) {
  let currentTime = document.querySelector("#current-date");
  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let weekDay = daysOfWeek[date.getDay()];
  let hour = date.getHours();
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = "0" + minute;
  }

  currentTime.innerHTML = `${weekDay} ${hour}:${minute}`;
}

//add + sign for temperature if lost
function signChecker(temp) {
  if (temp > 0) {
    return `+${temp}`;
  } else {
    return temp;
  }
}

//switches boldness for degree
function addBold(text) {
  return `<strong>${text}</strong>`;
}
function removeBold(text) {
  text = text.replace("<strong>", "");
  text = text.replace("</strong>", "");
  return text;
}

//convert from fahrenheit to celcius
function convertToCelcius() {
  //convert only if it is not already in Celcius
  if (!shownCelcius) {
    let result = Math.round((temperatureToConvert.innerHTML - 32) * 0.5556);
    temperatureToConvert.innerHTML = signChecker(result);
    fahrenheitSign.innerHTML = removeBold(fahrenheitSign.innerHTML);
    celciusSign.innerHTML = addBold(celciusSign.innerHTML);

    //needed to mark that conversion is done
    shownCelcius = true;
  }
}

//convert from celcius to fahrenheit
function convertToFahrenheit() {
  //convert only if it is not already in Fahrenheit
  if (shownCelcius) {
    let result = Math.round(temperatureToConvert.innerHTML * 1.8 + 32);
    temperatureToConvert.innerHTML = signChecker(result);
    celciusSign.innerHTML = removeBold(celciusSign.innerHTML);
    fahrenheitSign.innerHTML = addBold(fahrenheitSign.innerHTML);

    //needed to mark that conversion is done
    shownCelcius = false;
  }
}

//changes weather icon according to weather description
function setIcon(weather) {
  weather = weather.toLowerCase();
  if (weather === "clouds" || weather === "smoke" || weather === "fog") {
    return "images/cloud.png";
  } else if (weather === "haze") {
    return "images/cloudy.png";
  } else if (
    weather === "dust" ||
    weather === "sand" ||
    weather === "ash" ||
    weather === "squall" ||
    weather === "tornado"
  ) {
    return "images/images/windy.png";
  } else if (weather === "drizzle" || weather === "rain") {
    return "images/rainy.png";
  } else if (weather === "thunderstorm") {
    return "images/storm.png";
  } else if (weather === "snow") {
    return "images/snowy.png";
  } else if (weather === "clear") {
    return "images/sun.png";
  }
}

//updates in h1 city and main temp for it
function updateWeather(response) {
  convertToCelcius();
  let cityHeader = document.querySelector("#city-header");
  let tempHeader = document.querySelector("#current-temperature");
  let descriptionHeader = document.querySelector("#weather-description");
  let windHeader = document.querySelector("#wind");
  let humidityHeader = document.querySelector("#humidity");
  let temp = Math.round(response.data.main.temp);
  let description = response.data.weather[0].description;
  description = description[0].toUpperCase() + description.substring(1);
  let wind = Math.round(response.data.wind.speed);
  cityHeader.innerHTML = response.data.name;
  tempHeader.innerHTML = signChecker(temp);
  descriptionHeader.innerHTML = description;
  windHeader.innerHTML = wind;
  humidityHeader.innerHTML = response.data.main.humidity;
  document.getElementById("main-icon").src = setIcon(
    response.data.weather[0].main
  );
}

//gets info about weather by API with city
function searchCity(event) {
  event.preventDefault();
  let inputValue = document.querySelector("#city-search");
  let cityName = inputValue.value;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=616b6d14eb70524f242eb75242106f0a&units=metric`;
  axios.get(url).then(updateWeather);
}

//gets info about weather by API with coordinates
function searchLocation(position) {
  console.log(position);
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  console.log(lat);
  console.log(long);
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=616b6d14eb70524f242eb75242106f0a&units=metric`;
  axios.get(url).then(updateWeather);
}

function invokeLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

//updating weekday & time
showDate(new Date());

//default degree system is Celcius
let shownCelcius = true;

//default Celcius sign is bold
let celciusSign = document.querySelector("#celcius-converter");
let fahrenheitSign = document.querySelector("#fahrenheit-converter");
celciusSign.innerHTML = addBold(celciusSign.innerHTML);

let temperatureToConvert = document.querySelector("#current-temperature");
let toCelcius = document.querySelector("#celcius-converter");
toCelcius.addEventListener("click", convertToCelcius);
let toFahrenheit = document.querySelector("#fahrenheit-converter");
toFahrenheit.addEventListener("click", convertToFahrenheit);

let searchButton = document.querySelector("#search-form");
searchButton.addEventListener("submit", searchCity);

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", invokeLocation);
