const s_map = L.map('map').setView([23.5, 83], 5);
// var userLatitude = Number(localStorage.getItem("userLatitude"));
// var userLongitude = Number(localStorage.getItem("userLongitude"));

// console.log(userLatitude);

// Add OpenStreetMap tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(s_map);


// function onLocationFound(e) {
//     //console.log(e);
//     // localLocation = e.latlng;
//     // localLocationFound = true;
//     // localLocationCircle = L.circle(localLocation, 8000, {fillOpacity: "0.15", opacity: "0.7"});
//     L.marker(e.latlng).addTo(s_map);
// };


// TODO: handle case when location isnt found
// s_map.locate({ setView: true, maxZoom: 20 });
// console.log("test");
// var marker = L.marker([userLatitude, userLongitude]);
//var markerLayer = L.layerGroup([marker]).addTo(s_map);
// marker.addTo(s_map);
// console.log(userLocation);

var marker = null;


// Marking a point in the map if its clicked
function onMapCLick(e) {
    if (marker !== null) { s_map.removeLayer(marker); }
    
    marker = L.marker(e.latlng);
    marker.addTo(s_map);
}

s_map.on("click", onMapCLick);

// Search bar logic
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

    // Adding logic to each button in search result
    for (let i =0; i < resultButtons.length; i++) {
        let button = resultButtons[i];
        button.onclick = function() {
            let lat = button.getAttribute("lat");
            let lon = button.getAttribute("lon");

            // Changing marked point in map
            if (marker !== null) { s_map.removeLayer(marker); }

            marker = L.marker([lat, lon]);
            marker.addTo(s_map);
            s_map.setView([lat, lon], 13);

            searchResults.style.display = "none";
        }
    }
}

// Form logic
const form = document.getElementById("reportForm");

form.addEventListener("submit", function(e) {
    if (marker === null) {
        return;
    }
    e.preventDefault();
    
    const name = document.getElementById("fname");
    const desc = document.getElementById("fdesc");

    // console.log(marker.getLatLng()["lat"]);
    // TODO: implement this logic
    // gotta update api first, so this has been put on hold

    window.location = "./thanks.html";

});