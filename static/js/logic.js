var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

//Perform GET request to the query URL
d3.json(url, function(data){
    //print data check
    console.log(data)
    //send data to features object to createFeatures function
    createFeatures(data);
});

function createFeatures(earthquakeData){

function onEachLayer(feature) {
    return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]],{
        radius: markerSize(feature.properties.mag),
        fillOpacity: 0.8,
        color: markerColor(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag)
    });
  }

// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature,layer){
    layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>" + feature.properties.mag + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: onEachLayer
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

//create map and layers
function createMap(earthquakes) {
    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
      });

    var litemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });
    var outsidemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    
    });
    //define baseMaps object to hold base layers
    var baseMaps = {
        "Satelite": satellitemap,
        "Lite": litemap,
        "Outdoor": outsidemap
    };

    //create overlay object to hold overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };


    //create map giving it layers to display on load
    var myMap = L.map("map",{
        center: [0.00, 0.00],
        zoom: 2,
        layers: [satellitemap, earthquakes]
    });

L.control.layers(baseMaps,overlayMaps,{
    collapsed: true
}).addto(myMap);


var info = L.control({
    positon: "bottomright"
});

info.onAdd = function() {
    var div = L.DomUtil.create("div","legend"),
    labels = ["0-1","1-2","2-3","3-4","4-5","5+"];

    for (var i = 0; i < labels.length; i++){
        div.innerHTML +- '<i style=background:' + getColor(i) + '"></i>'+
        labels[i] + '<br>';
    }
    return div;
};
    info.addTo(myMap);
};


function markerSize(mag){
    return mag ** 2;
} 

function markerColor(mag){
    if (mag <=1 ){
        return "#ADFF2F";
    }
    else if (mag <=2){
        return "#9ACD32";
    }
    else if (mag <=3){
        return "#FFFF00";
    }
    else if (mag <=4){
        return "#ffd700";
    }
    else if (mag <=5){
        return "#FFA500";
    }
    else {
        return "#FF0000";
    };
}