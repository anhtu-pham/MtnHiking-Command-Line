const crud = require("./crud.js");
let instance = null;

class Trips {
  static getInstance() {
    instance = instance ? instance : new Trips();
    return instance;
  }

  // async getTripList(username, oB) {
  //   let pastTripList = [];
  //   let nextTripList = [];
  //   let crud = crudFunctions.getInstance();
  //   try {
  //     let response = await crud.select(
  //       ["Trail_trip", "Trail"],
  //       ["trip_ID", "trail_name", "starting_time", "ending_time", "ratings"],
  //       [
  //         "Trail_trip.trail_ID = Trail.trail_ID",
  //         "username = \'" + username + "\'",
  //       ],
  //       oB
  //     );
  //     // compare ending_time with current local time, add to corresponding trips.
  //   //   for (let i = 0; i < response.length; i++) {
  //   //     console.log(response[i] + "\n");
  //   //   }
  //     let currentTime = new Date().toISOString();
  //     let formattedCurrentTime = currentTime
  //       .substring(0, currentTime.indexOf("."))
  //       .replace("T", " ");
  //     pastTripList = response;
  //     let i = 0;
  //     while (promise[i]["Trail_trip.ending_time"] > formattedCurrentTime) {
  //       let trip = pastTripList.shift();
  //       nextTripList.push(trip);
  //       i++;
  //     }
  //     console.log("NEXT TRIPS:\n");
  //     nextTripList.forEach((nextTrip) => console.log(nextTrip + "\n"));
  //     console.log("PAST TRIPS:\n");
  //     nextTripList.forEach((pastTrip) => console.log(pastTrip + "\n"));
  //   } catch (error) {
  //     console.log("Cannot get trip list");
  //   }
  // }

  // async addTrip(username, trailID, startingTime, endingTime) {
  //   let crud = crudFunctions.getInstance();
  //   try {
  //     await crud.insert(
  //       "Trail_trip",
  //       ["username", "starting_time", "ending_time", "trail_ID"],
  //       [
  //         "\'" + username + "\'",
  //         "\'" + startingTime + "\'",
  //         "\'" + endingTime + "\'",
  //         trailID,
  //       ]
  //     );
  //   } catch (error) {
  //     console.log("Cannot add trip");
  //   }
  // }
  async getTripList(username, oB) {
    let pastTripList = [];
    let nextTripList = [];
    try {
      let tripList = await crud.select(
        ["User_trip", "Trip", "Trip_trail", "Trail"],
        ["Trip.trip_ID", "trail_name", "starting_time", "ending_time", "ratings"],
        [
          "User_trip.trip_ID = Trip.trip_ID",
          "Trip.trip_ID = Trip_trail.trip_ID",
          "Trip_trail.trail_ID = Trail.trail_ID",
          "username = \'" + username + "\'",
        ],
        oB
      );
      let currentTime = new Date().toISOString();
      let formattedCurrentTime = currentTime.substring(0, currentTime.indexOf(".")).replace("T", " ");
      pastTripList = tripList;
      let i = 0;
      while (tripList[i]["ending_time"] > formattedCurrentTime) {
        let trip = pastTripList.shift();
        nextTripList.push(trip);
        i++;
      }
      console.log("NEXT TRIPS:\n");
      nextTripList.forEach((nextTrip) => console.log(nextTrip + "\n"));
      console.log("PAST TRIPS:\n");
      nextTripList.forEach((pastTrip) => console.log(pastTrip + "\n"));
    } catch (error) {
      console.log(error);
      console.log("Cannot get trip list");
    }
  }

  async addTrip(username, trailID, startingTime, endingTime) {
    try {
      let rowID = await crud.insert(
        "Trip",
        ["starting_time", "ending_time"],
        [
          "\'" + startingTime + "\'",
          "\'" + endingTime + "\'"
        ]
      );
      let tripID = await crud.select(
        ["Trip"],
        ["trip_ID"],
        ["ROWID = " + rowID],
        null
      );
      await crud.insert(
        "User_trip",
        ["trip_ID", "username"],
        [tripID, "\'" + username + "\'"]
      );
      await crud.insert(
        "Trip_trail",
        ["trip_ID", "trail_ID"],
        [tripID, trailID]
      );
    } catch (error) {
      console.log("Cannot add trip");
    }

  }

  async updateTrip(username, tripID, trailID, startingTime, endingTime) {
    try {
      let userTrip = await crud.select(
        ["User_trip"],
        null,
        ["username = \'" + username + "\'", "trip_ID = " + tripID],
        null
      );
      if(userTrip.length == 1) {
        await crud.update(
          "Trip_trail",
          ["trail_ID = " + trailID],
          ["trip_ID = " + tripID]
        );
        await crud.update(
          "Trip",
          ["starting_time = \'" + startingTime + "\'", "ending_time = \'" + endingTime],
          ["trip_ID = " + tripID]
        );
      }
      // await crud.update(
      //   "Trail_trip",
      //   [
      //     "starting_time = \'" + startingTime + "\'",
      //     "ending_time = \'" + endingTime,
      //     "trail_ID = " + trailID,
      //   ],
      //   ["username = \'" + username + "\'", "trip_ID = " + tripID]
      // );
    } catch (error) {
      console.log("Cannot update trip");
    }
  }

  async removeTrip(username, tripID) {
    try {
      let userTrip = await crud.select(
        ["User_trip"],
        null,
        ["username = \'" + username + "\'", "trip_ID = " + tripID],
        null
      );
      if(userTrip.length == 1) {
        await crud.remove("Trail_trip", ["trip_ID = " + tripID]);
      }
      // await crud.remove("Trail_trip", [
      //   "username = \'" + username + "\'",
      //   "trip_ID = " + tripID,
      // ]);
    } catch (error) {
      console.log("Cannot remove trip");
    }
  }
}

module.exports = Trips;
