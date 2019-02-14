function updateClock() {

    document.getElementById("workingTime").innerHTML = (new Date().getTime() - new Date(clock_in_time)) / 60 + "]";
}

timer = setInterval(updateClock, 1000);

