const prompt = require("prompt-sync")();
const Users = require("./functionalities/users.js");
const Mountains = require("./functionalities/mountains.js");
const Trails = require("./functionalities/trails.js");
const Trips = require("./functionalities/trips.js");

let user = Users.getInstance();
let mountains = Mountains.getInstance();
let trails = Trails.getInstance();
let trips = Trips.getInstance();

console.log("-------------------- MTNTRAILS --------------------\n");
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
    "Choose 1 option: (1) Retrieve your trips (2) Search mountains and associated trails (3) Add trip (4) Update trip (5) Remove trip (6) Logout and End program  "
  );
  switch (option) {
    case "1":
      retrieveTrips(user.usedUsername);
      break;
    case "2":
      search();
      break;
    case "3":
      break;
    case "4":
      break;
    case "5":
      break;
    case "6":
      user.logout();
      process.exit();
    default:
      auth = prompt("Only choose option from 1 to 6:  ");
  }
}

async function retrieveTrips(usedUsername) {
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
  await trips.getTripList(usedUsername, tripCategoriesToSort[tripCategory]);
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
  let mtnID = prompt("Choose mountain by mountain ID:  ");

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
  await trails.getAssociatedTrailList(mtnID, trailCategoriesToSort[trailCategory]);
}
