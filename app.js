// Temporary check that the script is connected. I'll remove this later.
console.log("RailYatra: app.js loaded");

// Mobile menu: the button shows and hides the navigation links.
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

function setMenuOpen(isOpen) {
    navMenu.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
}

navToggle.addEventListener("click", function () {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
});

//Close the menu after link is chosen, so it doesn't cover the page.
navMenu.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
        setMenuOpen(false);
    }
});

// Show the current year in the footer, so it never goes out of date.
document.getElementById("footer-year").textContent = new Date().getFullYear();

// Pressing Escape closes the mobile menu and puts focus back on the button.
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false);
        navToggle.focus();
    }
});

// Station data. It starts empty and is filled in once the file has loaded.
let stations = [];

const searchMessage = document.getElementById("search-message");

function showMessage(text) {
    searchMessage.textContent = text;
}

// Some state names in the dataset are old or missing, so tidy them up.
function cleanState(state) {
    if (!state) {
        return "";
    }
    if (state === "Orissa") {
        return "Odisha";
    }
    return state.trim();
}

// Turn one raw GeoJSON feature into a simple station object.
// GeoJSON stores coordinates as [longitude, latitude].
function makeStation(feature) {
    const props = feature.properties;
    const coords = feature.geometry ? feature.geometry.coordinates : null;

    return {
        name: (props.name || "").trim(),
        code: (props.code || "").trim(),
        state: cleanState(props.state),
        zone: props.zone && props.zone !== "?" ? props.zone : "",
        lat: coords ? coords[1] : null,
        lng: coords ? coords[0] : null
    };
}

// Leave out the station with no name and the two that are in Bangladesh.
function isUsable(station) {
    return station.name !== "" && station.state !== "Bangladesh";
}

const stationList = document.getElementById("station-list");
const resultsSummary = document.getElementById("results-summary");

// Build one card for one station. Missing details are said plainly, not guessed.
function createStationCard(station) {
    const item = document.createElement("li");
    item.className = "card station-card";

    const name = document.createElement("h3");
    name.className = "station-card__name";
    name.textContent = station.name;

    const code = document.createElement("span");
    code.className = "station-card__code";
    code.textContent = station.code;

    const meta = document.createElement("p");
    meta.className = "station-card__meta";
    const stateText = station.state || "State not recorded";
    const zoneText = station.zone ? "Zone " + station.zone : "Zone not recorded";
    meta.textContent = stateText + " | " + zoneText;

    item.appendChild(name);
    item.appendChild(code);
    item.appendChild(meta);
    return item;
}

const PAGE_SIZE = 20; // how many stations to add at a time
let currentResults = []; // the stations that match the current search
let visibleCount = PAGE_SIZE; // how many of them are on the page right now
const showMoreButton = document.getElementById("show-more-button");

// Describe how many stations are being shown.
function describeResults(shown, total) {
    if (total === 0) {
        return "No stations found. Try a different search or filter.";
    }
    if (shown >= total) {
        return total === 1
            ? "Showing 1 station."
            : "Showing all " + total.toLocaleString("en-IN") + " stations.";
    }
    return "Showing " + shown.toLocaleString("en-IN") + " of " + total.toLocaleString("en-IN") + " stations.";
}


// Find stations whose name or code contains the search text.
function searchStations(query) {
    const text = query.trim().toLowerCase();

    return stations.filter(function (station) {
        return station.name.toLowerCase().includes(text) ||
            station.code.toLowerCase().includes(text);
    });
}

const stateFilter = document.getElementById("state-filter");

// Fill the state dropdown with the states that appear in the data.
function fillStateFilter() {
    const states = [];

    stations.forEach(function (station) {
        if (station.state !== "" && !states.includes(station.state)) {
            states.push(station.state);
        }
    });

    states.sort();

    states.forEach(function (state) {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateFilter.appendChild(option);
    });
}

// The stations that match the search text and the chosen filters.
function getMatchingStations() {
    const selectedState = stateFilter.value;

        return searchStations(searchInput.value).filter(function (station) {
            return selectedState === "" || station.state === selectedState;
        });
    }

// Start a new list of results, beginning again from the first page.
function showResults(list) {
    currentResults = list;
    visibleCount = PAGE_SIZE;
    renderStations();
}

// Draw the cards for the stations that are currently visible.
function renderStations() {
    stationList.innerHTML = ""; // clear any old cards first

    currentResults.slice(0, visibleCount).forEach(function (station) {
        stationList.appendChild(createStationCard(station));
    });

    resultsSummary.textContent = describeResults(visibleCount, currentResults.length);
    showMoreButton.hidden = visibleCount >= currentResults.length;
}

async function loadStations() {
    showMessage("Loading stations...");

    try {
        const response = await fetch("data/stations.json");

        if (!response.ok) {
            throw new Error("The file could not be loaded (status " + response.status + ")");
        }

        const geojson = await response.json();
        stations = geojson.features.map(makeStation).filter(isUsable);

        showMessage("");
        fillStateFilter();
        showResults(stations);
        console.log("Stations ready:", stations.length);
    } catch (error) {
        console.error("Station data failed to load:", error);
        showMessage("Sorry, the station data could not be loaded. Please try refreshing the page.");
        resultsSummary.textContent = "No stations to show because the data could not be loaded.";
    }
}

loadStations();

// Search form: run the search when the form is submitted.
const searchForm = document.getElementById("station-search-form");
const searchInput = document.getElementById("station-search-input");

searchForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Stop the browser from reloading the page

    if (stations.length === 0) {
        showMessage("The station data isn't available yet.");
        return;
    }

    const results = getMatchingStations();
    showResults(results);

    if (results.length === 0) {
        showMessage("No stations match your search and filters.");
    } else {
        showMessage("");
    }

    document.getElementById("results").scrollIntoView();
});

// "Show more" adds another page of results.
showMoreButton.addEventListener("click", function () {
    visibleCount += PAGE_SIZE;
    renderStations();
});

// Update the results while the visitor types.
searchInput.addEventListener("input", function () {
    if (stations.length === 0) {
        return;
    }
    showMessage("");
    showResults(getMatchingStations());
});

// Changing the state shows the matching stations straight away.
stateFilter.addEventListener("change", function () {
    if (stations.length === 0) {
        return;
    }
    showMessage("");
    showResults(getMatchingStations());
});