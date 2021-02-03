const container = document.querySelector('#map');
const interactiveMap = require('./js/interactiveMap.js');
const events = require('./js/events.js');
const api = require('./js/api.js');

ymaps.ready(async () => {
  console.log('Ymaps ready');
  
  const customClustererItemLayout = document.getElementById('customClustererItemLayout').innerHTML;
  const customBalloonTemplate = document.getElementById('customBalloonTemplate').innerHTML;

  const clustererItemLayout = ymaps.templateLayoutFactory.createClass(customClustererItemLayout);
  const balloonTemplate = ymaps.templateLayoutFactory.createClass(customBalloonTemplate, {
    build: function () {
      this.constructor.superclass.build.call(this);
      this._$element = $('.popover', this.getParentElement());
      this.applyElementOffset();
      this._$element.find('.close').on('click', $.proxy(this.onCloseClick, this));
    },
    clear: function () {
        this._$element.find('.close').off('click');
        this.constructor.superclass.clear.call(this);
    },
    onSublayoutSizeChange: function () {
      balloonTemplate.superclass.onSublayoutSizeChange.apply(this, arguments);

      if(!this._isElement(this._$element)) {
        return;
      }

      this.applyElementOffset();
      this.events.fire('shapechange');
    },
    applyElementOffset: function () {
      this._$element.css({
        left: -(this._$element[0].offsetWidth / 2),
        top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
      });
    },
    onCloseClick: function (e) {
      e.preventDefault();

      this.events.fire('userclose');
    },
    getShape: function () {
      if(!this._isElement(this._$element)) {
        return MyBalloonLayout.superclass.getShape.call(this);
      }

      var position = this._$element.position();

      return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
        [position.left, position.top], [
          position.left + this._$element[0].offsetWidth,
          position.top + this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight
        ]
      ]));
    },
    _isElement: function (element) {
      return element && element[0] && element.find('.arrow')[0];
    }
  });

  ymaps.layout.storage.add('my#customBalloonLayout', balloonTemplate);
  ymaps.layout.storage.add('my#clustererItemLayout', clustererItemLayout);

  try {
    const coords = await interactiveMap.geoLocation();
    const placemarks = await api.getPlacmarks();

    interactiveMap.map(coords, container);
    interactiveMap.clusterer();
    interactiveMap.createPlacemarks(placemarks)
  
    events.click();
  } catch (error) {
    console.log(error);
  }
});