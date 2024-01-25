# Vacation Spot Picker
Have you ever struggled to decide on a place to go on vacation? My family can never decide where to go, which inspired me to create an app that allowed all of us to choose our own places without having to vet them with everyone else first.
We even used it to plan our next trip!

## Getting Started
* Must have NodeJS v18.17.0 or later installed ([available here](https://nodejs.org/en/download/))
* Clone into repo and run `npm i` inside the project directory
* [Follow Google's steps](https://developers.google.com/maps/get-started) to create a Google Cloud account and create a new Google Maps Platform project on the account (don't worry, you won't have to pay even though billing must be enabled)
  * Now that your project is created, take your specific api key from the Keys & Credentials tab and copy it down
  * Open `travel-picker\public\index.html` and find line 23 as shown below. Paste your api key over `<Your_Api_Key>` in the code, then save the change\
  ```src="https://maps.googleapis.com/maps/api/js?key=<Your_API_Key>&callback=initMap&v=weekly"```
* Run `npm start` inside the project directory

## How To Use
After starting the application, the first person in your group can navigate the map using the mouse. Clicking a country will populate the input textbox with the name of that country. Typing the name of a city into the textbox and clicking the button that says
"Geocode" will place a marker on the city and populate the textbox with the city and country. Once you have selected a city or country, click the "Add to List" button to add it to your list of vacation destinations. You can select as many cities
and countries as you'd like. Once you're done, click the "Next Person" button and pass the control over to someone else to repeat the process. When everyone is finished, you can click "All Done" and a screen will show you what places you all
(or at least some of you) would like to travel to! Clicking anywhere on the splash screen will start again.\
![](https://github.com/rgursky/vacation-spot-picker/blob/master/demo.gif)
\
Happy travels!
