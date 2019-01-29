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

  var lastFiveDays = info.daily_stats;
  // Use this variable for calander
  var d = [];
  for(var i = 0; i < lastFiveDays.length; i++)
  {
    d.push({ y: lastFiveDays[i].hours, label: lastFiveDays[i].date });
  }

  var chart = new CanvasJS.Chart("chartContainer", {
  	animationEnabled: true,
  	title:{
  		text: "Total Hours worked"
  	},
  	axisY:{
  		title: "Hours Worked"
  	},
    axisX:{
  		title: "Date",
      labelAngle: 45,
      interval: 1
  	},
  	data: [{
  		type: "column",
      color: "#3B9DD1",
  		name: "Hours",
  		dataPoints: d
  	}]
  });


  chart.render();
}

xhttp.open("GET", "/work_stats/", true);
xhttp.send();
