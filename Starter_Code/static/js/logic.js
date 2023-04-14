

let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

d3.json(queryUrl).then(function(data) {
    earthquakeFeatures(data.features);
});

function earthquakeFeatures(quakeData) {
    function onFeature(feature, layer) {
        layer.bindPopup
            (`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    let earthquake = L.geoJSON(quakeData, {
        onFeature: onFeature
    });

    createMap(earthquake);
}

function createMap(earthquake) {
    let street = 
}
    
    
