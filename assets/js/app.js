
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDCMriPxT9LzkNVxCD64no9e5ei32avLN4",
    authDomain: "trainscheduler-5aa0f.firebaseapp.com",
    databaseURL: "https://trainscheduler-5aa0f.firebaseio.com",
    storageBucket: "trainscheduler-5aa0f.appspot.com"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();
var rootRef = firebase.database().ref();
var key = rootRef.key

function writeNewSchedule(trainName, trainDestination) {

    var nextTrain = calculateNextArrival(trainFrecuency);
    var nextArrival = nextTrain["nextArrival"]
    var minutesAway = nextTrain["minutesAway"]
    console.log("next train " + nextTrain)

    // A train schedul entry
    var trainSchedule =  {
        name: trainName,
        destination: trainDestination,
        frecuency: trainFrecuency,
        nextArrival: nextArrival,
        minutesAway: minutesAway
    }
  
    // Get a key for a new Schedule.
    var newPostKey = firebase.database().ref().child('trains').push().key;
  
    // Write the new post's data simultaneously in the posts list and the user's post list.
    // var updates = {};
    // updates['/posts/' + newPostKey] = postData;
    // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
  
    // return firebase.database().ref().update(updates);
  }

function parseSnapshot(snapsot){
    console.log(snapsot)
    if(snapsot === undefined){
        return false 
    }
    var $row = $('<tr>');
    var $colName = $("<td>").text(snapsot.name)
    var $colDestination = $("<td>").text(snapsot.destination)
    var $colFrecuency = $("<td>").text(snapsot.frecuency)
    var $colNextTrain = $("<td>").text(moment(snapsot.nextArrival).format("hh:mm"))
    var $colMinutesAway = $("<td>").text(snapsot.minutesAway)
    $row.append($colName +  $colDestination + $colFrecuency + $colNextTrain + $colMinutesAway);
    var $trainSchedule = $('.train-schedule');

    $trainSchedule.append($row);
    console.log($trainSchedule);
}
function calculateNextArrival(firstArrival, trainFrecuency) {

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstArrival, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var timeRemainder = diffTime % trainFrecuency;
    console.log(timeRemainder);

    // Minute Until Train
    var trainMinutesAway = trainFrecuency - timeRemainder;
    console.log("MINUTES TILL TRAIN: " + trainMinutesAway);

    // Next Train
    var nextTrain = moment().add(trainMinutesAway, "minutes");
    console.log(nextTrain)
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm:a"));

    return { 
        minutesAway: trainMinutesAway,
        nextArrival: moment(nextTrain).format("hh:mm:a")
    }
}
// On Click of Button
$("#add-train-schedule-btn").on("click", function(e) {
    e.preventDefault();
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var firstArrival = $("#first-arrival-input").val().trim();
    var trainFrecuency = $("#frecuency-input").val().trim();
   
    var nextTrain = calculateNextArrival(firstArrival, trainFrecuency);
    var nextArrival = nextTrain["nextArrival"]
    var minutesAway = nextTrain["minutesAway"]
    // console.log("next train " + nextTrain)

    var trainSchedule =  {
        name: trainName,
        destination: trainDestination,
        frecuency: trainFrecuency,
        nextArrival: nextTrain["nextArrival"],
        minutesAway: nextTrain["minutesAway"]
    }
    console.log(trainSchedule);
    database.ref().child('trains').push(trainSchedule);

    trainName = $("#train-name-input").val("");
    trainDestination = $("#destination-input").val("");
    trainFrecuency = $("#frecuency-input").val("");
    trainNextArrival = $("#first-arrival-input").val("");
    return false;
});
var $trainSchedule = $('.train-schedule');

database.ref().child('trains').on("child_added", function(childSnapsot) {
    // console.log(childSnapsot.key);
    var snapsot = childSnapsot.val();
    // console.log(snapsot)
    var row = $('<tr>').attr('id',childSnapsot.key);
    var colName = '<td>' + snapsot.name + '</td>';
    var colDestination = '<td>' + snapsot.destination + '</td>';
    var colFrecuency = '<td class="text-center">' + snapsot.frecuency + '</td>';
    var colNextTrain = '<td class="text-center">' + snapsot.nextArrival + '</td>';
    var colMinutesAway = '<td class="text-center">' + snapsot.minutesAway + '</td>';
    row.append(colName +  colDestination + colFrecuency + colNextTrain + colMinutesAway);
    $trainSchedule.append(row)

}), function(errorObject) {
    console.log("Errors handle" + errorObject)
}