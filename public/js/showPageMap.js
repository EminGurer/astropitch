mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: pitch.geometry.coordinates, // starting position [lng, lat]
  zoom: 13, // starting zoom
});

const marker = new mapboxgl.Marker()
  .setLngLat(pitch.geometry.coordinates)
  .addTo(map);
map.addControl(new mapboxgl.NavigationControl());
