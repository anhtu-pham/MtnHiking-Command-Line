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
    let nextTripList = [];
    let pastTripList = [];
    try {
      let tripList = await crud.select(
        ["User_Trip", "Trip", "Trip_Trail", "Trail"],
        [
          "Trip.trip_ID",
          "trail_name",
          "starting_time",
          "ending_time",
          "ratings",
          "finished"
        ],
        [
          "User_Trip.trip_ID = Trip.trip_ID",
          "Trip.trip_ID = Trip_Trail.trip_ID",
          "Trip_Trail.trail_ID = Trail.trail_ID",
          "username = \'" + username + "\'",
        ],
        oB
      );
      console.log(tripList);
      // let currentTime = new Date().toISOString();
      // let formattedCurrentTime = currentTime
      //   .substring(0, currentTime.indexOf("."))
      //   .replace("T", " ");
      // pastTripList = tripList;
      // let i = 0;
      // while (tripList[i]["starting_time"] > formattedCurrentTime) {
      //   let trip = pastTripList.shift();
      //   nextTripList.push(trip);
      //   i++;
      // }
      tripList.forEach((trip) => {
        if(trip["finished"] == "false") {
          nextTripList.push(trip);
        }
        if(trip["finished"] == "true") {
          pastTripList.push(trip);
        }
      });
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
      let associatedTrail = await crud.select(
        ["Trail"],
        null,
        ["trail_ID = " + trailID],
        null,
        1
      );
      if(associatedTrail.length == 1) {
        await crud.insert(
          "Trip",
          ["starting_time", "ending_time"],
          ["'" + startingTime + "'", "'" + endingTime + "'"]
        );
        // console.log("ROW IDDDDDD: " + rowID);
        let lastTrip = await crud.select(
          ["Trip"],
          ["trip_ID"],
          null,
          "trip_ID DESC",
          1
        );
        await crud.insert(
          "User_Trip",
          ["trip_ID", "username"],
          [lastTrip[0]["trip_ID"], "\'" + username + "\'"]
        );
        await crud.insert(
          "Trip_Trail",
          ["trip_ID", "trail_ID"],
          [lastTrip[0]["trip_ID"], trailID]
        );
      }
      else {
        console.log("There is no trail associated with the given trail ID");
      }
    } catch (error) {
      console.log(error);
      console.log("Cannot add trip");
    }
  }

  async updateTrip(username, tripID, trailID, startingTime, endingTime) {
    try {
      let userTrip = await crud.select(
        ["User_Trip"],
        null,
        ["username = '" + username + "'", "trip_ID = " + tripID],
        null,
        1
      );
      if(userTrip.length == 1) {
        if(trailID != "U") {
          await crud.update(
            "Trip_Trail",
            ["trail_ID = " + trailID],
            ["trip_ID = " + tripID]
          );
        }
        let toUpdate = [];
        if(startingTime != "U") {
          toUpdate.push("starting_time = \'" + startingTime + "\'");
        }
        if(endingTime != "U") {
          toUpdate.push("ending_time = \'" + endingTime + "\'");
        }
        await crud.update("Trip", toUpdate, ["trip_ID = " + tripID]);
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
        ["User_Trip"],
        null,
        ["username = \'" + username + "\'", "trip_ID = " + tripID],
        null,
        1
      );
      if (userTrip.length == 1) {
        await crud.remove("User_Trip", ["trip_ID = " + tripID]);
        await crud.remove("Trip_Trail", ["trip_ID = " + tripID]);
        await crud.remove("Trip", ["trip_ID = " + tripID]);
      }
    } catch (error) {
      console.log("Cannot remove trip");
    }
  }
}

module.exports = Trips;