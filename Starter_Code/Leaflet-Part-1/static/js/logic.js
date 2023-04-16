
// Add the tile layers
let osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let satellite = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZXBpZGVtaWtzIiwiYSI6IjczZDdjYTc2MGFlMjc0ZDMyZGFjN2QzYzkyMzk0NWFiIn0.LOJX9JHM9Nox2_vHPx-OQg', {
	attribution: '&copy; ',
	subdomains: 'abcd',
	maxZoom: 19
    
});
    
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> |Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
    


    // Create a baseMaps object
    let baseMaps = {
        "Open Street Map": osm,
        "Satellite": satellite,
        "Topographic": topo
    };
    

    // Create an overlay object to hold our overlay
    let earthquake = new L.layerGroup();

    let overlay = {
        Earthquakes: earthquake
    };


    // Create the map object with defualt display
    let myMap = L.map("map", {
        center: [40.09, -91.71],
        zoom: 3.4,
        layers: [osm, earthquake]
    });


    // Create a layer control and add baseMaps and overlay to the map object
    L.control.layers(baseMaps, overlay, {
      collapsed: false
    }).addTo(myMap);




// Load the data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
        
d3.json(url).then(function(data) {
    feature = data.features;

    function style(feature) {
      return {
      color: "black",
      fillColor: getColor(feature.geometry.coordinates[2]),
      radius: getRadius(feature.properties.mag),
      opacity: 0.5,
      fillOpacity: 1,
      stroke: true

      }
    }

    function getRadius(mag) {
      if (mag <= 2.4) {
        return 1;
      };
      return mag * 3;
    }


    // Popup function to display features
    function bindPopup(feature, layer) {
        layer.bindPopup
        ("Location: " + feature.properties.place 
        + "<br>Magnitude: " + feature.properties.mag 
        + "<br>Depth: " + feature.geometry.coordinates[2]
        );
    }


        // Get color of the earthquake marker
        function getColor(depth) { 
            if (depth >= 91) return "#db0a0a"
            else if (depth >= 71) return "#837af6"
            else if (depth >= 51) return "#4eb8d2"
            else if (depth >= 31) return "#d06ef3"
            else if (depth >= 11) return "#f6759f"
            else if (depth >= -10) return "#f6d35f"
                 
        }


        L.geoJSON(feature, {

          style: style,
          onEachFeature: bindPopup,
          pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
          }
        }).addTo(earthquake);
          
        earthquake.addTo(myMap);


        // Create the legend
        let legend = L.control({position: "bottomright"});

        legend.onAdd = function() {
          let div = L.DomUtil.create('div', 'info legend');


      const grade = [-10, 10, 30, 50, 70, 90];
      const colors = [
        "#db0a0a",
        "#837af6",
        "#4eb8d2",
        "#d06ef3",
        "#f6759f",
        "#f6d35f"
       ];

      //loop through our intervals and generate a labels with a colored square for each
      for (let i =0; i < grade.length; i++) {
        console.log(colors[i]);
      div.innerHTML +=
       "<i style='background: " + colors[i] + "'></i> " +
       grade[i] + (grade[i + 1] ? "&ndash;" + grade[i + 1] + "<br>" : "+");

      }

      return div;
    };

    legend.addTo(myMap);

      
});
    
    
