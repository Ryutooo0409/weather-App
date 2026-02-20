function setTime(data,name,number){
    document.getElementById(name).textContent = data[number].time.slice(11, 16); 
}
function setTempByTime(data,name,number){
    document.getElementById(name).textContent = parseInt(data[number].temp_c) + "°" ;
}

function mapWeatherToIcon(conditionText, isDay) {
    const text = conditionText.toLowerCase();

    if (text.includes("sunny")) return "sunny";
    if (text.includes("clear")) return isDay ? "sunny" : "clear_night";
    if (text.includes("partly")) return isDay ? "partly_cloudy_day" : "partly_cloudy_night";
    if (text.includes("cloud") || text.includes("overcast")) return "cloud";
    if (text.includes("rain") || text.includes("drizzle")) return "rainy";
    if (text.includes("thunder")) return "thunderstorm";
    if (text.includes("snow") || text.includes("sleet") || text.includes("blizzard")) return "weather_snowy";
    if (text.includes("mist") || text.includes("fog")) return "foggy";
    if (text.includes("wind")) return "air";

    return "sunny"; // default fallback
}

function setIcon(data, name, number) {
    const element = document.getElementById(name);
    if (!element) return;

    const conditionText = data[number].condition.text;
    const isDay = data[number].is_day;

    element.textContent = mapWeatherToIcon(conditionText, isDay);
}

document.addEventListener("DOMContentLoaded", function () {

    const input = document.getElementById("searchInput");

    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            fetchData();
        }
    });

});

async function fetchData() {
    try {
        const cityName = document.getElementById("searchInput").value;
        
        const API = "14b2e05ad302497b9d482332252706";
        // const cityName = "Tokyo";
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API}&q=${cityName}&days=5`);
        if (!response.ok) {
            throw new Error("Could not fetch!");
        }
        const data = await response.json();

        const city = document.getElementById("city");
        const temperture = document.getElementById("temperture");
        const description = document.getElementById("description");
        const humidity = document.getElementById("humidity");
        const wind = document.getElementById("wind");
        const realFeel = document.getElementById("realFeel");
        const pressure = document.getElementById("pressure");
        const icon = document.getElementById("todayIcon")


        city.textContent = data.location.name;
        temperture.textContent = parseInt(data.current.temp_c) + "°";
        description.textContent = data.current.condition.text;
        humidity.textContent = data.current.humidity + "%";
        wind.textContent = (data.current.wind_kph * 1000 / 3600).toFixed(1) + " m/s"
        realFeel.textContent = parseInt(data.current.feelslike_c)+"°";
        pressure.textContent = data.current.pressure_mb + " mBar";
        icon.textContent = mapWeatherToIcon(data.current.condition.text, data.current.is_day);

        const currentTime = data.location.localtime;
        
        const arr1 = data.forecast.forecastday[0].hour;
        const arr2 = data.forecast.forecastday[1].hour;
        const combined = [...arr1 , ...arr2];
        
        let i = 0;
        while(i < combined.length){
            if(combined[i].time > currentTime){
                break;
            }
            i++;
        }
        
        const order = ["first","second","third","fourth","fifth","sixth"];

        // set the time for the next 6 hours
        for (let j = 0; j < 6; j++) {   
            setTime(combined, order[j], i + j);
            
        }

        // set the temperature for the next 6 hours
        for (let k = 0; k < 6; k++) {
            setTempByTime(combined, (k + 1).toString() , i + k);
        }

        // set the icon for the next 6 hours
        for (let t = 0; t < 6; t++) {
            setIcon(combined, (t + 1 + "t").toString() , i + t);
        }

        // set the icon color for the next 6 hours
        for (let c = 0; c < 6; c++) {
            const iconElement = document.getElementById((c + 1 + "t").toString());
            if (!iconElement) continue;
            if(combined[i + c].is_day){
                iconElement.classList.replace("text-blue-500", "text-yellow-500");
            }
        }

        // set icon color for current weather
        if(data.current.is_day){
            icon.classList.replace("text-blue-500", "text-yellow-500");
        }

        // console.log(data);


    } catch (error) {
        console.error(error);
    }
}
