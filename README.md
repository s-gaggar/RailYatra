RailYatra is an Indian railway station explorer.
It is a student-made project.

The data is sourced from DataMeet's open Indian Railway data, github.com/datameet/railways, file stations.json. It is licensed as CC0, so it is free to use.
It is a GeoJSON file with 8990 stations. Each has a name and code, and some also have a state, zone, address and coordinates.
It is bundled in the project, so the site doesn't rely on an outside service.
It was gathered around 2016, so newer stations and recent changes may be missing.
293 stations have no coordinates, so they cannot appear on the map.
About half the stations have no state or address recorded, and roughly half have no zone.
106 stations have a sone of ?, and one station has no name.
State names are inconsistent. Two entries are listed under Bangladesh.
Because of this, counts and charts by state or zone only cover the stations that have those fields.
The site doesn't show live train information, and it isn't affiliated with Indian Railways.

To run the site on your computer, install the Live Server extension in VS Code, right click index.html and choose Open with Live Server.
A local server is needed, as browsers won't load the data file if you open index.html directly.