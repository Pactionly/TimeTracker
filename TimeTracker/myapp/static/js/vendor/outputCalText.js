//This file is based off of Google API Reference guides - https://developers.google.com/api-client-library/javascript/reference/referencedocs
// Client ID and API key from the Developer Console
var CLIENT_ID = '1081502536351-6pojc00bl8ntbe0htg97f8k7b02ieu3g.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDHv1UgXbh5vw2d94ybdQ2Xcg9UJGfgu48';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
*  On load, called to load the auth2 library and API client library.
*/
function handleClientLoad() {
gapi.load('client:auth2', initClient);
}

/**
*  Initializes the API client library and sets up sign-in state
*  listeners.
*/
function initClient() {
gapi.client.init({
  apiKey: API_KEY,
  clientId: CLIENT_ID,
  discoveryDocs: DISCOVERY_DOCS,
  scope: SCOPES
}).then(function () {
  /** Listen for sign-in state changes.
  *  listen() passes the current state of the user 
  *  (true for signed in) as an argument to the updateSigninStatus function on line 51 
  *  getAuthInstance returns a GoogleAuth object which restores users sign in state from the previous session.
  */
  gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

  // Handle the initial sign-in state.
  // This handles the loading of the correct button if the status wasn't changed between page loads
  updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  authorizeButton.onclick = handleAuthClick;
  signoutButton.onclick = handleSignoutClick;
}, function(error) {
  //appendPre(JSON.stringify(error, null, 2));
   console.log('Error Initializeing Javascript Client');
});
}

/**
*  Called when the signed in status changes, to update the UI
*  appropriately. After a sign-in, the API is called.
*  Authorize is default to on in the html which is why the button always appears as authorize
*  before switching to sign out if necessary.
*/
function updateSigninStatus(isSignedIn) {
if (isSignedIn) {
  authorizeButton.style.display = 'none';
  signoutButton.style.display = 'block';
  listUpcomingEvents();
//  var pre = document.getElementById('content');
//  if(pre.hasChildNodes() == false){
//  appendPre("Authorize Google Calendar Use");
//  }
} else {
  authorizeButton.style.display = 'block';
  signoutButton.style.display = 'none';
  var pre = document.getElementById('content');
  if(pre.hasChildNodes() == false){
  appendPre("Authorize Google Calendar Use");
  }
//  appendPre("Authorize Google Calendar Use");
}
}

/**
*  Sign in the user upon button click.
*/
function handleAuthClick(event) {
gapi.auth2.getAuthInstance().signIn();
var pre = document.getElementById('content');
pre.removeChild(pre.childNodes[0]);
}

/**
*  Sign out the user upon button click.
*/
function handleSignoutClick(event) {
gapi.auth2.getAuthInstance().signOut();
var pre = document.getElementById('content');
if ( pre.hasChildNodes() )
{
    var nodeCount = pre.childNodes.length;
    for(var i=0; i < nodeCount; i++)
    {
//            var values = pre.childNodes[1].textContent;
//            alert('the value is:' + values);
            pre.removeChild(pre.childNodes[0]);
    } 
}
if(pre.hasChildNodes() == false){
appendPre("Authorize Google Calendar Use");
}
}

/**
* Append a pre element to the body containing the given message
* as its text node. Used to display the results of the API call.
*
* @param {string} message Text to be placed in pre element.
*/
function appendPre(message) {
//document.getElementById('content').style.color = "blue";
var pre = document.getElementById('content');

var res = message.split("(");
var status = res[2];
//alert(status);

var textContent = document.createTextNode(res[0] + '\n');
var textContent2 = document.createTextNode(res[1] + '\n');

var node = document.createElement("LI");
node.appendChild(textContent);
node.appendChild(textContent2);

var att = document.createAttribute("style");
var att2 = document.createAttribute("class");
if(status == "Finished"){
att.value = "list-style-type: none; border-style: solid; border-radius: 25px; padding: 20px; background: #C0C0C0; height: 75px; color: black;"; 
}
else if(status == "Upcoming"){
att.value = "list-style-type: none; border-style: solid; border-radius: 25px; padding: 20px; background: #73AD21; height: 75px; color: black;"; 
}
else{
att.value = "list-style-type: none; border-style: solid; border-radius: 25px; padding: 20px; background: #2060ad; height: 75px; color: black;"; 
}
att2.value = "no-bullets";
node.setAttributeNode(att);
node.setAttributeNode(att2);

pre.appendChild(node);
}

/**
* Print the summary and start datetime/date of the next ten events in
* the authorized user's calendar. If no events are found an
* appropriate message is printed.
* timeMin says that the earliest event that can be printed must be after the current date and time
*/

var testToday = new Date();
testToday.setHours(0,0,0,0);
var testISO = testToday.toISOString();

function listUpcomingEvents() {
var today = getCurrentDate();
gapi.client.calendar.events.list({
  'calendarId': 'primary',
//  'timeMin': (new Date()).toISOString(),
  'timeMin': testISO, 
  'showDeleted': false,
  'singleEvents': true,
  'maxResults': 10,
  'orderBy': 'startTime'
}).then(function(response) {
  var events = response.result.items;
  var pre = document.getElementById('content');
  //appendPre('Upcoming events:');

  if (events.length > 0) {
    for (i = 0; i < events.length; i++) {
      var event = events[i];
      var when = event.start.dateTime;
      var date = new Date(when);
      //alert("Start: " + date);
      
      var end = event.end.dateTime;
      var endDate = new Date(end);
      //alert("End: " + endDate);
      var status = eventStatus(date, endDate); 
      

      var isToday = date.toString().substring(0, 10);

      if(isToday == today){
      var dateNoTime = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
      var time = getClockTime(date);
      var endTime = getClockTime(endDate);

      if (!when) {
	when = event.start.date;
      }

      appendPre(event.summary + ' (' + ' ' + time + ' - ' + endTime + '(' + status );
      }
    }
  } else {
    appendPre('No upcoming events found.');
  }
});
}

function getClockTime(now){
   var hour   = now.getHours();
   var minute = now.getMinutes();
   var second = now.getSeconds();
   var ap = "AM";
   if (hour   > 11) { ap = "PM";             }
   if (hour   > 12) { hour = hour - 12;      }
   if (hour   == 0) { hour = 12;             }
   if (hour   < 10) { hour   = "0" + hour;   }
   if (minute < 10) { minute = "0" + minute; }
   if (second < 10) { second = "0" + second; }
   var timeString = hour + ':' + minute + ':' + second + " " + ap;
   return timeString;
}

function getCurrentDate(){
  var today = new Date();
  var subToday = today.toString().substring(0, 10);
  return subToday;
}

function eventStatus(startTime, endTime){
  var today = new Date();
  var rightNow = today.getTime();
  var beginEvent = startTime.getTime();
  var endEvent = endTime.getTime();
  var status = "";
  if(rightNow > beginEvent && rightNow < endEvent){
    status = "InProgress";
  }
  else if(rightNow < beginEvent){
    status = "Upcoming";
  }
  else if(rightNow > endEvent){
    status = "Finished";
  }
  return status;
}
