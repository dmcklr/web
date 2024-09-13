var entries = []

fetch('https://api.raceresult.com/308782/0NZAW2WISCE2E7II2EXW61DSQDT0KXBB')
  .then(response => {
    // Check if the response is OK (status 200)
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json(); // Parse the JSON data from the response
  })
  .then(data => {
    entries = data;
    checkFilterStatus()   
    

  })
  .catch(error => {
    // Log any error to the console
    console.error('There was a problem with the fetch operation:', error);
  });



var map = L.map('map').setView([15, 8.5], 2.5); // initialize the map itself
var flagLayer = null; 

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  continuousWorld: false
}).addTo(map);

function initializeMap(filteredEntries) {  
  if (!map) {
    return;
  }
  if (!flagLayer) {
    flagLayer = L.layerGroup();
  } else {
    flagLayer.clearLayers();
  }
  if (!Array.isArray(filteredEntries) || filteredEntries.length === 0) {
    return;
  }
  filteredEntries.forEach(function(e) {    
    var imageUrl = 'flag_' + e.type + '.png';
    var gps = e.gps;
    var gpsArray = gps.split(',').map(coord => parseFloat(coord.trim()));  
    if (gpsArray.length !== 2 || isNaN(gpsArray[0]) || isNaN(gpsArray[1])) {
      console.error("Invalid GPS coordinates for entry:", e.name);
      return;
    }
    var customFlag = L.icon({
      iconUrl: imageUrl,
      iconSize: [40, 50], 
      iconAnchor: [0, 50]       
    });
    var flagMarker = L.marker(gpsArray, { icon: customFlag });
    flagLayer.addLayer(flagMarker);
    var popupContent = "<div>" + e.name + "</div>";
    flagMarker.bindPopup(popupContent);
  });
  flagLayer.addTo(map); 
}

var checkedFeatures = []
let checkedTypes = []

function checkFilterStatus() {
  var checkedFeatures = []
let checkedTypes = []
  $("#features input").each(function() {
    var name = $(this).attr("name")
    $(this).prop("checked") ? checkedFeatures.push(name) : ""
  });
  $("#types input").each(function() {
    var name = $(this).attr("name")
    $(this).prop("checked") ? checkedTypes.push(name) : ""
  });

  filterEntries(entries, checkedTypes, checkedFeatures)
 
}

$("#features input, #types input").change(function() {
  checkFilterStatus()
});



function filterEntries(entries, checkedTypes, checkedFeatures) {
  // Create an empty array to hold the filtered entries
  var filteredEntries = [];
  
  // Iterate over each entry in the entries array
  entries.forEach(function(entry) {
    // Check if the entry's type is in the checkedTypes array
    var typeMatches = checkedTypes.includes(entry.type);
    
    // Check if all checkedFeatures are true for the entry
    var featuresMatch = checkedFeatures.every(function(feature) {
      return entry[feature] === true;
    });
    
    // If both conditions are met, add the entry to the filteredEntries array
    if (typeMatches && featuresMatch) {
      filteredEntries.push(entry);
    }
  });  
  //console.log(filteredEntries);
  initializeMap(filteredEntries)

}
