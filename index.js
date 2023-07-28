const prompt = require("prompt-sync")();
const Users = require("./functionalities/users.js");
const Mountains = require("./functionalities/mountains.js");
const Trails = require("./functionalities/trails.js");
const Trips = require("./functionalities/trips.js");

let user = Users.getInstance();
let mountains = Mountains.getInstance();
let trails = Trails.getInstance();
let trips = Trips.getInstance();
let chosenTrailID = null;

console.log("-------------------- WELCOME TO MTNTRAILS --------------------\n");
let option = prompt("Authentication with 1 option: (1) Signup (2) Login  ");
switch (option) {
  case "1":
    let username = prompt("Username:  ");
    let email = prompt("Email:  ");
    let password = prompt("Password:  ");
    await user.signup(username, email, password);
    break;
  case "2":
    let loginUsername = prompt("Username:  ");
    let loginPassword = prompt("Password:  ");
    await user.login(loginUsername, loginPassword);
    break;
  default:
    option = prompt("Only choose option 1 or 2:  ");
}

while (true) {
  option = prompt(
    "Choose 1 option: (1) Search mountains and associated trails (2) Get your trip list (3) Add trip (4) Update trip (5) Remove trip (6) Logout and End program  "
  );
  switch (option) {
    case "1":
      chosenTrailID = search();
      break;
    case "2":
      getTripList(user.usedUsername);
      break;
    case "3":
      addTripWithOptions(user.usedUsername);
      break;
    case "4":
      updateTrip(user.usedUsername);
      break;
    case "5":
      removeTrip(user.usedUsername);
      break;
    case "6":
      user.logout();
      process.exit();
    default:
      auth = prompt("Only choose option from 1 to 6:  ");
  }
}

async function search() {
  console.log("LIST OF MOUNTAINS\n");
  let mtnCategoriesToSort = {
    "trail name": "trail_name",
    "starting time": "starting_time",
    "ending time": "ending_time",
    ratings: "ratings",
  };
  let mtnCategory = null;
  while (!Object.keys(mtnCategoriesToSort).includes(mtnCategory)) {
    mtnCategory = prompt(
      "Sort mountains by name / elevation / summit rating / difficulty:  "
    );
  }
  console.log("List of mountains sorted by " + mtnCategory + ":\n");
  await mountains.getMountainList(null, mtnCategoriesToSort[mtnCategory]);
  let mtnID = prompt("Choose your preferred mountain by mountain ID:  ");

  console.log("LIST OF TRAILS ASSOCIATED WITH CHOSEN MOUNTAIN\n");
  let trailCategoriesToSort = {
    name: "trail_name",
    elevation: "elevation_gain",
    difficulty: "difficulty",
    length: "trail_length",
  };
  let trailCategory = null;
  while (!Object.keys(trailCategoriesToSort).includes(trailCategory)) {
    trailCategory = prompt(
      "Sort trails by name / elevation / difficulty / length:  "
    );
  }
  console.log("List of trails sorted by " + trailCategory + ":\n");
  await trails.getAssociatedTrailList(
    mtnID,
    trailCategoriesToSort[trailCategory]
  );
  return prompt("Choose your preferred trail by trail ID:  ");
}

async function getTripList(usedUsername) {
  console.log("YOUR TRIPS\n");
  let tripCategoriesToSort = {
    "trail name": "trail_name",
    "starting time": "starting_time",
    "ending time": "ending_time",
    ratings: "ratings",
  };
  let tripCategory = null;
  while (!Object.keys(tripCategoriesToSort).includes(tripCategory)) {
    tripCategory = prompt(
      "Sort trips by trail name / starting time / ending time / ratings:  "
    );
  }
  console.log("List of trips sorted by " + tripCategory + ":\n");
  let [pastTripList, futureTripList] = await trips.getTripList(
    usedUsername,
    tripCategoriesToSort[tripCategory]
  );
  let currentTime = new Date().toISOString();
  let formattedCurrentTime = currentTime
    .substring(0, currentTime.indexOf("."))
    .replace("T", " ");
  pastTripList = response;
  let i = 0;
  while (response[i]["Trail_trip.ending_time"] > formattedCurrentTime) {
    let trip = pastTripList.shift();
    futureTripList.push(trip);
    i++;
  }
}

async function addTripWithOptions(usedUsername) {
  let option = null;
  let options = ["Y", "N"];
  while (!options.includes(option)) {
    option = prompt(
      "Do you want to add the trail you have chosen most recently? (Y/N):  "
    );
  }
  if (option == "N") {
    console.log("Please search to choose your new preferred trail\n");
    chosenTrailID = search();
  }
  addTrip(usedUsername, chosenTrailID);
}

async function addTrip(usedUsername, trailID) {
  let startingTime = prompt("Please type your starting time:  ");
  let endingTime = prompt("Please type your ending time:  ");
  await trips.addTrip(usedUsername, trailID, startingTime, endingTime);
}

async function updateTrip(usedUsername) {
  let tripID = prompt(
    "Please type the ID of the trip that you want to update:  "
  );
  let trailID = prompt("Please type the updated trail ID:  ");
  let startingTime = prompt("Please type the updated starting time:  ");
  let endingTime = prompt("Please type the updated ending time:  ");
  await trips.updateTrip(
    usedUsername,
    tripID,
    trailID,
    startingTime,
    endingTime
  );
}

async function removeTrip(usedUsername) {
  let tripID = prompt(
    "Please type the ID of the trip that you want to remove:  "
  );
  await trips.removeTrip(usedUsername, tripID);
}
