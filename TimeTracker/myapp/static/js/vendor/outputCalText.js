//This file is adapted from the Google API Reference guides - https://developers.google.com/api-client-library/javascript/reference/referencedocs

var list = document.getElementById('content');
var calList = document.getElementById('content2');

var primary_user_id;
var xhttp = new XMLHttpRequest();

xhttp.onload= function()
{
  var info = JSON.parse(this.responseText);
//  updatePage(info);
  console.log(info);
  //alert("XXXXX");
  //alert(info.calendarLists[0].name);
  setCalInfoConfig(info);
  //info.calendarLists[i].events.items
  //refresh error just redirect yourself to the sign in page
}

function setCalInfoConfig(info){
  for(i=0;i<info.calendarLists.length;i++){
    if(info.calendarLists[i].primary == true){
      primary_user_id = info.calendarLists[i].events.summary;
    }
  }
  LUE(primary_user_id, info);
  LCD(info);
  //listCalendarsDropdown();
}



xhttp.open("GET", "/rest_calendar/", true);
xhttp.send();



var CLIENT_ID = '1081502536351-6pojc00bl8ntbe0htg97f8k7b02ieu3g.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDHv1UgXbh5vw2d94ybdQ2Xcg9UJGfgu48';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
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

/*
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
  */

    /** Listen for sign-in state changes.
    *  listen() passes the current state of the user
    *  (true for signed in) as an argument to the updateSigninStatus function on line 51
    *  getAuthInstance returns a GoogleAuth object which restores users sign in state from the previous session.
    */

/*
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    //appendList(JSON.stringify(error, null, 2));
     console.log('Error Initializing Javascript Client');
  });
}
*/

/**
*  Called when the signed in status changes, to update the UI
*  appropriately. After a sign-in, the API is called.
*  Authorize is default to on in the html which is why the button always appears as authorize
*  before switching to sign out if necessary.
*/

/*
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    //listUpcomingEvents('primary');
    //for(i = 0; i<info
    //listCalendarsDropdown();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';

    if(list.hasChildNodes() == false){
    appendList("Authorize Google Calendar Use");
    }
  }
}
*/

/**
*  Sign in the user upon button click.
*/

/*
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
  list.removeChild(list.childNodes[0]);
}
*/

/**
*  Sign out the user upon button click.
*/

/*
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
  clearEventList();
  if(list.hasChildNodes() == false){
  appendList("Authorize Google Calendar Use");
  }
}
*/

/**
* Append a list element to the calendar dropdown body containing the given message
* as its text node. Used to display the results of the API call.
* This function uses javascript to make html and css objects.
*
* @param The message to be appended to the newly created object.
* This message is displayed on the homepage.
*/

