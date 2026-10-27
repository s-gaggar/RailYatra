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
    if (event.target.tagName === "A') {
        setMenuOpen(false);
    }
});