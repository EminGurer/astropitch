mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [32.86, 39.92], // starting position [lng, lat]
  zoom: 0, // starting zoom
});

const geocoder = new MapboxGeocoder({
  accessToken: mapboxToken,
  mapboxgl: mapboxgl,
  marker: false,
  placeholder: 'Search in map',
});
const marker = new mapboxgl.Marker();
const geometryInput = document.getElementById('geometry');

document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

map.on('click', function addMarker(event) {
  marker.setLngLat(event.lngLat).addTo(map);
  map.flyTo({
    center: event.lngLat,
    zoom: 13,
  });
  const geoJson = {
    type: 'Point',
    coordinates: [event.lngLat.lng, event.lngLat.lat],
  };
  geometryInput.value = JSON.stringify(geoJson);
});
