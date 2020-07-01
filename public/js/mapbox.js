/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2aWRidWk4MyIsImEiOiJja2MyanY2bzAwMHM5Mnl1bTgxd2NsdHUyIn0.AE5CACKLaSvEAszyH7Mm3A';
  
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/davidbui83/ckc2k5xp4060a1ip6yrjndq18',
    scrollZoom: false
    // center: [-118.113491,34.111745],
    // zoom: 5, 
    // interactive: false
  });
  
  const bounds = new mapboxgl.LngLatBounds();
  
  locations.forEach(loc => {
    // Add marker
    const el = document.createElement('div');
    el.className = 'marker'; 
  
    new mapboxgl.Marker({
      element: el,
      ancor: 'bottom'
    })
    .setLngLat(loc.coordinates)
    .addTo(map);
  
    //  Add popup
    new mapboxgl.Popup({
      offset: 30
    })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);
  
    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });
  
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });

};