function appendList(message) {

  var res = message.split("(");
  var status = res[2];

  var textContent = document.createTextNode(res[0] + '\n');
  var textContent2 = document.createTextNode(res[1] + '\n');

  var node = document.createElement("div");
  node.appendChild(textContent);
  node.appendChild(textContent2);

  var att = document.createAttribute("style");
  var att2 = document.createAttribute("class");
  att2.value = "card";
  if(status == "Finished"){
    att.value = "background: #C0C0C0; padding: 1em;";
  }
  else if(status == "Upcoming"){
    att.value = "background: #1daf06; padding: 1em;";
  }
  else{
    att.value = "background: #3b9dd1; padding: 1em;";
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

function listUpcomingEvents(id) {
var today = getCurrentDate();
clearEventList();
gapi.client.calendar.events.list({
  'calendarId': id,
//  'timeMin': (new Date()).toISOString(),
  'timeMin': testISO,
  'showDeleted': false,
  'singleEvents': true,
  'maxResults': 10,
  'orderBy': 'startTime'
}).then(function(response) {
  var events = response.result.items;
  console.log(events);

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

function LUE(id, info) {
//alert("LUE: " + id);
var today = getCurrentDate();
clearEventList();
  var events = null;
  for(i=0;i<info.calendarLists.length;i++){
    if(id == info.calendarLists[i].events.summary){
      events = info.calendarLists[i].events.items;
    }
  }
  //var events = info.calendarLists[0].events.items;
  console.log(events);

  if (events.length > 0) {
    for (i = 0; i < events.length; i++) {
      var event = events[i];
      console.log(event);
      if(event.status == "cancelled")
	continue;
      console.log(event);
      var when = event.start.dateTime;
      var date = new Date(when);

      var end = event.end.dateTime;
      var endDate = new Date(end);

      var status = eventStatus(date, endDate);


      var isToday = date.toString().substring(0, 10);

//      if(isToday == today){
      var dateNoTime = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
      var time = getClockTime(date);
      var endTime = getClockTime(endDate);

      if (!when) {
	when = event.start.date;
      }

      appendList(event.summary + ' (' + ' ' + time + ' - ' + endTime + '(' + status );
     // }
    }
  } else {
    appendList('No upcoming events found.');
  }
//});
}

/**
* Adapted from https://stackoverflow.com/questions/5507989/javascript-clock-update-on-the-minute-help
* Formats a time object to "normal" clock standards for readability.
* @return the newly formatted time string.
*/

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

/**
* @return A date object as a string omitting time aspects.
*/

function getCurrentDate(){
  var today = new Date();
  var subToday = today.toString().substring(0, 10);
  return subToday;
}

/**
* Given a start time and an end time of an event through passed in parameters
* Compare these times with the current time.
* @return the status of the event compared to the current time with the options
* being "InProgress", "Upcoming", or "Finished".
*/

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

/**
* Dynamically creates a new html object for each possible calendar.
* The objects created are list objects followed by 'a' objects with button, style, and
* class attributes. The objects created in this function are appended under the dropdown menu
* section of the calendar card.
*/

function listCalendarsDropdown(){
     var request = gapi.client.calendar.calendarList.list();
     request.execute(function(resp){
             var calendars = resp.items;
             for(var i=0;i<calendars.length;i++){
	       alert("ALERT: " + calendars[i].id);

               var calSummary= calendars[i].summary;
               var idSplit = calSummary.split("@");
               var calName = idSplit[0];

               var textContent = document.createTextNode(calName + '\n');
               var newObject = document.createElement("LI");
               var classAtt = document.createAttribute("class");
               var styleAtt = document.createAttribute("style");
               classAtt.value = "no-bullets";
               newObject.setAttributeNode(classAtt);
               styleAtt.value = "list-style-type: none;";
               newObject.setAttributeNode(styleAtt);

               var node2 = document.createElement("a");
               var idAtt = document.createAttribute("id");
               var a = document.createAttribute("button");
               idAtt.value = calendars[i].id;
               node2.setAttributeNode(a);
               node2.setAttributeNode(idAtt);
               node2.appendChild(textContent);
               newObject.appendChild(node2);
               calList.appendChild(newObject);
               assignCalButton(calendars[i].id);
             }
     });
}

function LCD(info){
//     alert("LCD");
//     var request = gapi.client.calendar.calendarList.list();
//     request.execute(function(resp){
//             var calendars = resp.items;
             var calendars = info.calendarLists;
             for(var i=0;i<calendars.length;i++){

               var calSummary= calendars[i].events.summary;
               var idSplit = calSummary.split("@");
               var calName = idSplit[0];

               var textContent = document.createTextNode(calName + '\n');
               var newObject = document.createElement("LI");
               var classAtt = document.createAttribute("class");
               var styleAtt = document.createAttribute("style");
               classAtt.value = "no-bullets";
               newObject.setAttributeNode(classAtt);
               styleAtt.value = "list-style-type: none;";
               newObject.setAttributeNode(styleAtt);

               var node2 = document.createElement("a");
               var idAtt = document.createAttribute("id");
               var a = document.createAttribute("button");
               idAtt.value = calendars[i].events.summary;
               node2.setAttributeNode(a);
               node2.setAttributeNode(idAtt);
               node2.appendChild(textContent);
               newObject.appendChild(node2);
               calList.appendChild(newObject);
               assignCalButton(calendars[i].events.summary, info);
             }
 //    });
}
/**
* Display a different calendar for each created button depending on the
* calendar id that is given. Usually the calendar id was just dynamically created
* and we assign the correct calendar to the corresponding id.
*/

function assignCalButton(buttonId, info){
  document.getElementById(buttonId).addEventListener("click", function() {
//  listUpcomingEvents(buttonId);
    LUE(buttonId, info);
  }, false);
}


/**
* Removes all elements from the Calendar list. Used when
* sign in state changes or display calendar changes.
*/

function clearEventList(){
  if (list.hasChildNodes())
  {
      var nodeCount = list.childNodes.length;
      for(var i=0; i<nodeCount; i++)
      {
              list.removeChild(list.childNodes[0]);
      }
  }
}

/*
function getprimaryUser(){
  var xhttp2 = new XMLHttpRequest();

  var info = JSON.parse(xhttp2.responseText);
  for(i=0;i<info.calendarLists.length;i++){
    if(info.calendarLists[i].primary == true);
      primary_user = infocalendarLists[i].name;
  }
}
*/
