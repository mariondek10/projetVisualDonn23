import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "leaflet.heat";
import * as d3 from "d3";

/*Carte*/
const map = L.map("map").setView([40.764477, -73.979113], 10);
L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  }
).addTo(map);

/*Données nettoyées*/
d3.csv("../data/trip_data_20130514.csv").then((data1405) => {
  const cleanData = data1405.map(function (d) {
    return {
      pickup_hour: new Date(d.pickup_datetime).getHours(),
      dropoff_hour: new Date(d.dropoff_datetime).getHours(),
      pickup_longitude: +d.pickup_longitude,
      pickup_latitude: +d.pickup_latitude,
      dropoff_longitude: +d.dropoff_longitude,
      dropoff_latitude: +d.dropoff_latitude,
    };
  });
  let data = cleanData;

  console.log(cleanData);

  /* Heatmap par heure */

  const heatMapArray = [];

  const heatMap = L.heatLayer(heatMapArray, {
    backgroundColor: "rgba(0,0,0,.95)",
    radius: 15,
    blur: 13,
    minOpacity: 0.3,
    maxOpacity: 0.9,
  });

  function renderHeatMapLayerByHour(map, cleanData, hour) {
    map.removeLayer(heatMap);
    cleanData.forEach((d) => {
      if (d.pickup_hour === hour) {
        let heatMapPoint = {
          lat: d.pickup_latitude,
          lon: d.pickup_longitude,
        };
        console.log(hour);

        heatMapArray.push(heatMapPoint);
      }
    });

    heatMap.addTo(map);
  }

  //renderHeatMapLayerByHour(map, cleanData, 4);

  /*2ème map*/

  const map2 = L.map("map2").setView([40.764477, -73.979113], 10);
  L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 20,
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    }
  ).addTo(map2);

  const heatMapArray2 = [];

  const heatMap2 = L.heatLayer(heatMapArray2, {
    backgroundColor: "rgba(0,0,0,.95)",
    radius: 15,
    blur: 13,
    minOpacity: 0.3,
    maxOpacity: 0.9,
    //gradient: { 0.1: "#A0FF00", 0.5: "#16F2F2", 0.7: "#ff33b1" },
  });

  function renderHeatMapLayerByHour2(map2, cleanData, hour) {
    map2.removeLayer(heatMap2);
    cleanData.forEach((d) => {
      if (d.dropoff_hour === hour) {
        let heatMapPoint2 = {
          lat: d.dropoff_latitude,
          lon: d.dropoff_longitude,
        };

        heatMapArray2.push(heatMapPoint2);
      }
    });

    heatMap2.addTo(map2);
  }

  /*Animation heatmap*/

  // variable to store our intervalID
  let nIntervId;

  function animate() {
    // check if already an interval has been set up
    if (!nIntervId) {
      nIntervId = setInterval(play, 4000);
    }
  }

  let i = 0;
  function play() {
    if (i >= 23) {
      i = 0;
    } else {
      i++;
    }

    info.update(i);

    renderHeatMapLayerByHour(map, data, i);

    //heurepup.innerHTML = i + "h";
  }

  function stop() {
    clearInterval(nIntervId);

    // release our intervalID from the variable
    nIntervId = null;

    i = 0;
    map.removeLayer(heatMap);
  }

  function pause() {
    clearInterval(nIntervId);

    // release our intervalID from the variable
    nIntervId = null;
  }

  const heurepup = document.querySelector("#paragraphe");

  document.getElementById("play").addEventListener("click", animate);
  document.getElementById("stop").addEventListener("click", stop);
  document.getElementById("pause").addEventListener("click", pause);

  var info = L.control();

  info.onAdd = function (map) {
    this._div = L.DomUtil.create("div", "info");
    this.update();
    return this._div;
  };

  info.update = function (hour) {
    this._div.innerHTML = !hour ? "Heure" : hour + "h";
  };

  info.addTo(map);

  /*Animation heatmap2*/

  // variable to store our intervalID
  let nIntervId2;

  function animate2() {
    // check if already an interval has been set up
    if (!nIntervId2) {
      nIntervId2 = setInterval(play2, 4000);
    }
  }

  let y = 0;
  function play2() {
    if (y >= 24) {
      y = 0;
    } else {
      y++;
      renderHeatMapLayerByHour2(map2, data, y);
    }

    info2.update(y);

    //heuredrop.innerHTML = y + "h";
  }

  function stop2() {
    clearInterval(nIntervId2);

    // release our intervalID from the variable
    nIntervId2 = null;

    y = 0;

    map2.removeLayer(heatMap2);
  }

  function pause2() {
    clearInterval(nIntervId2);

    // release our intervalID from the variable
    nIntervId2 = null;
  }

  const heuredrop = document.querySelector("#paragraphe2");

  document.getElementById("play2").addEventListener("click", animate2);
  document.getElementById("stop2").addEventListener("click", stop2);
  document.getElementById("pause2").addEventListener("click", pause2);

  var info2 = L.control();

  info2.onAdd = function (map) {
    this._div = L.DomUtil.create("div", "info");
    this.update();
    return this._div;
  };

  info2.update = function (hour) {
    this._div.innerHTML = !hour ? "Heure" : hour + "h";
  };

  info2.addTo(map2);

  /*Graphique*/

  function getPickupLocationsByHour(data, hour) {
    // Filter data by pickup hour
    const filteredData = data.filter(
      (d) => new Date(d.pickup_datetime).getHours() === hour
    );

    // Count the number of pickup locations
    const pickupLocationCount = filteredData.reduce((count, d) => {
      if (d.pickup_latitude) {
        count[d.pickup_latitude] = (count[d.pickup_latitude] || 0) + 1;
      }
      return count;
    }, {});

    return pickupLocationCount;
  }

  const hour = 9;
  const pickupLocations = getPickupLocationsByHour(data, hour);

  console.log(pickupLocations);

  /*Points des aéroports */

  const airports = [
    { name: "JFK", lat: 40.6413, lon: -73.7781 },
    { name: "Newark", lat: 40.6895, lon: -74.1745 },
    { name: "LaGuardia", lat: 40.7769, lon: -73.874 },
  ];

  const airportIcon = L.icon({
    iconUrl: "../src/img/avion.png",
    iconSize: [30, 30],
  });

  const pointJFK = L.marker([airports[0].lat, airports[0].lon], {
    icon: airportIcon,
  });
  const pointNewark = L.marker([airports[1].lat, airports[1].lon], {
    icon: airportIcon,
  });
  const pointLaGuardia = L.marker([airports[2].lat, airports[2].lon], {
    icon: airportIcon,
  });

  const pointJFK2 = L.marker([airports[0].lat, airports[0].lon], {
    icon: airportIcon,
  });
  const pointNewark2 = L.marker([airports[1].lat, airports[1].lon], {
    icon: airportIcon,
  });
  const pointLaGuardia2 = L.marker([airports[2].lat, airports[2].lon], {
    icon: airportIcon,
  });

  pointJFK.bindPopup("<h3>Aéroport JFK</h3>").addTo(map);
  pointNewark.bindPopup("<h3>Aéroport de Newark</h3>").addTo(map);
  pointLaGuardia.bindPopup("<h3>Aéroport La Guardia</h3>").addTo(map);

  pointJFK2.bindPopup("<h3>Aéroport JFK</h3>").addTo(map2);
  pointNewark2.bindPopup("<h3>Aéroport de Newark</h3>").addTo(map2);
  pointLaGuardia2.bindPopup("<h3>Aéroport La Guardia</h3>").addTo(map2);
});
