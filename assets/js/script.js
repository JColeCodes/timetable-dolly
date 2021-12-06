var currDayEl = $("#currentDay");
var timeBlockEl = $("#timeblocks");

// Storage
var savedSchedule = [];
if ("schedule" in localStorage){
    savedSchedule = JSON.parse(localStorage.getItem("schedule"));
}
var displaySettings = {
    startHour: 9,
    displayHours: 9
};
if ("schedDisplaySetting" in localStorage){
    displaySettings = JSON.parse(localStorage.getItem("schedDisplaySetting"));
}

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
    } else if (dateNav.currentDay == dateNumber(moment().add(1, "days"))) { // If tomorrow
        dateNav.weekForward--;
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
    // Display schedule for current day
    displaySchedule();
    // Return date change
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
    // Display schedule for current day
    displaySchedule();
    // Return date change
    return dateNav;
});

// Save to local storage
var saveTask = function() {
    localStorage.setItem("schedule", JSON.stringify(savedSchedule));
}
var saveSetting = function() {
    localStorage.setItem("schedDisplaySetting", JSON.stringify(displaySettings));
}

// Set a clear date for auto-clearing localstorage
var clearDate = dateNumber(moment().subtract(2, "days"));
for (var i = 0; i < savedSchedule.length; i++) {
    if (savedSchedule[i].day == clearDate) {
        savedSchedule.splice(i, 1);
    }
    saveTask();
}

// Create time blocks and its buttons/content
var displaySchedule = function() {
    $(".time-block").remove(); // Start with clean page

    var startHour = displaySettings.startHour; // Start calendar at 9 AM
    var displayHoursAmount = displaySettings.displayHours; // Go until 5 PM

    for (var i = 0; i < displayHoursAmount; i++) {
        var thisHour = i + startHour; // Hour on a 24 hour clock
        // Create the date row
        var dateRow = $("<div>")
            .addClass("time-block row")
            .attr("hour", thisHour);

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
        if (thisHour == currentHour && dateNav.currentDay == today) {
            scheduleBlock.addClass("present"); // Present; if row hour = current hour and it is today
        }
            // Past; if row hour is less than current hour number of if day is yesterday
         else if ((thisHour < currentHour && dateNav.currentDay == today) || dateNav.currentDay < today) {
            scheduleBlock.addClass("past");
        }
            // Future; if row hour is more than current hour number or if day is in the future
        else if ((thisHour > currentHour && dateNav.currentDay == today) || dateNav.currentDay > today) {
            scheduleBlock.addClass("future");
        }

        // Create p element for schedule text content
        var scheduleBlockP = $("<p>").addClass("p-3 m-0");
        scheduleBlock.append(scheduleBlockP);

        // If anything is saved in localstorage, apply text...
        if (savedSchedule.length > 0) {
            for (var n = 0; n < savedSchedule.length; n++) {
                // If current day AND if current time block matches what's in localstorage, add text
                if (savedSchedule[n].day == dateNav.currentDay && savedSchedule[n].data.time == thisHour){
                    scheduleBlockP.text(savedSchedule[n].data.text);
                    break;
                }
            }
        }

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

    // What happens when you click the save button
    $(".time-block").on("click", "button", function() {
        // create an object to save info in
        var dataPerDay = {
            day: dateNav.currentDay, // Current day number
            data: {
                time: $(this).parent().attr("hour"), // Current hour
                text: $(this).parent().find("p").text() // Text content
            }
        };
        // If nothing has been saved yet
        if (savedSchedule.length == 0 ) {
            savedSchedule.push(dataPerDay);
        }
        // If there is stuff saved, loop through it
        for (var n = 0; n < savedSchedule.length; n++) {
            if (savedSchedule[n].day == dataPerDay.day && savedSchedule[n].data.time == dataPerDay.data.time) {
                // If day and time matches something in array, update text
                savedSchedule[n].data.text = dataPerDay.data.text;
                break;
            } else {
                // If new, push into array
                savedSchedule.push(dataPerDay);
                break;
            }
        }
        // Save it to localstorage
        saveTask();
    });
}
displaySchedule(); // Run on page load

var displayStartHour = $("#displayStartHour");
var displayHoursRange = $("#displayHoursRange");

var displaySettingsUpdate = function() {
    displayStartHour.attr({
        min: 0,
        max: (24 - displaySettings.displayHours),
        value: displaySettings.startHour,

    });
    displayHoursRange.attr({
        min: 1,
        max: (24 - displaySettings.startHour),
        value: displaySettings.displayHours
    });
    saveSetting();
}
displaySettingsUpdate();
$("#hoursSelected").text(displaySettings.displayHours);

$("#editDisplay").on("click", function() {
    $(this).parent().find("div").toggleClass("hidden");
});
displayStartHour.on("input", function() {
    var startHour = parseInt($(this).val());
    displaySettings.startHour = startHour;
    displaySchedule();
    displaySettingsUpdate();
});
displayHoursRange.on("input", function() {
    var hourRange = parseInt($(this).val());
    $(this).parent().find("span").text(hourRange);
    displaySettings.displayHours = hourRange;
    displaySchedule();
    displaySettingsUpdate();
});