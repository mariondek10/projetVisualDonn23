import * as L from "leaflet";

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
