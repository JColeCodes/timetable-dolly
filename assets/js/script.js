var currDayEl = $("#currentDay");
var timeBlockEl = $("#timeblocks");

// Format date as "Weekday, Month 0, 0000"
var displayDate = function(date) {
    dateDisplay = date.format("dddd, MMMM D, YYYY");
    return dateDisplay;
}
// Grab date as a number
var dateNumber = function(date) {
    currentDay = parseInt(date.format("YYYYMMDD"));
    return currentDay;
}

// Default day is "Today"
var today = dateNumber(moment());
var dateNav = {
    currentDay: today,
    weekForward: 0
} ;

// Get and format current day as "Weekday, Fullmonth 0, 0000"
var dateDisplay = displayDate(moment());
currDayEl.text(dateDisplay);

// Previous day button
$("#prev").on("click", function() {
    if (dateNav.currentDay == today) { // If today
        var date = moment().subtract(1, "days"); // Make day yesterday
        dateNav.currentDay = dateNumber(date);
        $(this).prop("disabled", true); // Hide previous button when you go back a day
    } else if (dateNav.currentDay == (today + 1)) { // If tomorrow
        date = moment(); // Make day today
        dateNav.currentDay = today;
    } else if (dateNav.currentDay > today) { // If any day after tomorrow
        dateNav.weekForward--; // Go back 1 day per click
        date = moment().add(dateNav.weekForward, "days");
        dateNav.currentDay = dateNumber(date);
    }
    if (dateNav.currentDay == dateNumber(moment().add(6, "days"))) {
        $("#next").prop("disabled", false); // Re-display next button
    }
    // Display date on schedule
    displayDate(date);
    currDayEl.text(dateDisplay);
    return dateNav;
});
// Next day button
$("#next").on("click", function() {
    if (dateNav.currentDay == today || dateNav.currentDay > today) { // If today or any day after today
        dateNav.weekForward++; // Go forward 1 day per click
        var date = moment().add(dateNav.weekForward, "days");
        dateNav.currentDay = dateNumber(date);
    } else if (dateNav.currentDay < today) { // If yesterday
        date = moment(); // Make day today
        dateNav.currentDay = today;
        $("#prev").prop("disabled", false); // Re-display previous button
    }
    if (dateNav.currentDay == dateNumber(moment().add(7, "days"))) {
        $(this).prop("disabled", true); // Hide next button when you go up one week
    }
    // Display date on schedule
    displayDate(date);
    currDayEl.text(dateDisplay);
    return dateNav;
});

// Set a clear date for auto-clearing localstorage
var clearDate = dateNumber(moment().subtract(2, "days"));
console.log(clearDate);

// Dynamically creating time blocks so I'm not manually putting in 9 divs with the same classes and stuff
var startHour = 9; // Start calendar at 9 AM
var displayHoursAmount = 9; // Go until 5 PM

for (var i = 0; i < displayHoursAmount; i++) {
    var thisHour = i + startHour;
    // Create the date row
    var dateRow = $("<div>")
        .addClass("time-block row");

    // Create the block for the date
    var dateBlock = $("<div>")
        .addClass("hour col-2 col-sm-1 p-3 m-0 text-right")
    // Uses moment to display the hour in 12 hour clock format with AM/PM
        .text(moment().hour(thisHour).format("h A"));

    // Create the block for the actual schedule content
    var scheduleBlock = $("<div>")
        .addClass("sched-block d-flex col-8 col-sm-10 text-left p-0 m-0"); // 10 columns with bootstrap

    // Find out the current hour
    var currentHour = moment().get("hour");

    // Change background color depending on the relative time by adding classes
    if (thisHour == currentHour) {
        scheduleBlock.addClass("present"); // Present; if row hour = current hour
    } else if (thisHour < currentHour) {
        scheduleBlock.addClass("past"); // Past; if row hour is less than current hour number
    } else if (thisHour > currentHour) {
        scheduleBlock.addClass("future"); // Future; if row hour is more than current hour number
    }

    var scheduleBlockP = $("<p>").addClass("p-3 m-0").data("hour", thisHour);
    scheduleBlock.append(scheduleBlockP);

    // Create a save button
    var saveBtn = $("<button>");
    var saveIcon = $("<i>"); // This page uses fontawesome, which uses i to display their icons
    saveIcon.addClass("fas fa-save"); // Fontawesome i classes for save button
    saveBtn.addClass("saveBtn col-2 col-sm-1 p-3 m-0").append(saveIcon); // Add icon to button

    timeBlockEl.append(dateRow); // Add each row to page
    dateRow.append(dateBlock) // Add time block to row
        .append(scheduleBlock) // Add schedule block to row
        .append(saveBtn); // Add save button to row
}

// Create edit on click
$(".sched-block").on("click", function() {
    // Find text of clicked upon schedule block
    var text = $(this).text().trim();

    // Make new textarea and add the text into it
    var textInput = $("<textarea>").addClass("col-12 m-0 p-3").val(text);
    textInput.height(this.scrollHeight);

    // Find and replace p with textarea and focus on it
    $(this).find("p").replaceWith(textInput);
    textInput.trigger("focus");
});
$(".sched-block").on("blur", "textarea", function() {
    // Text is whatever is typed into textarea
    var text = $(this).val().trim();

    // Replace textarea with p and add text
    var scheduleBlockP = $("<p>").addClass("p-3 m-0").text(text);
    $(this).replaceWith(scheduleBlockP);
});

/*// Open calendar
currDayEl.on("click", function() {
    $(this).datepicker({
        minDate: -1,
        maxDate: "7d"
    });
});*/