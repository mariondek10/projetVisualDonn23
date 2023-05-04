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

//renderHeatMapLayerByHour2(map2, cleanData, 0);

/*Animation slider*/

/*Animation heatmap*/

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
  if (i > 24) {
    i = 0;
  } else {
    i++;
  }
  console.log(i);
  renderHeatMapLayerByHour(map, cleanData, i);
  heurepup.innerHTML = "Heure : " + i + "h";
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

const heurepup = document.querySelector("#paragraphe");

document.getElementById("play").addEventListener("click", animate);
document.getElementById("stop").addEventListener("click", stop);
document.getElementById("pause").addEventListener("click", pause);

/*Animation heatmap2*/

// variable to store our intervalID
let nIntervId2;

function animate2() {
  // check if already an interval has been set up
  if (!nIntervId2) {
    nIntervId2 = setInterval(play2, 1000);
  }
}

let y = 0;
function play2() {
  if (y > 24) {
    y = 0;
  } else {
    y++;
  }
  renderHeatMapLayerByHour2(map2, cleanData, y);

  heuredrop.innerHTML = "Heure : " + y + "h";
}

function stop2() {
  clearInterval(nIntervId2);

  // release our intervalID from the variable
  nIntervId2 = null;

  y = 0;
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
