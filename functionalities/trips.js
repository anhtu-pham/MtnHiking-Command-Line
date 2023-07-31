const crud = require("./crud.js");
let instance = null;

class Trips {
  static getInstance() {
    instance = instance ? instance : new Trips();
    return instance;
  }

  printOutput(data) {
    if(data.length == 0) {
      console.log("No trips satisfy this criteria");
    }
    else {
      const columns = Object.keys(data[0]);
  
      const columnWidths = {};
      columns.forEach((column) => {
        columnWidths[column] = Math.max(
          ...data.map((row) => String(row[column]).length)
        );
      });
      console.log(
        `| ${columns
          .map((column) => column.padEnd(columnWidths[column]))
          .join(" | ")} |`
      );
      console.log(
        `| ${columns
          .map((column) => "-".repeat(columnWidths[column]))
          .join(" | ")} |`
      );
      data.forEach((row) => {
        console.log(
          `| ${columns
            .map((column) => String(row[column]).padEnd(columnWidths[column]))
            .join(" | ")} |`
        );
      });
    }
  }

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
      tripList.forEach((trip) => {
        if(trip["finished"] == "1") {
          pastTripList.push(trip);
        }
        else {
          nextTripList.push(trip);
        }
      });
      console.log("NEXT TRIPS:\n");
      // nextTripList.forEach((nextTrip) => console.log(nextTrip + "\n"));
      this.printOutput(nextTripList);
      console.log("PAST TRIPS:\n");
      // nextTripList.forEach((pastTrip) => console.log(pastTrip + "\n"));
      this.printOutput(pastTripList);
    } catch (error) {
      // console.log(error);
      console.log("Cannot get trip list");
    }
  }

  async addTrip(username, trailID, startingTime, endingTime, finished) {
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
          ["starting_time", "ending_time", "finished"],
          ["\'" + startingTime + "\'", "\'" + endingTime + "\'", finished]
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
      // console.log(error);
      console.log("Cannot add trip");
    }
  }

  async updateTrip(username, tripID, trailID, startingTime, endingTime, finished) {
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
        if(finished != "U") {
          toUpdate.push("finished = " + finished);
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