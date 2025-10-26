// Initialize map
const map = L.map('map').setView([23.5, 83], 5);
const defaultLocation = [23.5, 83];
var localLocation = null;
var localLocationFound = false;
var localLocationCircle = null;

// Add OpenStreetMap tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// new L.Control.Geocoder().addTo(map);

// Adding markers on the map
async function addMarkers() {
    const request = new Request(`https://jaldi-api.vercel.app/all`, {
        method: "GET"
    });

    let res = await fetch(request);
    let result = await res.json();
    result = result.data;
    console.log(result);

    result.forEach(item => {
        L.marker([item.latitude, item.longitude]).addTo(map);
    });
}
addMarkers();

// Event handlers
function onLocationFound(e) {
    //console.log(e);
    localLocation = e.latlng;
    localLocationFound = true;
    localLocationCircle = L.circle(localLocation, 8000, {fillOpacity: "0.15", opacity: "0.7"});

    localStorage.setItem("userLatitude", localLocation["lat"]);
    localStorage.setItem("userLongitude", localLocation["lng"]);
    
    // console.log(typeof(localStorage));
};

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent(`You clicked the map at ${e.latlng}`)
        .openOn(map);
};

function onLocationError(e) { alert(e.message) };

// Register events
map.on("click", onMapClick);
map.on("locationfound", onLocationFound);
map.on("locationerror", onLocationError);

// Try locating user
map.locate({ setView: false, maxZoom: 10 });

// Buttons
const allIndiaBtn = document.getElementById("all-india-btn");
const localAreaBtn = document.getElementById("local-area-btn");
const stateWiseBtn = document.getElementById("state-wise-btn");

allIndiaBtn.onclick = function() {
    allIndiaBtn.style.color = "#436a9f";
    allIndiaBtn.style.borderColor = "#436a9f";

    localAreaBtn.style.color = "#464646";
    localAreaBtn.style.borderColor = "#464646";

    stateWiseBtn.style.color = "#464646";
    stateWiseBtn.style.borderColor = "#464646";

    map.setView(defaultLocation, 5);
};

localAreaBtn.onclick = function() {
    if (!localLocationFound) {
        alert("Error: Unable to find geolocation.");
        return;
    }

    allIndiaBtn.style.color = "#464646";
    allIndiaBtn.style.borderColor = "#464646";

    localAreaBtn.style.color = "#436a9f";
    localAreaBtn.style.borderColor = "#436a9f";

    stateWiseBtn.style.color = "#464646";
    stateWiseBtn.style.borderColor = "#464646";

    map.setView(localLocation, 12);

    
    localLocationCircle.addTo(map);
};

stateWiseBtn.onclick = function() {
    allIndiaBtn.style.color = "#464646";
    allIndiaBtn.style.borderColor = "#464646";

    localAreaBtn.style.color = "#464646";
    localAreaBtn.style.borderColor = "#464646";

    stateWiseBtn.style.color = "#436a9f";
    stateWiseBtn.style.borderColor = "#436a9f";
};

// Search bar
const searchBar = document.getElementById("search");
const searchResults = document.getElementById("search-results");

searchBar.addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        var value = searchBar.value.trim();
        
        if (value === "")
        {
            searchResults.innerHTML = "";
        }
        else {
            displaySearchResults(value);
        }
    }
})

async function displaySearchResults(query) {
    const request = new Request(`https://nominatim.openstreetmap.org/search?q=%22${query}%22&format=jsonv2`, {
        method: "GET"
    });

    let res = await fetch(request);
    let result = await res.json();

    searchResults.innerHTML = "";

    if (result.length === 0) {
        searchResults.innerHTML += `
<div class="search-result-container">
    <div class="search-result">
        <button disabled class="result-not-found-btn"><i class="fa-solid fa-water">&nbsp</i> Couldn't find this location.</button>
    </div>
</div>`
    }

    result.forEach(item => {
        searchResults.innerHTML += `
<div class="search-result-container">
    <div class="search-result">
        <button lat="${item.lat}" lon="${item.lon}" class="result-btn"><i class="fa-solid fa-location-dot">&nbsp</i> ${item.display_name}</button>
    </div>
</div>`
    });

    searchResults.style.display = "flex";

    var resultButtons = document.getElementsByClassName("result-btn");
    //console.log(resultButtons[0]);

    for (let i = 0; i < resultButtons.length; i ++) {
        let button = resultButtons[i];
        button.onclick = function () {
            lat = button.getAttribute("lat");
            lon = button.getAttribute("lon");

            map.setView([lat, lon], 12);

            searchResults.style.display = "none";
        }
    }
}
