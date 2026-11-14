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
        console.log("Stations ready:", stations.length);
    } catch (error) {
        console.error("Station data failed to load:", error);
        showMessage("Sorry, the station data could not be loaded. Please try refreshing the page.");
    }
}

loadStations();