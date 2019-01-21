/* PART 1: This part is more or less lifted as is from Google APIs documentation
and examples. I have made slight changes to the handleAuthResult function,
in order to toggle on/off the visibility of two buttons of the user interface.
*/

// Global variables, the values come from the Developer Console
// Put your OWN clientID and apiKey
      
var CLIENT_ID= '1081502536351-6pojc00bl8ntbe0htg97f8k7b02ieu3g.apps.googleusercontent.com';
var API_KEY= 'AIzaSyDHv1UgXbh5vw2d94ybdQ2Xcg9UJGfgu48';
      
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var addButton = document.getElementById('addToCalendar');
addButton.style.visibility = 'visible';

/**
*  On load, called to load the auth2 library and API client library.
*/
function handleClientLoad() {
gapi.load('client:auth2', initClient);
}

function initClient() {
gapi.client.init({
  apiKey: API_KEY,
  clientId: CLIENT_ID,
  discoveryDocs: DISCOVERY_DOCS,
  scope: SCOPES
}).then(function () {
  // Listen for sign-in state changes.
  //listen() passes the current state of the user
  //(true for signed in) as an argument to the updateSigninStatus function on line 51
  gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

  // Handle the initial sign-in state.
  // This handles the loading of the correct button if the status wasn't changed between page loads
  updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  authorizeButton.onclick = handleAuthClick;
  signoutButton.onclick = handleSignoutClick;
  addButton.onclick = addButtonClick;
}, function(error) {
  appendPre(JSON.stringify(error, null, 2));
});
}


function updateSigninStatus(isSignedIn) {
if (isSignedIn) {
  authorizeButton.style.display = 'none';
  signoutButton.style.display = 'block';
} else {
  authorizeButton.style.display = 'block';
  signoutButton.style.display = 'none';
}
}

function handleAuthClick(event) {
gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
gapi.auth2.getAuthInstance().signOut();
}

function addButtonClick(event) {
  var userChoices = getUserInput();
  console.log(userChoices);
  if (userChoices)
    createEvent(userChoices);
}

function getUserInput(){
 
  var date = document.querySelector("#date").value;
  var startTime = document.querySelector("#start").value;
  var endTime = document.querySelector("#end").value;
  var eventDesc = document.querySelector("#event").value;
 
  // check input values, they should not be empty
  if (date=="" || startTime=="" || endTime=="" || eventDesc==""){
    alert("All your input fields should have a meaningful value.");
    return
  }
  else return {'date': date, 'startTime': startTime, 'endTime': endTime,
               'eventTitle': eventDesc}
}


// Make an API call to create an event.  Give feedback to user.
function createEvent(eventData) {
  // First create resource that will be send to server.
    var resource = {
        "summary": eventData.eventTitle,
        "start": {
          "dateTime": new Date(eventData.date + " " + eventData.startTime).toISOString()
        },
        "end": {
          "dateTime": new Date(eventData.date + " " + eventData.endTime).toISOString()
          }
        };
    // create the request
    var request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': resource
    });

    // execute the request and do something with response
    request.execute(function(resp) {
      console.log(resp);
      var signedIn = gapi.auth2.getAuthInstance().isSignedIn.get()
      if (signedIn) {
        alert("Your event was added to the calendar.");
      }
      else {
        alert("Please Sign In to Access Your Google Calendar");
      }
    });
}

