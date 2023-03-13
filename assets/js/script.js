const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const historyContainer = document.querySelector('.history-container')
let searchHistory = []

searchForm.addEventListener('submit',searchFormHandler)
historyContainer.addEventListener('click',historyButtonHandler);

init()

async function init(){
    getSearchHistory();
    if(!searchHistory[0]){
        await fetchAndRenderCityWeather('New York City');
        return;
    }
    fetchAndRenderCityWeather(searchHistory[0]);
}

async function searchFormHandler(event){
    //prevent the default event
    event.preventDefault();
    // alert('here');
    //get data from the search input
    const cityName = searchInput.value;
    // console.log(cityName);
    //if input is empty, tell user that input is needed
    if(!cityName){
        //make the outline of the form red and add small text
        alert('You must enter a city name')
        return;
    }
    
    //hide outline of input and hide text

    //send fetch request
    await fetchAndRenderCityWeather(cityName);
    // console.log(response);
    //return error if fetch request does not work
    

}

function saveSearchHistory(data){
    getSearchHistory();
    const found = searchHistory.find(cityName => cityName.toLowerCase() === data.toLowerCase())
    // console.log(found);
    if(found){
        return;
    }

    if(searchHistory.length === 5){
        searchHistory.pop();
    }

    searchHistory.unshift(data);
    localStorage.setItem('searchHistory',JSON.stringify(searchHistory));
}

function getSearchHistory(){
    //gets search history item from data
    searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    //checks if searchHistory exists, if not make it exist
    if(!searchHistory){
        localStorage.setItem('searchHistory','[]')
        searchHistory = []
    }
}

function renderSearchHistory(){
    getSearchHistory();
    historyContainer.innerHTML = ``;
    let markUp = ``;
    searchHistory.map(cityName => markUp += `<button class="btn h-10 my-2 mx-2 rounded-md block opacity-75 hover:opacity-100 shadow-md shadow-gray-500 bg-secondary text-primary">${cityName}</button>`);
    historyContainer.innerHTML = markUp;
}




async function historyButtonHandler(event){
    event.preventDefault();
    // console.log(event.target);
    //get city name from the event target
    const cityName = event.target.textContent;
    console.log(cityName);
    await fetchAndRenderCityWeather(cityName);
}

async function fetchAndRenderCityWeather(cityName){
    const response =  {
        current: await (await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=1172f50f33af35d90f024835c8e64a34`)).json(),
        forcast: await (await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=1172f50f33af35d90f024835c8e64a34`)).json()
    } 
    if(response.current.cod !== 200){
        alert(response.current.message);
        return;
    }
    saveSearchHistory(cityName);
    renderSearchHistory();
    renderWeather(response);
}

function renderWeather(response){
    // console.log(response);
    const currentWeather = response.current;
    const weatherForcast = []
    // console.log(currentDate);
    const hourBlockData = response.forcast.list
    // console.log(hourBlockData);
    for(let i in hourBlockData){
        const timeData = hourBlockData[i].dt_txt
        // console.log(timeData);
        const predictionTime = new Date(timeData)
        if(predictionTime.getHours() <= 13 && predictionTime.getHours() >= 11){
            weatherForcast.push(hourBlockData[i]);
        }
    }
    // console.log({currentWeather,weatherForcast});
    const currentDate = new Date;
    document.querySelector('.current-weather').innerHTML = `<h3 class="text-2xl font-bold text-color_5 my-2">${currentWeather.name} (${currentDate.toLocaleDateString()})</h3>
    <p class="text-lg text-color_4">Temp: ${currentWeather.main.temp}\u00B0F</p>
    <p class="text-lg text-color_4">Wind: ${currentWeather.wind.speed} MPH</p>
    <p class="text-lg text-color_4">Humidity: ${currentWeather.main.humidity} %</p>`;

    let markUp = ``
    for(let i in weatherForcast){
        const date = new Date(weatherForcast[i].dt_txt);
        markUp += `<card class="card my-2 mr-2 bg-color_5 bg-opacity-50">
        <h3 class="text-2xl font-bold text-color_5 my-2 ">${date.toLocaleDateString()}</h3>
        <p class="text-lg text-color_4">Temp: ${weatherForcast[i].main.temp}\u00B0F</p>
        <p class="text-lg text-color_4">Wind ${weatherForcast[i].wind.speed} MPH</p>
        <p class="text-lg text-color_4">Humidity: ${weatherForcast[i].main.humidity} %</p>
        </card>`
    }

    document.querySelector('.forcast').innerHTML = markUp;
}