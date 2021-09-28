// API Endpoint
var earthquakeJSON = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"

// Get Request
d3.json(earthquakeJSON, function(data) {
 
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {


  // Popup
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +
      "</h3><i>Reported "+ feature.properties.place + " </i><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // GeoJson Layer
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var color;
      var r = 255;
      var g = Math.floor(255-35*feature.properties.mag);
      var b = 0;
      color= "rgb("+r+" ,"+g+","+ b+")"
      
      var geojsonMarkerOptions = {
        radius: 10*feature.properties.mag,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity:1
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });


  // Create Map
  createMap(earthquakes);
  
}

function createMap(earthquakes) {

  // Define map & layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoiam9leWhlcnplciIsImEiOiJja3UyMzFvMWkxZ2dsMndvcXkzdzU1Mzl4In0.UwUGnTZbqh6UxK8iz_JfQw");


  var baseMaps = {
    "Street Map": streetmap
  };


  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      36.77, -119.42
    ],
    zoom: 6,
    layers: [streetmap, earthquakes]
  });


  function getColor(d) {
      return d < 1 ? 'rgb(0,255,76)' :
            d < 2  ? 'rgb(170,255,0)' :
            d < 3  ? 'rgb(229,255,0)' :
            d < 4  ? 'rgb(255,247,0)' :
            d < 5  ? 'rgb(255,170,0)' :
            d < 6  ? 'rgb(255,135,0)' :
            d < 7  ? 'rgb(255,55,0)' :
            d < 8  ? 'rgb(255,25,0)' :
            d < 9  ? 'rgb(255,0,0)' :
                        'rgb(163,0,0)';
  }

  // Create legend
  var legend = L.control({position: 'bottomleft'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
      labels = [];

      div.innerHTML+='<b>Earthquake Magnitude</b><br>'
  
      // loop through intervals and create square for legend
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(myMap);

}