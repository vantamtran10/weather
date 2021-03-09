let APIKEY = 'a8225d40f6d377043532a1f1ab3e5ae8';
window.onload = async () => {
    let preLoad = document.getElementById("pre_load");
    let zipcode = '17602';
    let location = await getLongitudeLatitude(zipcode);
    await mainWeather(location);
    preLoad.hidden = true;

    let myZipcode = document.getElementById("myZipcode");
    let btnUpdate = document.getElementById("btn-update");
    btnUpdate.addEventListener("click", e = async () =>{
        preLoad.hidden = false;
        let inputValue = myZipcode.value;
        let userZipcode = await getLongitudeLatitude(inputValue);
        await mainWeather(userZipcode);
        M.toast({html: 'Update successful!', classes: 'rounded teal lighten-2 white-text'});
        preLoad.hidden = true;
        });

    myZipcode.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            btnUpdate.click();
        }
    });

}

const renderLocation = (data) => {
    let header = document.getElementById("main_location");
    let html = "";
    html += '<div class="center-align flow-text"><i class="material-icons">place</i><span>'+ data.name +' </span></div>';
    header.innerHTML = html;
}

const getLongitudeLatitude = async (zipcode) => {
    let url = 'http://api.openweathermap.org/geo/1.0/zip?zip='+zipcode+',us&appid='+APIKEY;
    try {
        let data = await get(url);
        renderLocation(data);

        let lat = data.lat;
        let lng = data.lon;
        return {
            'longitude' : lng,
            'latitude' : lat
        }
    }
    catch (e){
        M.toast({html: 'Invalid zipcode!', classes: 'rounded red darken-4 white-text'});
        console.log(e);
    }
}

const mainWeather = async (location) => {

    let longitude =  location.longitude;
    let latitude =  location.latitude;
    let urlForCurrentDay = 'https://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&units=imperial&appid='+APIKEY;
    let urlForCurrentDaily = 'https://api.openweathermap.org/data/2.5/onecall?lat='+latitude+'&lon='+longitude+'&units=imperial&appid='+APIKEY;
    try {
        let responseCurrent = await get(urlForCurrentDay);
        onSuccessCurrent(responseCurrent);

        let responseDaily = await get(urlForCurrentDaily);
        onSuccessDaily(responseDaily);

    } catch (e) {
        console.log(e)
    }

}

const onSuccessCurrent = (response) => {
    let data = response.main;
    let main_weather = document.getElementById("main-weather");
    main_weather.innerHTML = '';
    let div1 = document.createElement('div');
    div1.className = "row";
    let html  = '';
    html += '<div class="col s12">';
        html += '<div class="col s12 center-align">';
            html += '<p class="infor-2-wt">'+ new Date(response.dt*1000).toDateString() +'</p>';
            html += '<p class="infor-1-wt">';
            html += showIcon(response.weather[0].icon);
            html += Math.round(data.temp) +'°F</p>';
            html += '<p class="infor-2-wt"> H: '+ data.temp_max + '<span >°F</span>  - L: '+ data.temp_min + '<span  >°F</span></p>';
            html += '<p class="infor-3-wt"> '+ response.weather[0].main +'</p>';
            html += '<p class="infor-3-wt"> Humidity: '+ data.humidity +' %</p>';
            html += '<p class="infor-3-wt"> Wind: '+ Math.round(response.wind.speed) +' mph</p>';
        html += '</div>';
    html += '</div>';

    div1.innerHTML = html;
    main_weather.appendChild(div1);
}
const showIcon = (str) => {
    if (str === '01n' || str === '01d'){
        return '<i class="cclear"></i>';
    }else if (str === '02n' || str === '02d'|| str === '04n' || str === '04d'){
        return '<i class="fewcloud"></i>';
    }else if (str === '03n' || str === '03d'){
        return '<i class="cloud"></i>';
    }
    else if (str === '09n' || str === '09d'|| str === '10n' || str === '10d'){
        return '<i class="rain"></i>';
    }else if (str === '11n' || str === '11d'){
        return '<i class="thunderstorm"></i>';
    }else if (str === '13n' || str === '13d'){
        return '<i class="snow"></i>';
    }else if (str === '50n' || str === '50d'){
        return '<i class="mist"></i>';
    }
}

const onSuccessDaily = (response) => {
    console.log(response)
    let data = response.daily;let dataHr = response.hourly;
    let main_weather = document.getElementById("main-dailyweather");
    main_weather.innerHTML = '';
    let div = document.createElement('div');
    div.className = "row col s12";
    for (let i=1; i< data.length-1; i++){
        let divInside = document.createElement('div');
        divInside.className = "col s2 center-align light-blue lighten-3";
        divInside.setAttribute("style", "border: 3px solid white;");
        let html  = '';
        html += '<p>'+ new Date(data[i].dt*1000).toDateString() +'</p>';
        html += showIcon(data[i].weather[0].icon);
        html += '<p  class="infor-1-wt"> '+ Math.round(data[i].temp.day) +'°F</p>';
        html += '<p  class="infor-2-wt"> H: '+ Math.round(data[i].temp.max) + '°F - L: '+ Math.round(data[i].temp.min) + '°F</p>';
        html += '<p class="infor-3-wt"> '+ data[i].weather[0].main +'</p>';
        html += '<p class="infor-3-wt"> Humidity: '+ data[i].humidity +' %</p>';
        html += '<p class="infor-3-wt"> Wind: '+ Math.round(data[i].wind_speed) +' mph</p>';
        divInside.innerHTML = html;
        div.appendChild(divInside);
    }
    main_weather.appendChild(div);

    let mainHourl = document.getElementById('mainHourl');



    for (let j=1; j< dataHr.length; j++){
        let div2 = document.createElement('div');
        div2.className = "col s4 center-align light-blue lighten-3 carousel-item";
        let html2 ='';
        let time = new Date(dataHr[j].dt*1000).getHours()
        let ampm =  time >= 12 ? time + ' PM' : time + ' AM';
        html2 += '<p  class="infor-3-wt"> ' + ampm + '</p>';
        html2 += '<p  class="infor-3-wt"> <img class="responsive-img" style="width: 50px; height: 50px" src="http://openweathermap.org/img/wn/'+ dataHr[j].weather[0].icon +'.png">'+ Math.round(dataHr[j].temp) +'°F </p>';
        html2 += '<p class="infor-2-wt"> Fells like: '+ Math.round(dataHr[j].feels_like) +'</p>'
        html2 += '<p  class="infor-3-wt"> UV Index: '+ dataHr[j].uvi +' </p>';
        html2 += '<p  class="infor-3-wt">Wind: '+ dataHr[j].wind_speed +' mph</p>';
        div2.innerHTML = html2;
        mainHourl.appendChild(div2);
    }
    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems);


}


const get = async (url) => {
    return new Promise(function (resolve, reject){
        let http = new XMLHttpRequest();
        http.onload = () => {
            if(http.status === 200){
                // console.log(http.response);
                resolve(JSON.parse(http.response));
            } else if(http.status === 404) {
                M.toast({html: 'Invalid input!', classes: 'rounded red darken-4 white-text'});
                return Promise.reject('error 404');
            }else {
                reject(http.statusText);
            }
        }

        http.onerror = () => {
            reject(http.statusText);
        }
        http.open("GET", url);
        http.send();
    })
}
