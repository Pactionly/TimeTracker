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
     console.log('Error Initializing Javascript Client');
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
    listCalendarsDropdown();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    var list = document.getElementById('content');

    if(list.hasChildNodes() == false){
    appendList("Authorize Google Calendar Use");
    }
  }
}

/**
*  Sign in the user upon button click.
*/

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
  var list = document.getElementById('content');
  list.removeChild(list.childNodes[0]);
}

/**
*  Sign out the user upon button click.
*/

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
  clearEventList();
  if(list.hasChildNodes() == false){
  appendList("Authorize Google Calendar Use");
  }
}

/**
* Append a list element to the body containing the given message
* as its text node. Used to display the results of the API call.
*
* @param {string} message Text to be placed in list element.
*/

function appendList(message) {
  var list= document.getElementById('content');

  var res = message.split("(");
  var status = res[2];

  var textContent = document.createTextNode(res[0] + '\n');
  var textContent2 = document.createTextNode(res[1] + '\n');

  var node = document.createElement("LI");
  node.appendChild(textContent);
  node.appendChild(textContent2);

  var att = document.createAttribute("style");
  var att2 = document.createAttribute("class");
  att2.value = "no-bullets";
  if(status == "Finished"){
    att.value = "list-style-type: none; border-style: solid; border-radius: 25px; padding: 20px; background: #C0C0C0; height: 75px; color: black;"; 
  }
  else if(status == "Upcoming"){
    att.value = "list-style-type: none; border-style: solid; border-radius: 25px; padding: 20px; background: #73AD21; height: 75px; color: black;"; 
  }
  else{
    att.value = "list-style-type: none; border-style: solid; border-radius: 25px; padding: 20px; background: #2060ad; height: 75px; color: black;"; 
  }
  node.setAttributeNode(att);
  node.setAttributeNode(att2);

  list.appendChild(node);
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
listCalendars();
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
  var list = document.getElementById('content');

  if (events.length > 0) {
    for (i = 0; i < events.length; i++) {
      var event = events[i];
      var when = event.start.dateTime;
      var date = new Date(when);
      
      var end = event.end.dateTime;
      var endDate = new Date(end);

      var status = eventStatus(date, endDate); 
      

      var isToday = date.toString().substring(0, 10);

      if(isToday == today){
      var dateNoTime = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
      var time = getClockTime(date);
      var endTime = getClockTime(endDate);

      if (!when) {
	when = event.start.date;
      }

      appendList(event.summary + ' (' + ' ' + time + ' - ' + endTime + '(' + status );
      }
    }
  } else {
    appendList('No upcoming events found.');
  }
});
}

//Adapted from https://stackoverflow.com/questions/5507989/javascript-clock-update-on-the-minute-help
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

function listCalendars()
{
     var request = gapi.client.calendar.calendarList.list();
     var num;
     request.execute(function(resp){
             var calendars = resp.items;
             console.log(calendars);
             console.log(calendars.length);
             num = calendars.length;
             console.log(num);
//             console.log(calendars[0].id);
//Above gets the id of the first calendar in the calendar list. You can see what other elements are accessible from the calendar lists in the calendar
//objects by going to the console.

/**
 * Use above and the length function to get the list of how many calendars it's possible to access.
 * Iterate through the array of calendars, look at the id's and use the split function to single out calendars ending with liatrio.com
 * after the @.
 * With this information, allow the user to click (preferably with check boxes) which calendars they want to display in todays events list
 * The way promises work you can't access data directly out of them. You can however call functions inside of them so you might be able to set
 * a global variable inside a function.
 */

     });
}

function listCalendarsDropdown(){
     var request = gapi.client.calendar.calendarList.list();
     request.execute(function(resp){
             var calendars = resp.items;
             console.log(calendars);
             console.log(calendars.length);
             var i;
             for(i=0;i<calendars.length;i++){
               console.log(i);
               var test = document.getElementById('content2');
               var testContent = document.createTextNode(calendars[i].id + '\n');
               var node = document.createElement("LI");
               var node2 = document.createElement("BUTTON");
               var att = document.createAttribute("id");
               att.value = calendars[i].id;
               node2.setAttributeNode(att);
               node2.appendChild(testContent);
               node.appendChild(node2);
               test.appendChild(node);
               dynamicCalButtons(calendars[i].id);
//Next step is to add an attribute with unique id name that will allow an onclick function to be assigned.
             }
     });
}

function dynamicCalButtons(but){
//  var newbutton = document.getElementById(but);
//Try assigning the name to a global variable
  document.getElementById(but).addEventListener("click", function() {
      gotoNode(but);
  }, false);
//  newbutton.onclick = calClick;
}

function calClick(event){
  alert("sup");
}

function gotoNode(hi){ 
  var today = getCurrentDate();
  clearEventList();
gapi.client.calendar.events.list({
  'calendarId': hi,
//  'timeMin': (new Date()).toISOString(),
  'timeMin': testISO,
  'showDeleted': false,
  'singleEvents': true,
  'maxResults': 10,
  'orderBy': 'startTime'
}).then(function(response) {
  var events = response.result.items;
  var list = document.getElementById('content');

  if (events.length > 0) {
    for (i = 0; i < events.length; i++) {
      var event = events[i];
      var when = event.start.dateTime;
      var date = new Date(when);

      var end = event.end.dateTime;
      var endDate = new Date(end);

      var status = eventStatus(date, endDate);


      var isToday = date.toString().substring(0, 10);

      if(isToday == today){
      var dateNoTime = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
      var time = getClockTime(date);
      var endTime = getClockTime(endDate);

      if (!when) {
        when = event.start.date;
      }

      appendList(event.summary + ' (' + ' ' + time + ' - ' + endTime + '(' + status );
      }
    }
  } else {
    appendList('No upcoming events found.');
  }
});

}

function clearEventList(){
  var list = document.getElementById('content');
  if ( list.hasChildNodes() )
  {
      var nodeCount = list.childNodes.length;
      for(var i=0; i < nodeCount; i++)
      {
              list.removeChild(list.childNodes[0]);
      } 
  }
}
