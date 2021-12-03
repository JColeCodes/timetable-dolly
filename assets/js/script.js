var currDayEl = $("#currentDay");
var timeBlockEl = $("#timeblocks");

var displayCurrDate = function() {
    // Get and format current day as "Weekday, Fullmonth 0, 0000"
    var dateDisplay = moment().format("dddd, MMMM D, YYYY");
    currDayEl.text(dateDisplay);
}
displayCurrDate();

// Dynamically creating time blocks so I'm not manually putting in 9 divs with the same classes and stuff
var displayTimeBlocks = function() {
    var startHour = 9; // Start calendar at 9 AM
    var displayHoursAmount = 9; // Go until 5 PM
    
    for (var i = 0; i < displayHoursAmount; i++) {
        // Create the date row
        var dateRow = $("<div>");
        dateRow.addClass("time-block row");

        // Create the block for the date
        var dateBlock = $("<div>");
        dateBlock.addClass("hour col-1 p-3 text-right");
        // Uses moment to display the hour in 12 hour clock format with AM/PM
        dateBlock.text(moment().hour(startHour).format("h A"));

        // Create the block for the actual schedule content
        var scheduleBlock = $("<div>");
        // 10 columns with bootstrap
        scheduleBlock.addClass("col-10 p-3 text-left");

        // Find out the current hour
        var currentHour = moment().get("hour");

        // Change background color depending on the relative time by adding classes
        if (startHour == currentHour) {
            scheduleBlock.addClass("present"); // Present; if row hour = current hour
        } else if (startHour < currentHour) {
            scheduleBlock.addClass("past"); // Past; if row hour is less than current hour number
        } else if (startHour > currentHour) {
            scheduleBlock.addClass("future"); // Future; if row hour is more than current hour number
        }

        scheduleBlock.text("Hello?"); // Sample filler text - remove later

        // Create a save button
        var saveBtn = $("<button>");
        var saveIcon = $("<i>"); // This page uses fontawesome, which uses i to display their icons
        saveBtn.addClass("saveBtn col-1");
        saveIcon.addClass("fas fa-save"); // Fontawesome i classes for save button
        saveBtn.append(saveIcon); // Add icon to button

        timeBlockEl.append(dateRow); // Add each row to page
        dateRow.append(dateBlock); // Add time block to row
        dateRow.append(scheduleBlock); // Add schedule block to row
        dateRow.append(saveBtn); // Add save button to row

        startHour++; // Increase hour to go to the next hour
    }
}
displayTimeBlocks();