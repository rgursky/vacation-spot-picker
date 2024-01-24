/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

/* Geocoding JS google map api example can be found here:
https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple?csw=1#maps_geocoding_simple-javascript */

import './index.css';
import reportWebVitals from './reportWebVitals';

let map;
let marker;
let geocoder;
let responseDiv;
let response;
let resultScreen;
let resultScreenDiv;
var currentPerson = new Array();
var allPersons = new Array(Array());

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 3,
    center: { lat: 0, lng: 0 },
    mapTypeControl: false,
  });
  geocoder = new google.maps.Geocoder();

  const inputText = document.createElement("input");

  inputText.type = "text";
  inputText.id = "input-text";
  inputText.placeholder = "Enter a location";

  const submitButton = document.createElement("input");

  submitButton.type = "button";
  submitButton.value = "Geocode";
  submitButton.classList.add("button", "button-primary");

  const clearButton = document.createElement("input");

  clearButton.type = "button";
  clearButton.value = "Clear";
  clearButton.classList.add("button", "button-secondary");

  const addButton = document.createElement("input");

  addButton.type = "button";
  addButton.value = "Add to List";
  addButton.classList.add("button", "button-final");

  const nextButton = document.createElement("input");

  nextButton.type = "button";
  nextButton.value = "Next Person";
  nextButton.classList.add("button", "button-next");

  const doneButton = document.createElement("input");

  doneButton.type = "button";
  doneButton.value = "All Done!";
  doneButton.classList.add("button", "button-done");

  const undoButton = document.createElement("input");

  undoButton.type = "button";
  undoButton.value = "Undo Last Entry";
  undoButton.classList.add("button", "button-undo");

  response = document.createElement("pre");
  response.id = "response";
  response.innerText = "";
  responseDiv = document.createElement("div");
  responseDiv.id = "response-container";
  responseDiv.appendChild(response);

  resultScreen = document.createElement("pre");
  resultScreen.id = "response-screen";
  resultScreen.innerText = "";
  resultScreenDiv = document.createElement("div");
  resultScreenDiv.id = "response-screen-container";
  resultScreenDiv.appendChild(resultScreen);

  const instructionsElement = document.createElement("p");

  instructionsElement.id = "instructions";
  instructionsElement.innerHTML =
    "<strong>Instructions</strong>: Click on the map to select an entire country, or type the name of a city and click \"Geocode\" to select that city.<br />Click \"Add to List\" to add that place to your list, then \"Next Person\" to move on to the next person in the group.<br />Once everyone has gone, click \"All Done!\" to see your results!";
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(clearButton);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(addButton);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(undoButton);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(nextButton);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(doneButton);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(instructionsElement);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(responseDiv);
  marker = new google.maps.Marker({
    map,
  });
  map.addListener("click", (e) => {
    geocode({ location: e.latLng }, false);
  });
  submitButton.addEventListener("click", () =>
    geocode({ address: inputText.value }, true),
  );
  addButton.addEventListener("click", () =>
    addToList(),
  );
  nextButton.addEventListener("click", () =>
    nextPerson(),
  );
  undoButton.addEventListener("click", () =>
    removeFromList(),
  );
  doneButton.addEventListener("click", function(e) {
    e.stopPropagation(); // don't allow the reset to happen if we hit the done button
    allDone();
  }
  );
  // TODO: figure out a way to remove this hideous event listener
  // This is so you can click anywhere on the display splash screen to restart the program
  document.addEventListener("click", () => {
    if (document.getElementById("response-screen-container").style.display == "block") {
      restart();
    }
  });
  clearButton.addEventListener("click", () => {
    clear();
  });
  clear();
}

function clear() {
  marker.setMap(null);
  responseDiv.style.display = "none";
  if ( document.getElementById("input-text") != null) {
    document.getElementById("input-text").value = "";
  }
}

