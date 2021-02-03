const api = require("./api.js");

async function getForm () {
  const comments = document.querySelector('[data-role=review-comments]');
  const form = document.querySelector('[data-role=review-form]');
  const name = form.querySelector('[data-role=review-name]');
  const place = form.querySelector('[data-role=review-place]');
  const text = form.querySelector('[data-role=review-text]');
  const button = form.querySelector('[data-role=review-submit]');

  const review = {
    name: name.value,
    place: place.value,
    text: text.value,
    date: new Date().toISOString().split("T")[0].split("-").reverse().join(".")
  }
  
  if (!review.name || !review.place) {
    return null;
  }

  const div = document.createElement('div');

  div.innerHTML = `
    <div class="comments__comment">
      <div>
        <strong>${review.name}</strong>
        <span>${review.place}</span>
      </div>
      <small>${review.date}</small>
    </div>
    <div>${review.text}</div>
  `;

  comments.append(div);
  comments.scrollTo(0, comments.scrollHeight);

  const response = await api.setPlacmark(button.dataset.coords, review)

  name.value = place.value = text.value = "";

  return response;
}

module.exports = {
  getForm
}