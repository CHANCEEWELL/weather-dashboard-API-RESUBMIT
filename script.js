const apiKey = "&appid=94dc837cac6009ee9dec8622a9fe75ff";
let date = new Date();
var pastSearch = localStorage.getItem("Past Cities");

makeHistory();
function makeHistory(){
    pastSearch = JSON.parse(pastSearch) || [];
    for (i = 0; i < pastSearch.length; i++){
        var PC = document.createElement("ul")  
        PC.innerHTML = pastSearch[i];
        console.log(PC);
        document.getElementById("searchHistory").appendChild(PC);
    }
        $("ul").addClass("list-group list-group-flush list");
}

    city = pastSearch[pastSearch.length-1]
    getWeather(city);  

    $('#searchHistory').on('click', 'ul', function(){
        var city = $(this).text();
        getWeather(city);
    });

function getWeather(city){
    const firstqueryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;
    $.ajax({
        url: firstqueryUrl,
        method: "GET",
        statusCode: {
            404: function(){
            $('#currentCity').hide();
            $('#5dayForecast').hide();
            $('#error404').show();
            $('#forecastTitle').hide();
            pastSearch.pop();
            localStorage.setItem("Past Cities", JSON.stringify(pastSearch));
            location.reload();
            }
        }
    })
    .then(function (response){
        lat = (response.coord["lat"])
        lon = (response.coord["lon"])

        var uviQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + apiKey;
        $.ajax({
            url: uviQueryURL,
            method: "GET"
        })
        .then(function (response){
            $('#forecastTitle').show();
            $('#error404').hide();

            var todayHumidity = response.daily[0].humidity;
            var todayUVI = response.daily[0].uvi;
            var todayWind = response.daily[0].wind_speed;
            todayWind = Math.round(todayWind);
            var todayIcon = response.daily[0].weather[0].icon;
            var todayHigh = response.daily[0].temp.max;
            todayHigh = Math.round(todayHigh);
            var todayMin = response.daily[0].temp.min;
            todayMin = Math.round(todayMin);
            todayIconLink = "http://openweathermap.org/img/wn/" + todayIcon + "@2x.png";

            $("#currentCity").empty();

            const card = $("<div>").addClass("card");
            const cardBody = $("<div>").addClass("card-body");
            const cityname = $("<h4>").addClass("card-title").text(city);
            const cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
            const highTemp = $("<p>").addClass("card-text").text("High: " + todayHigh + " °F");
            const lowTemp = $("<p>").addClass("card-text").text("Low: " + todayMin + " °F");
            var UVDanger = $("<div>").html('<span>UV Index: </span>' + '<span class="badge badge-pill" id="uvWarn">' + todayUVI + '</span>');      
            const humidity = $("<p>").addClass("card-text").text("Humidity: " + todayHumidity + "%");
            const wind = $("<p>").addClass("card-text").text("Wind Speed: " + todayWind + " MPH");
            const image = $("<img>").attr("src", todayIconLink)

            cityname.append(cityDate, image)
            cardBody.append(cityname, highTemp, lowTemp, UVDanger, humidity, wind);
            card.append(cardBody);
            $("#currentCity").append(card);
            if (todayUVI < 3){
                $("#uvWarn").css('background-color', 'green');
            } else if (todayUVI < 6){
                $('#uvWarn').css('background-color', 'yellow');
            } else if (todayUVI < 8){
                $('##uvWarn').css('background-color', 'orange');
            } else if (todayUVI < 11){
                $('#uvWarn').css('background-color', 'red');
            } else{
                $('#uvWarn').css('background-color', 'purple');
            }

            for (let i = 1; i <= 5; i++){
                var futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + i);
                var futurehightemp = response.daily[i].temp.max;
                futurehightemp = Math.round(futurehightemp);
                var futurelowtemp = response.daily[i].temp.min;
                futurelowtemp = Math.round(futurelowtemp);
                var futureIcon = response.daily[i].weather[0].icon;
                var futureHumidity = response.daily[i].humidity;
                futureIconLink = "http://openweathermap.org/img/wn/" + futureIcon + "@2x.png";

                if (i === 1){
                    $("#5dayForecast").empty();
                }
                
                const card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
                const cardBody = $("<div>").addClass("card-body p-3")
                const cityDate = $("<h4>").addClass("card-title").text(futureDate.toLocaleDateString('en-US'));
                const highTemp = $("<p>").addClass("card-text").text("High: " + futurehightemp + " °F");
                const lowTemp = $("<p>").addClass("card-text").text("Low: " + futurelowtemp + " °F");
                const humidity = $("<p>").addClass("card-text").text("Humidity: " + futureHumidity + "%");       
                const image = $("<img>").attr("src", futureIconLink);
        
                cardBody.append(cityDate, image, highTemp, lowTemp, humidity);
                card.append(cardBody);
                $("#5dayForecast").append(card);
            }
        });
    });
}
$("#citySubmit").on("click", function(){

    city = $("#cityInput").val();  
    pastSearch.push(city);
    localStorage.setItem("Past Cities", JSON.stringify(pastSearch));

    $("#cityInput").val("");  
    $("#searchHistory").empty();
    for (i = 0; i < pastSearch.length; i++){
        var PC = document.createElement("ul")  
        PC.innerHTML = pastSearch[i];    
        document.getElementById("searchHistory").appendChild(PC);
    }
    
    $("ul").addClass("list-group list-group-flush list");
    getWeather(city); 
});