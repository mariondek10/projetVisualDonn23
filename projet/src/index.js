//import dataTaxi from "../data/trip_data_1.csv";

//console.log(dataTaxi);

//import dataTaxiMai from "../data/trip_data_mai.xlsx";

import { csv } from "d3-fetch";
import { select } from "d3-selection";
import { mean } from "d3-array";
import { sliderBottom } from "d3-simple-slider";
import * as d3 from "d3";
import h337 from "heatmap.js";
import * as L from "leaflet";
import "leaflet.heat";

import data1405 from "../data/trip_data_20130514.csv";
/* import data1505 from "../data/trip_data_20130515.csv"; */

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

export const cleanData = data1405.map(function (d) {
  return {
    pickup_hour: new Date(d.pickup_datetime).getHours(),
    dropoff_hour: new Date(d.dropoff_datetime).getHours(),
    pickup_longitude: +d.pickup_longitude,
    pickup_latitude: +d.pickup_latitude,
    dropoff_longitude: +d.dropoff_longitude,
    dropoff_latitude: +d.dropoff_latitude,
  };
});

console.log(cleanData);

/* Slider */

const divSlider = document.querySelector("#slider");
const slider = sliderBottom().min(0).max(24).step(1).width(1000);

const g = d3
  .select(divSlider)
  .append("svg")
  .attr("width", 1200)
  .attr("height", 100)
  .append("g")
  .attr("transform", "translate(30,30)");

g.call(slider);

/*Données nettoyées par heure*/

function getPickupLocationsByHour(data, hour) {
  // Filter data by pickup hour
  const filteredData = data.filter(
    (d) => new Date(d.pickup_datetime).getHours() === hour
  );

  // Map data to array of pickup locations
  const pickupLocations = filteredData.map((d) => {
    return {
      latitude: +d.pickup_latitude,
      longitude: +d.pickup_longitude,
    };
  });

  return pickupLocations;
}

//console.log(getPickupLocationsByHour(data1405, 0));

function getDropOffLocationsByHour(data, hour) {
  // Filter data by pickup hour
  const filteredData = data.filter(
    (d) => new Date(d.dropoff_datetime).getHours() === hour
  );

  // Map data to array of pickup locations
  const dropOffLocation = filteredData.map((d) => {
    return {
      latitude: +d.dropoff_latitude,
      longitude: +d.dropoff_longitude,
    };
  });

  return dropOffLocation;
}

//console.log(getDropOffLocationsByHour(data1405, 0));

//max : lat: 40.953047, long: -74.071165 -> au-dessus de Paramus
//min: lat :40.588219, long: -73.657818 -> près de long beach

/* Heatmap */

/* const heatMapArray = [];

const heatMap = L.heatLayer(heatMapArray, {
  radius: 40,
  blur: 13,
  minOpacity: 0.15,
  gradient: { 0.1: "#FF33B1", 0.5: "#16F2F2", 0.7: "#A0FF00" },
});

function renderHeatMapLayer(map, cleanData) {
  cleanData.forEach((d) => {
    let heatMapPoint = {
      lat: d.pickup_latitude,
      lon: d.pickup_longitude,
    };

    heatMapArray.push(heatMapPoint);
  });

  heatMap.addTo(map);
} */

//renderHeatMapLayer(map, cleanData);

/* Heatmap par heure */

const heatMapArray2 = [];

const heatMap2 = L.heatLayer(heatMapArray2, {
  backgroundColor: "rgba(0,0,0,.95)",
  radius: 10,
  blur: 13,
  minOpacity: 0.3,
  maxOpacity: 0.9,
});

function renderHeatMapLayerByHour(map, cleanData, hour) {
  cleanData.forEach((d) => {
    if (d.pickup_hour === hour) {
      let heatMapPoint = {
        lat: d.pickup_latitude,
        lon: d.pickup_longitude,
      };

      heatMapArray2.push(heatMapPoint);
    }
  });

  heatMap2.addTo(map);

  console.log(heatMapArray2);
}

renderHeatMapLayerByHour(map, cleanData, 0);

/*Animation slider*/

/*Animation heatmap*/
const margin = { top: 50, right: 40, bottom: 50, left: 40 },
  width = window.innerWidth - margin.left - margin.right,
  height = 0.6 * window.innerHeight - margin.top - margin.bottom;

const svg = d3
  .select("#viz_area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  // translate this svg element to leave some margin.
  .append("g");

// variable to store our intervalID
let nIntervId;

function animate() {
  // check if already an interval has been set up
  if (!nIntervId) {
    nIntervId = setInterval(play, 1000);
  }
}

let i = 0;
function play() {
  if (i == heatMapArray2.length - 1) {
    i = 0;
  } else {
    i++;
  }

  d3.select("#paragraphe").text(data[i].annee);
  getPickupLocationsByHour(map, cleanData, i);
}

function stop() {
  clearInterval(nIntervId);

  // release our intervalID from the variable
  nIntervId = null;

  i = 0;
}

function pause() {
  clearInterval(nIntervId);

  // release our intervalID from the variable
  nIntervId = null;
}

document.getElementById("play").addEventListener("click", animate);
document.getElementById("stop").addEventListener("click", stop);
document.getElementById("pause").addEventListener("click", pause);

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

const heatMapArray3 = [];

const heatMap3 = L.heatLayer(heatMapArray3, {
  backgroundColor: "rgba(0,0,0,.95)",
  radius: 10,
  blur: 13,
  minOpacity: 0.3,
  maxOpacity: 0.9,
  //gradient: { 0.1: "#A0FF00", 0.5: "#16F2F2", 0.7: "#ff33b1" },
});

function renderHeatMapLayerByHour2(map2, cleanData, hour) {
  cleanData.forEach((d) => {
    if (d.dropoff_hour === hour) {
      let heatMapPoint2 = {
        lat: d.dropoff_latitude,
        lon: d.dropoff_longitude,
      };

      heatMapArray3.push(heatMapPoint2);
    }
  });

  heatMap3.addTo(map2);

  console.log(heatMapArray3);
}

renderHeatMapLayerByHour2(map2, cleanData, 1);
