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

//console.log(cleanData);

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

const dataUtilisable = cleanData.filter(
  (d) =>
    d.pickup_latitude < 40.953047 &&
    d.pickup_latitude > 40.588219 &&
    d.pickup_longitude < -73.657818 &&
    d.pickup_longitude > -74.071165
);

const minPickupLong = d3.min(dataUtilisable.map((d) => d.pickup_longitude));
const maxPickupLong = d3.max(dataUtilisable.map((d) => d.pickup_longitude));
const minPickupLat = d3.min(dataUtilisable.map((d) => d.pickup_latitude));
const maxPickupLat = d3.max(dataUtilisable.map((d) => d.pickup_latitude));

//console.log(minPickupLat, minPickupLong, maxPickupLat, maxPickupLong);

const hautG = [40.953047, -74.071165];
const basG = [40.588219, -74.071165];
const hautD = [40.953047, -73.657818];
const basD = [40.588219, -73.657818];

const intervalleLong = hautG[1] - hautD[1];
const intervalleLat = hautG[0] - basG[0];

const nb_long = 10;
const nb_lat = 10;

const cadrillage = [];
/* 
for (let i = hautG[1]; i <= hautD[1]; i -= intervalleLong / nb_long) {
  cadrillage.push([hautG[0], i]);
} */

/* for (let i = hautG[0]; i >= basG[0]; i -= intervalleLat / nb_lat) {
  cadrillage.push([i, hautG[1]]);
} */

let i1 = hautG[1];
do {
  cadrillage.push([hautG[0], i1]);
  i1 -= intervalleLong / nb_long;
} while (i1 < hautD[1]);

let i2 = hautG[0];
do {
  cadrillage.push([i2, hautG[1]]);
  i2 -= intervalleLat / nb_lat;
} while (i2 > basG[0]);

console.log(cadrillage);

cadrillage.forEach((d) => {
  L.circle([d[0], d[1]], 100, {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
  }).addTo(map);
});

/* Heatmap */

const config = {
  container: document.getElementById("map"),
  radius: 10,
  maxOpacity: 0.5,
  minOpacity: 0,
  blur: 0.75,
  gradient: {
    // enter n keys between 0 and 1 here
    // for gradient color customization
    ".5": "blue",
    ".8": "red",
    ".95": "white",
  },
};

// create heatmap with configuration
/* const heatmapInstance = h337.create(config);

// a single datapoint
var dataPoint = {
  x: 40.652253, // x coordinate of the datapoint, a number
  y: -73.8753,
  value: 1, // the value at datapoint(x, y)
};
heatmapInstance.addData(dataPoint);

// multiple datapoints (for data initialization use setData!!)
var dataPoints = [dataPoint, dataPoint, dataPoint, dataPoint];
heatmapInstance.addData(dataPoints);

for (let i = 0; i < cleanData.length; i++) {
  if (cleanData[i].pickup_hour === 0) {
    L.marker([
      cleanData[i].pickup_latitude,
      cleanData[i].pickup_longitude,
    ]).addTo(map);
  }
} */

/*
const tabData = [data0105, data0205, data0305];

const cleanData = tabData.forEach.map(function (d) {
  return {
    pickup_datetime: new Date(d.pickup_datetime).toLocaleDateString(),
    dropoff_datetime: new Date(d.dropoff_datetime).toLocaleDateString(),
    trip_time_in_secs: +d.trip_time_in_secs,
    trip_distance: +d.trip_distance,
    pickup_longitude: +d.pickup_longitude,
    pickup_latitude: +d.pickup_latitude,
    dropoff_longitude: +d.dropoff_longitude,
    dropoff_latitude: +d.dropoff_latitude,
  };
});

//console.log(data1105);

//console.log(cleanData);

const dataConvert = data1erMai.map(function (d) {
  return {
    pickup_datetime: new Date(d.pickup_datetime).toLocaleDateString(),
    dropoff_datetime: new Date(d.dropoff_datetime).toLocaleDateString(),
    trip_time_in_secs: +d.trip_time_in_secs,
    trip_distance: +d.trip_distance,
    pickup_longitude: +d.pickup_longitude,
    pickup_latitude: +d.pickup_latitude,
    dropoff_longitude: +d.dropoff_longitude,
    dropoff_latitude: +d.dropoff_latitude,
  };
});

//console.log(dataConvert);

//pickup_datetime,dropoff_datetime,passenger_count,trip_time_in_secs,trip_distance,pickup_longitude,pickup_latitude,dropoff_longitude,dropoff_latitude

const data = data0205.map(function (d) {
  return {
    pickup_datetime: new Date(d.pickup_datetime).toLocaleDateString(),
    dropoff_datetime: new Date(d.dropoff_datetime).toLocaleDateString(),
    passenger_count: +d.passenger_count,
    trip_time_in_secs: +d.trip_time_in_secs,
    trip_distance: +d.trip_distance,
    pickup_longitude: +d.pickup_longitude,
    pickup_latitude: +d.pickup_latitude,
    dropoff_longitude: +d.dropoff_longitude,
    dropoff_latitude: +d.dropoff_latitude,
  };
}); */
/* 
const platitude = data.map((d) => d.pickup_latitude);
const dlatitude = data.map((d) => d.dropoff_latitude);
const plongitude = data.map((d) => d.pickup_longitude);
const dlongitude = data.map((d) => d.dropoff_longitude); */

