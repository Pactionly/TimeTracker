var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function()
{
  var info = JSON.parse(this.responseText);
  updatePage(info);
}


function updatePage(info)
{
  var totalHours = document.getElementById("totalHours");
  totalHours.innerText = info.hours;

  var lastFiveDays = info.last_five_days;
  // Use this variable for calander
  var d = [];
  for(var i = 0; i < lastFiveDays.length; i++)
  {
    d.push({ y: lastFiveDays[i].hours, label: lastFiveDays[i].date });
  }

  var chart = new CanvasJS.Chart("chartContainer", {
  	animationEnabled: true,
  	title:{
  		text: "Hours worked this pay period"
  	},
  	axisY:{
  		title: "Hours Worked"
  	},
  	data: [{
  		type: "column",
  		name: "Hours",
  		dataPoints: d
  	}]
  });


  chart.render();
}

xhttp.open("GET", "/work_stats/", true);
xhttp.send();
