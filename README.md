# RailYatra

RailYatra is a small wesbite I made in the process of learning webdev. on https://railyatra-six.vercel.app we can search for stations by names or codes and filter the station lists by states or zones. we can also find the stations on the map of India. i also added a few railway facts and charts about data that i found interesting. the site works on both phone and desktop.



## Stuff I used for building

- HTML, CSS and JS
- Leaflet for the map, with OpenStreetMap tiles
- Chart.js for the charts
- Git and GitHub for version control
- Vercel for hosting

## Running it locally

Browsers won't load the data file if index.html is opened directly, so:
- install the Liver Server extension in VS Code
- right-click index.html and choose to open with liver server

## Project files

- index.html - page structure
- styles.css - styling
- app.js - loading the data, search, filters, map, dashboard and charts
- data/stations.json - the station data

## Credits

- station data: DataMeet, Indian Railways data (CC0)
- map data: OpenStreetMap contributors
- map library: Leaflet. Charts: Chart.js