/* const heatmapLayer = L.tileLayer.heatMap({
  radius: { value: 20, absolute: false },
  opacity: 0.8,
  gradient: {
    0.45: "rgb(0,0,255)",
    0.55: "rgb(0,255,255)",
    0.65: "rgb(0,255,0)",
    0.95: "yellow",
    1: "rgb(255,0,0)",
  },
});
heatmapLayer.addTo(map);
const heatmapData = {
  max: 10,
  data: [
    { lat: 40.652253, lng: -73.8753, value: 1 },
    { lat: 40.639749, lng: -73.933152, value: 2 },
  ],
};

heatmapLayer.setData(heatmapData); */

/* dataConvert1.forEach((element) => {
  console.log(element.pickup_latitude);
}); */

//console.log(dataConvert1);

// creating a class to wrap the heatmap cycling logic
/* function AnimationPlayer(options) {
  this.heatmap = options.heatmap;
  this.data = options.data;
  this.interval = null;
  this.animationSpeed = options.animationSpeed || 300;
  this.wrapperEl = options.wrapperEl;
  this.isPlaying = false;
  this.init();
}
// define the prototype functions
AnimationPlayer.prototype = {
  init: function () {
    var dataLen = this.data.length;
    this.wrapperEl.innerHTML = "";
    var playButton = (this.playButton = document.createElement("button"));
    playButton.onclick = function () {
      if (this.isPlaying) {
        this.stop();
      } else {
        this.play();
      }
      this.isPlaying = !this.isPlaying;
    }.bind(this);
    playButton.innerText = "play";

    this.wrapperEl.appendChild(playButton);

    var events = document.createElement("div");
    events.className = "heatmap-timeline";
    events.innerHTML = "";

    for (var i = 0; i < dataLen; i++) {
      var xOffset = (100 / (dataLen - 1)) * i;

      var ev = document.createElement("div");
      ev.className = "time-point";
      ev.style.left = xOffset + "%";

      ev.onclick = function (i) {
        return function () {
          this.isPlaying = false;
          this.stop();
          this.setFrame(i);
        }.bind(this);
      }.bind(this)(i);

      events.appendChild(ev);
    }
    this.wrapperEl.appendChild(events);
    this.setFrame(0);
  },
  play: function () {
    var dataLen = this.data.length;
    this.playButton.innerText = "pause";
    this.interval = setInterval(
      function () {
        this.setFrame(++this.currentFrame % dataLen);
      }.bind(this),
      this.animationSpeed
    );
  },
  stop: function () {
    clearInterval(this.interval);
    this.playButton.innerText = "play";
  },
  setFrame: function (frame) {
    this.currentFrame = frame;
    var snapshot = this.data[frame];
    this.heatmap.setData(snapshot);
    var timePoints = $(".heatmap-timeline .time-point");
    for (var i = 0; i < timePoints.length; i++) {
      timePoints[i].classList.remove("active");
    }
    timePoints[frame].classList.add("active");
  },
  setAnimationData: function (data) {
    this.isPlaying = false;
    this.stop();
    this.data = data;
    this.init();
  },
  setAnimationSpeed: function (speed) {
    this.isPlaying = false;
    this.stop();
    this.animationSpeed = speed;
  },
};

var heatmapInstance = h337.create({
  container: document.querySelector(".heatmap"),
});

// animationData contains an array of heatmap data objects
var animationData = [];

// generate some heatmap data objects
for (var i = 0; i < 20; i++) {
  animationData.push(generateRandomData(300));
}

var player = new AnimationPlayer({
  heatmap: heatmapInstance,
  wrapperEl: document.querySelector(".timeline-wrapper"),
  data: animationData,
  animationSpeed: 100,
}); */
