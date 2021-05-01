var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function markerSize(mag){
    return mag * 300000;
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

//Perform GET request to the query URL
d3.json(url, function(data){
    //send data to features object to createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData){
// Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}


function createMap(earthquakes) {
    var satelitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        id: "dark-v9",
        accessToken: API_KEY
    
    });
    //define baseMaps object to hold base layers
    var baseMaps = {
        "Satelite Map": satelitemap,
        "Dark Map": darkmap
    };

    //create overlay object to hold overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };


    //vreate map giving it layers to display on load
    var myMap = L.map("map",{
        center: [37.09, -95.71],
        zoom: 2,
        layers: [satelitemap, earthquakes]
    });

L.control.layers(baseMaps,overlayMaps,{
    collapsed: true
}).addto(myMap);

}