function geocode(request, flag) {
  // flag checks if this was a geocode or not
  var city;
  var country;
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;

      map.setCenter(results[0].geometry.location);
      marker.setPosition(results[0].geometry.location);
      marker.setMap(map);

      for (var i = 0; i < results.length; i++) {
        for (var j = 0; j < results[i]['address_components'].length; j++) {
          if (results[i]['address_components'][j]['types'][0] == "country" && results[i]['address_components'][j]['types'][1] == "political") {
            country = results[i]['address_components'][j]['long_name'];
          }
          else if (results[i]['address_components'][j]['types'][0] == "locality" && results[i]['address_components'][j]['types'][1] == "political") {
            city = results[i]['address_components'][j]['long_name'];
          }
        }
      }
      if (flag) {
        document.getElementById("input-text").value = city + ", " + country;
      } else {
        document.getElementById("input-text").value = country;
      }
      return results;
    })
    .catch((e) => {
      alert("Geocode was not successful for the following reason: " + e);
    });
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function addToList() {
  // Add from the input box a country or typed in city to visit
  var place = document.getElementById("input-text").value.split(",");
  if (place.length > 2) {
    tempAlert("Oops! Please enter your destination as City, Country", 5000);
  } else {
    if (place.length > 1) {
      if (!currentPerson.includes("[" + place[0] + ", " + place[1] + "]")) {
        currentPerson.push("[" + place[0] + ", " + place[1] + "]");
        tempAlert("Added " + place[0] + ", " + place[1] + " to your list!", 2000)
      }
      if (!currentPerson.includes(place[1])) {
        currentPerson.push(place[1]);
      }
    } else {
      if (!currentPerson.includes(place[0])) {
        currentPerson.push(place[0]);
        tempAlert("Added " + place[0] + " to your list!", 2000);
      }
    }
  }
}

function removeFromList() {
  // Remove the last place from the list
  let removed;
  if (currentPerson != undefined) {
    removed = currentPerson.pop();
  }
  if (removed != undefined) {
    tempAlert("Removed " + removed + " from your list!", 2000);
  } else {
    tempAlert("Your list is already empty!", 2000);
  }
}

function nextPerson() {
  // Add the current places array to the total array and continue
  allPersons.push(currentPerson);
  currentPerson = [];
  tempAlert("Moved to the next person!", 2000);
  clear();
}

function allDone() {
  // Check what places are the same across all people and display them
  var matchingPlaces = [];
  var closePlaces = [];
  var counts = {};
  let resultText;

  // if (currentPerson.length > 0) {
  //   allPersons.push(currentPerson);
  // }
  if (currentPerson != undefined) {
    if (currentPerson.length > 0) {
      allPersons.push(currentPerson);
    }
  }

  for (var i = 1; i < allPersons.length; i++) {
    for (var j = 0; j < allPersons[i].length; j++) {
      var place = allPersons[i][j];
      counts[place] = counts[place] ? counts[place] + 1 : 1;
    }
  }
  for (var place in counts) {
    if (counts[place] == allPersons.length - 1) {
      matchingPlaces.push(place);
    }
    else if (counts[place] > (allPersons.length - 1) / 2) {
      closePlaces.push(place);
    }
  }

  // if (matchingPlaces.length < 1) {
  //   if (closePlaces.length < 1) {
  //     resultText = "Sorry, no places were even a close match! You might have to talk this one out :D";
  //   } else {
  //     resultText = "We didn't have any exact matches, but here are some places that came close!\n" + closePlaces;
  //   }
  // } else {
  //   resultText = "Here's some places you all want to go!\n" + matchingPlaces;
  // }

  // Above code won't show close matches if any number of exact matches is found.
  // Replacing with code to show both exact matches and close matches

  if (closePlaces.length >= 1 || matchingPlaces.length >= 1) {
    if (matchingPlaces.length >= 1) {
      resultText = "Here's some places you all want to go!\n" + matchingPlaces;
    }
    if (closePlaces.length >= 1) {
      if (resultText.length > 1) {
        resultText += "\n\nAnd here are some places that weren't exact matches, but came close!\n" + closePlaces;
      } else {
        resultText = "Here are some places that weren't exact matches, but came close!\n" + closePlaces;
      }
    } 
  } else {
    resultText = "Sorry, no places were even a close match! You might have to talk this one out :D";
  }

  document.getElementById("response-screen-container").style.display = "block";
  document.getElementById("response-screen").style.display = "block";
  document.getElementById("response-screen").innerText = resultText + "\n\nClick anywhere to start again!";
}

function restart() {
  //reset arrays, remove results screen
  if (document.getElementById("response-screen-container").style.display == "block") {
    document.getElementById("response-screen-container").style.display = "none";
    document.getElementById("response-screen").style.display = "none";
    currentPerson = [];
    allPersons = [[]];
    clear();
  }
}

function tempAlert(msg,duration)
{
 var el = document.createElement("div");
 el.setAttribute("style","position:absolute;top:0%;left:50%;background-color:white;");
 el.innerHTML = msg;
 setTimeout(function(){
  el.parentNode.removeChild(el);
 },duration);
 document.body.appendChild(el);
}

window.initMap = initMap;

reportWebVitals();
