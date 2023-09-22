const timeEle = document.getElementById('time');
const dateEle = document.getElementById('date');
const currentWeatherItemsEle = document.getElementById('current-weather-items');
const timeZoneELe = document.getElementById('time-zone');
const countryEle = document.getElementById('country');
const FutureForcastELe = document.getElementById('weather-forecast');
const currentTempELe = document.getElementById('current-temp');

const day = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const month = ['January','February','March','April','May','June','July','August','September','October','November','December'];

setInterval(() => {
    const time = new Date();
    const monthIndex = time.getMonth();
    const date = time.getDate();
    const dayIndex = time.getDay();
    const hour = time.getHours();
    const hourIn12Format = hour>=13 ?hour%12 : hour ;
    const min = time.getMinutes();
    const seconds =time.getSeconds();
    const ampm = hour>=12 ? 'PM' : 'AM' ;
    timeEle.innerHTML=  (hourIn12Format < 10? '0'+hourIn12Format : hourIn12Format) + ':' +  (min < 10? '0'+min: min) + ':' + (seconds < 10? '0'+seconds: seconds) + '<span id="am-pm">' + ampm + '</span>';
    dateEle.innerHTML = day[dayIndex] + ',' + date +' ' + month[monthIndex];
}, 1000);

const API_KEY ='79d3a5dc22568dbd4588050d231968c5';
weatherData();

function weatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        const { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
        
        console.log(data)
        showWeatherData(data);
        })
    });
}

function showWeatherData(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
    timeZoneELe.innerHTML = data.timezone;
    countryEle.innerHTML = data.lat + 'N' + ' ' + data.lon + 'E'

    currentWeatherItemsEle.innerHTML =
        `<div class="weather-item">
            <div>Humidity</div>
            <div>${humidity}</div>
        </div>
        <div class="weather-item">
            <div>Pressure</div>
            <div>${pressure}</div>
        </div>
        <div class="weather-item">
            <div>Wind Speed</div>
            <div>${wind_speed}</div>
        </div>
        <div class="weather-item">
            <div>Sunrise</div>
            <div>${window.moment(sunrise*1000).format('HH :MM A')}</div>
        </div>
        <div class="weather-item">
            <div>Sunset</div>
            <div>${window.moment(sunset*1000).format('HH :MM A')}</div>
        </div>`;

        let otherDayForcast = ''
        data.daily.forEach((day,idx) => {

            if(idx == 0)
            {
                currentTempELe.innerHTML = `<img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
                <div class="other">
                    <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                    <div class="temp">Night - ${day.temp.night}&#176; C</div>
                    <div class="temp">Day - ${day.temp.day}&#176; C</div>
                </div>`   
            }
            else{
                otherDayForcast += `
                <div class="weather-forecast-item">
                    <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                    <div class="temp">Night - ${day.temp.night}&#176;C</div>
                    <div class="temp">Day - ${day.temp.day}&#176;C</div>
                </div>`
            }
            FutureForcastELe.innerHTML = otherDayForcast;
        });
}


