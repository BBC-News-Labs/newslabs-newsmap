$(function() {
  var projection = configureProjection();
  var canvas = configureCanvas();
  var context = getContextFor(canvas);
  var path = configurePath(projection, context);

  queue().defer(d3.json, "data/world-110m.json")
    .defer(d3.tsv, "data/world-country-names.tsv")
    .await(ready);

  function ready(error, world, names) {
    var countries = configureCountries(world);

    var zoom = geoZoom(projection, function() {
      styleContextForProjection(context, projection, path, world, countries);
    });

    canvas.call(zoom).call(zoom.event);

    countries = countries.filter(function(d) {
      return names.some(function(n) {
        if (d.id == n.id) return d.name = n.name;
      });
    });

    zoomIn(countries, projection, path, canvas, zoom, null);

    $('#map canvas').on('click', function(evt) {
      var xPosition = evt.clientX;
      var yPosition = evt.clientY;

      if (shouldPlayNews == true) {
        toggleControl('play');
      }

      mapClickedAtPosition({x: evt.clientX, y: evt.clientY}, projection, function(countryName) {
        zoomIn(countries, projection, path, canvas, zoom, countryName);
      });
    });

    $('.news-control a').on('click', function(evt) {
      evt.preventDefault();
      toggleControl(this.id);

      if (shouldPlayNews == true) {
        zoomIn(countries, projection, path, canvas, zoom, null);
      }
    });
  };
  
  shouldResize();
});
