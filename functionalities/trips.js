const crudFunctions = require("./crud.js");

class Trips {
    static getInstance() {
        return instance ? instance : new Trips();
    }

    async getTripList(username, oB) {
        let crud = crudFunctions.getInstance();
        try {
            let promise = await crud.select(
                ["Trail_trip", "Trail"], 
                ["trip_ID", "trail_name", "starting_time", "ending_time", "ratings"], 
                ["Trail_trip.trail_ID = Trail.trail_ID", "username = \'" + username + "\'"], 
                oB);
            for(let i = 0; i < res.length; i++) {
                console.log(promise[i] + "\n");
            }
        }
        catch(error) {
            console.log("Cannot retrieve trip list");
        }
    }
}

module.exports = Trips;