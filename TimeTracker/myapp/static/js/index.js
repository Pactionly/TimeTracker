var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function()
{
  var data = JSON.parse(this.responseText);
  updatePage(data);
}

function updatePage(data)
{
  var totalHours = document.getElementById("totalHours");
  totalHours.innerText = data.hours;

  lastFiveDays = data.last_five_days;
  // Use this variable for calander
}

xhttp.open("GET", "/work_stats/", true);
xhttp.send();
