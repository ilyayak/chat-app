const database = {
  "40.667197,22.873136": [
    { name: 'Сергей Мелюков', place: 'Красный куб', date: '12.12.2015', text: 'Ужасное место! Кругом зомби!!!!' },
    { name: 'svetlana', place: 'Шоколадница', date: '13.12.2015', text: 'Очень хорошее место!' },
    { name: 'Stelios Baglaridis', place: 'Кафе-бар "Calypso"', date: '20.10.2019', text: 'Очень хорошее место!' },
  ],
  "40.660295,22.938367":  [
    { name: "Сергей", place: "Кофемания", text: "Очень вкусно" },
    { name: "Андрей", place: "Кофемания", text: "Согласен с Сергеем" }
  ],
};

// localStorage.setItem('placemarks', JSON.stringify(database));

const delay = 500;

function _toString (coords) {
  if(Array.isArray(coords)) {
    coords = coords.join(",");
  }

  return coords;
}

function getPlacmarks () {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(JSON.parse(localStorage.getItem('placemarks')));
    }, delay)
  });
}

async function getPlacmark (coords) {
  coords = _toString(coords);

  const placemarks = JSON.parse(localStorage.getItem('placemarks') || '{}');
  const placemark = placemarks[coords] ? placemarks[coords] : null;

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(placemark)
    }, delay)
  });
}

async function setPlacmark (coords, payload) {
  coords = _toString(coords);

  const placemarks = JSON.parse(localStorage.getItem('placemarks') || '{}');
  let status = false;
  
  if (placemarks[coords]) {
    placemarks[coords].push(payload);
  } else {
    placemarks[coords] = [payload];
    status = true;
  }

  return new Promise(resolve => {
    setTimeout(() => {
      localStorage.setItem('placemarks', JSON.stringify(placemarks));
      resolve(status ? { [coords]: placemarks[coords] } : null);
    }, delay)
  });
}

module.exports = {
  getPlacmarks,
  getPlacmark,
  setPlacmark
}