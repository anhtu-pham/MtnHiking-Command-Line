const crudFunctions = require("./crud.js");

class Trips {
    static getInstance() {
        return instance ? instance : new Trips();
    }

    async getTripList(username, oB) {
        let pastTrips = [];
        let futureTrips = [];
        let crud = crudFunctions.getInstance();
        try {
            let promise = await crud.select(
                ["Trail_trip", "Trail"], 
                ["trip_ID", "trail_name", "starting_time", "ending_time", "ratings"], 
                ["Trail_trip.trail_ID = Trail.trail_ID", "username = \'" + username + "\'"], 
                oB);
            // compare ending_time with current local time, add to corresponding trips.
            for(let i = 0; i < promise.length; i++) {
                console.log(promise[i] + "\n");
            }
            return {pastTripList: pastTrips, futureTripList: futureTrips};
        }
        catch(error) {
            console.log("Cannot get trip list");
        }
    }

    async addTrip(username, trailID, startingTime, endingTime) {
        let crud = crudFunctions.getInstance();
        try {
            await crud.insert(
                "Trail_trip",
                ["username", "starting_time", "ending_time", "trail_ID"],
                ["\'" + username + "\'", "\'" + startingTime + "\'", "\'" + endingTime + "\'", trailID]
            );
        }
        catch(error) {
            console.log("Cannot add trip");
        }
    }

    async updateTrip(username, tripID, trailID, startingTime, endingTime) {
        let crud = crudFunctions.getInstance();
        try {
            await crud.update(
                "Trail_trip",
                ["starting_time = \'" + startingTime + "\'", "ending_time = \'" + endingTime, "trail_ID = " + trailID],
                ["username = \'" + username + "\'", "trip_ID = " + tripID]
            );
        }
        catch(error) {
            console.log("Cannot update trip");
        }
    }

    async removeTrip(username, tripID) {
        let crud = crudFunctions.getInstance();
        try {
            await crud.delete(
                "Trail_trip",
                ["username = \'" + username + "\'", "trip_ID = " + tripID]
            );
        }
        catch(error) {
            console.log("Cannot remove trip");
        }
    }
}

module.exports = Trips;