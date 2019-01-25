window.onload = function () {

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
		name: "Avg. Lifespan",
		dataPoints: [
			{ y: 2, label: "1/19/19" },
			{ y: 4, label: "1/20/19" },
			{ y: 7, label: "1/21/19" },
			{ y: 6, label: "1/22/19" },
			{ y: 4, label: "1/23/19" },
			{ y: 8, label: "1/24/19" },
			{ y: 5, label: "1/25/19" }
		]
	}]
});
chart.render();
}
