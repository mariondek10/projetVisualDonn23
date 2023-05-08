import data1405 from "../data/trip_data_20130514";

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

export { cleanData, data };
