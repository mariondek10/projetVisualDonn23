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

/* import data1erMai from "../data/trip_data_0105.csv";
import data0105 from "../data/trip_data_20130501.csv";
import data0205 from "../data/trip_data_20130502.csv";
import data0305 from "../data/trip_data_20130503.csv";
import data0405 from "../data/trip_data_20130504.csv";
import data0505 from "../data/trip_data_20130505.csv";
import data0605 from "../data/trip_data_20130506.csv";
import data0705 from "../data/trip_data_20130507.csv";
import data0805 from "../data/trip_data_20130508.csv";
import data0905 from "../data/trip_data_20130509.csv";
import data1005 from "../data/trip_data_20130510.csv";
import data1105 from "../data/trip_data_20130511.csv";
import data1205 from "../data/trip_data_20130512.csv";
import data1305 from "../data/trip_data_20130513.csv"; */
import data1405 from "../data/trip_data_20130514.csv";
/* import data1505 from "../data/trip_data_20130515.csv";
import data1605 from "../data/trip_data_20130516.csv";
import data1705 from "../data/trip_data_20130517.csv";
import data1805 from "../data/trip_data_20130518.csv";
import data1905 from "../data/trip_data_20130519.csv";
import data2005 from "../data/trip_data_20130520.csv";
import data2105 from "../data/trip_data_20130521.csv";
import data2205 from "../data/trip_data_20130522.csv";
import data2305 from "../data/trip_data_20130523.csv";
import data2405 from "../data/trip_data_20130524.csv";
import data2505 from "../data/trip_data_20130525.csv";
import data2605 from "../data/trip_data_20130526.csv";
import data2705 from "../data/trip_data_20130527.csv";
import data2805 from "../data/trip_data_20130528.csv";
import data2905 from "../data/trip_data_20130529.csv";
import data3005 from "../data/trip_data_20130530.csv";
import data3105 from "../data/trip_data_20130531.csv"; */

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

const div = document.querySelector("#slider");
const slider = sliderBottom().min(0).max(24).step(1).width(1000);

const g = d3
  .select(div)
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

function renderHeatMapLayer(map, cleanData) {
  const heatMapArray = [];

  cleanData.forEach((d) => {
    let heatMapPoint = {
      lat: d.pickup_latitude,
      lon: d.pickup_longitude,
    };

    heatMapArray.push(heatMapPoint);
  });

  const heatMap = L.heatLayer(heatMapArray, {
    radius: 35,
    blur: 13,
    minOpacity: 0.15,
    gradient: { 0.1: "#FF33B1", 0.5: "#16F2F2", 0.7: "#A0FF00" },
  }).addTo(map);
}

renderHeatMapLayer(map, cleanData);
