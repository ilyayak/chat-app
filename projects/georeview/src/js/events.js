const interactiveMap = require('./interactiveMap.js');
const dom = require('./dom.js');

function onMapClick (e) {
  const coords = e.get('coords');

  interactiveMap.openBalloon(coords);
}

async function onGeoObjectsClick (e) {
  const target = e.get('target');
  const coords = target.geometry.getCoordinates();
  const geoObjects = target.properties.get('geoObjects', null);

  if (!geoObjects) {
    interactiveMap.openBalloon(coords);
  } else {
    interactiveMap.openClusterer(target);
  }
}

async function onDomClick (e) {
  e.preventDefault();

  switch (e.target.dataset.role) {
    case 'review-close':
      ymaps.map.balloon.close();
    break;
    case 'clusterer-link':
      const coords = e.target.dataset.coords.split(",");
      interactiveMap.openBalloon(coords)
    break;
    case 'review-submit':
      const response = await dom.getForm();

      if (response) {
        interactiveMap.createPlacemarks(response)
      }
    break;
  }
}

function click () {
  ymaps.map.events.add('click', onMapClick);
  ymaps.map.geoObjects.events.add('click', onGeoObjectsClick);
  document.body.addEventListener('click', onDomClick);
}

module.exports = {
  click
}