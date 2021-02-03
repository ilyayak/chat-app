const api = require('./api.js');

const placemarkIcon = {
  iconLayout: "default#image",
  // iconImageHref: "img/sprites.png",

  // iconImageClipRect: [[10, 10], [54, 76]],
};

function map (coords, container) {
  container.innerHTML = "";

  ymaps.map = new ymaps.Map(container, {
    center: coords,
    zoom: 12,
    controls: ['zoomControl'],
    behaviors: ['drag']
  });
}

function clusterer () {
  ymaps.clusterer = new ymaps.Clusterer({
    clusterDisableClickZoom: true,
    clusterOpenBalloonOnClick: false,
    clusterBalloonContentLayout: 'cluster#balloonCarousel',
    clusterBalloonItemContentLayout: 'my#clustererItemLayout',
  });
  
  ymaps.map.geoObjects.add(ymaps.clusterer);
}

function createPlacemarks (placemarks = {}) {
  for (let placemark in placemarks) {
    const coords = placemark.split(",");
    const data = placemarks[placemark];

    ymaps.clusterer.add(new ymaps.Placemark(coords, data, placemarkIcon))
  }
}

async function geoLocation () {
  const result = await ymaps.geolocation.get({ provider: 'auto' });
  return result.geoObjects.position;
}

async function geoCoder (coords) {
  const geocoder = await new ymaps.geocode(coords, { results: 1 });
  return geocoder.geoObjects.get(0).properties.get('name');
}

async function openBalloon (coords) {
  ymaps.map.balloon.open(coords, 'Загрузка...', { closeButton: false });

  const comments = await api.getPlacmark(coords);
  const address = await geoCoder(coords);
  const data = {
    address,
    coords,
    comments
  };

  ymaps.map.balloon.open(coords, data, { layout: 'my#customBalloonLayout' });
}

async function openClusterer (target) {
  const coords = target.geometry.getCoordinates();

  ymaps.map.balloon.open(coords, 'Загрузка...', { closeButton: false });

  const geoObjects = target.getGeoObjects();

  for (const geoObject of geoObjects) {
    const coords = geoObject.geometry.getCoordinates();
    const comments = await api.getPlacmark(coords);
    const address = await geoCoder(coords);

    geoObject.properties.set("comments", comments).set("address", address).set("coords", coords);
  }

  ymaps.map.balloon.close(coords);
  ymaps.clusterer.balloon.open(target);
}

module.exports = {
  map,
  geoCoder,
  clusterer,
  geoLocation,
  openBalloon,
  openClusterer,
  createPlacemarks
}