const time = document.querySelector('.time');
const dateshow = document.querySelector('.date');
const greeting = document.querySelector(".greeting");
const input = document.querySelector(".name");
const body = document.querySelector("body");
const slideNext = document.querySelector(".slide-next");
const slidePrev = document.querySelector(".slide-prev");
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
const weatherError = document.querySelector('.weather-error');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');
const playListContainer = document.querySelector('.play-list');
const playButton = document.querySelector('.play');
const playPrev = document.querySelector('.play-prev');
const playNext = document.querySelector('.play-next');
const songTittle = document.querySelector('.song-title');
const songDuration = document.querySelector('.song-duration');
const progressBar = document.querySelector('#progress-bar');
const currentTimePlayer = document.querySelector('.currentTime');
const durationTimePlayer = document.querySelector('.durationTime');
const song = document.querySelector('#song');
let randomNum = getRandomNum(1, 20);
let isPlay = false;
let playNum = 0;
//время
function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    showDate();
    getHours();
    showGreetings();
    getTimeOfDay();
    setTimeout(showTime, 1000);
};
showTime();
//дата
function showDate() {
    const date = new Date();
    const options = { month: 'long', day: 'numeric', weekday: 'long' };
    const currentDate = date.toLocaleDateString('ru-Ru', options);
    dateshow.textContent = currentDate;
};
showDate();
function getHours() {
    const date = new Date();
    const hours = date.getHours();
    return hours;
};
getHours();
//приветствие
function getTimeOfDay(word) {
    if (getHours() < 6) {
        word = "night";
    }
    else if (12 > getHours() >= 6) {
        word = "morning";
    }
    else if (getHours() < 18) {
        word = "afternoon";
    }
    else if (getHours() >= 18) {
        word = "evening";
    }
    return word;
};
getTimeOfDay();
function showGreetings() {
    const timeOfDay = getTimeOfDay();
    const greetingText = `Good ${timeOfDay}!`;
    greeting.textContent = greetingText;
};
showGreetings();
//сохранение имени в поле после перезагрузки страницы
function setLocalStorage() {
    localStorage.setItem('name', input.value);
}
window.addEventListener('beforeunload', setLocalStorage)
function getLocalStorage() {
    if (localStorage.getItem('name')) {
        input.value = localStorage.getItem('name');
    }
}
window.addEventListener('load', getLocalStorage)
//фоновые изображения
function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function setBg(timeOfDay, bgNum) {
    timeOfDay = getTimeOfDay();
    bgNum = randomNum.toString().padStart(2, '0');
    const imgLink = `url('https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg')`;
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    img.onload = () => {
        body.style.backgroundImage = imgLink;
    };
};
setBg();
function getSlideNext() {
    timeOfDay = getTimeOfDay();
    bgNum = randomNum.toString().padStart(2, '0');
    if (randomNum < 20) {
        randomNum = randomNum + 1;
        setBg(timeOfDay, bgNum);
    } else if (randomNum === 20) {
        randomNum = 1;
        setBg(timeOfDay, bgNum);
    }
};
function getSlidePrev() {
    timeOfDay = getTimeOfDay();
    bgNum = randomNum.toString().padStart(2, '0');
    if ((randomNum <= 20) && (randomNum > 1)) {
        randomNum = randomNum - 1;
        setBg(timeOfDay, bgNum);
    } else if (randomNum === 1) {
        randomNum = 20;
        setBg(timeOfDay, bgNum);
    }
};
slidePrev.addEventListener('click', getSlidePrev);
slideNext.addEventListener('click', getSlideNext);
//погода
async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=69fc5dfaf44bcac7f7a86b84f1823723&units=metric`;
    const res = await fetch(url);
    if (res.status === 200) {
        const data = await res.json();
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        wind.textContent = `Wind speed: ${data.wind.speed.toFixed(0)} m/s`;
        humidity.textContent = `Humidity: ${data.main.humidity.toFixed(0)} %`;
        weatherError.classList.add("none");
        weatherIcon.classList.remove("none");
        temperature.classList.remove("none");
        weatherDescription.classList.remove("none");
        wind.classList.remove("none");
        humidity.classList.remove("none");
    } else {
        weatherError.classList.remove("none");
        weatherError.textContent = `City ${(city.value)} not found!`;
        weatherIcon.classList.add("none");
        temperature.classList.add("none");
        weatherDescription.classList.add("none");
        wind.classList.add("none");
        humidity.classList.add("none");
    };
};
city.addEventListener('change', getWeather);
function setLocalStorageWeather() {
    localStorage.setItem('weather', city.value);
};
window.addEventListener('beforeunload', setLocalStorageWeather)
function getLocalStorageWeather() {
    if (localStorage.getItem('weather') === '') {
        city.value = 'Minsk';
        getWeather();
    } else if (localStorage.getItem('weather')) {
        city.value = localStorage.getItem('weather');
        getWeather();
    }
};
window.addEventListener('load', getLocalStorageWeather);
//цитаты
async function getQuotes() {
    const quotes = '../js/data.json';
    const res = await fetch(quotes);
    const data = await res.json();
    const random = Math.floor(Math.random() * data.length);
    quote.textContent = data[`${random}`].quote;
    author.textContent = data[`${random}`].author;
};
getQuotes();
changeQuote.addEventListener('click', getQuotes);
//аудио - плеер

const play = () => {
    song.src = playList[playNum].src;
    songTittle.innerHTML = playList[playNum].title;
    song.play();
    isPlay = true;
};
function playPause() {
    if (isPlay === false) {
        play();
        playButton.classList.toggle('pause');
    } else {
        playButton.classList.toggle('pause');
        song.pause();
        isPlay = false;
    }
};
playButton.addEventListener('click', playPause);
song.addEventListener('ended', playNextTrec);
function playPrevious() {
    let playListNumber = playList.length - 1;
    if (playNum >= 1 && playButton.classList.contains('pause')) {
        playNum = playNum - 1;
        play();
    } else if (playNum >= 1) {
        playNum = playNum - 1;
        play();
        playButton.classList.toggle('pause');
    } else if (playNum === 0 && playButton.classList.contains('pause')) {
        playNum = playListNumber;
        play();
    } else if (playNum === 0) {
        playNum = playListNumber;
        playButton.classList.toggle('pause');
        play();
    }
};
playPrev.addEventListener('click', playPrevious);
function playNextTrec() {
    let playListNumber = playList.length - 1;
    if (playNum >= 0 && playButton.classList.contains('pause') && playNum < playListNumber) {
        playNum = playNum + 1;
        play();
    } else if (playNum >= 0 && playNum < playListNumber) {
        playNum = playNum + 1;
        play();
        playButton.classList.toggle('pause');
    } else if (playNum === playListNumber && playButton.classList.contains('pause')) {
        playNum = 0;
        play();
    } else if (playNum === playListNumber) {
        playNum = 0;
        playButton.classList.toggle('pause');
        play();
    }
};
playNext.addEventListener('click', playNextTrec);


//плейлист
const playList = [
    {
        title: 'Aurora',
        src: '../assets/sounds/01. Yoga - Aurora.mp3',
        duration: '03:41'
    },
    {
        title: 'Visions',
        src: '../assets/sounds/02. Yoga - Visions Part 1.mp3',
        duration: '05:10'
    },
    {
        title: 'Stargazer',
        src: '../assets/sounds/03. Yoga - Stargazer.mp3',
        duration: '05:14'
    },
    {
        title: 'Heavenly Delight Part 1',
        src: '../assets/sounds/04. Yoga - Heavenly Delight Part 1.mp3',
        duration: '04:52'
    },
    {
        title: 'Andes Calling',
        src: '../assets/sounds/05. Yoga - Andes Calling.mp3',
        duration: '06:43'
    },
    {
        title: 'Sanctum Part 1',
        src: '../assets/sounds/06. Yoga - Sanctum Part 1.mp3',
        duration: '04:13'
    },
    {
        title: 'Rustling Speargrass',
        src: '../assets/sounds/07. Yoga - Rustling Speargrass.mp3',
        duration: '06:54'
    }
]
//список треков
playList.forEach(element => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = playList.title;
    playListContainer.append(li);
});


//прогресс бар
function formatTime(seconds) {
    let min = Math.floor((seconds / 60));
    let sec = Math.floor(seconds - (min * 60));
    if (sec < 10) {
        sec = `0${sec}`;
    };
    return `${min}:${sec}`;
};
function updateProgressValue() {
    progressBar.max = song.duration;
    progressBar.value = song.currentTime;
    currentTimePlayer.innerHTML = (formatTime(Math.floor(song.currentTime)));
    if (durationTimePlayer.innerHTML === "NaN:NaN") {
        durationTimePlayer.innerHTML = "0:00";
    } else {
        durationTimePlayer.innerHTML = (formatTime(Math.floor(song.duration)));
    }
};
function formatTime(seconds) {
    let min = Math.floor((seconds / 60));
    let sec = Math.floor(seconds - (min * 60));
    if (sec < 10) {
        sec = `0${sec}`;
    };
    return `${min}:${sec}`;
};
setInterval(updateProgressValue, 500);
function changeProgressBar() {
    song.currentTime = progressBar.value;
};