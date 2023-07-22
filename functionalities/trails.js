const crudFunctions = require("./crud.js");

class Trails {
    static getInstance() {
        return instance ? instance : new Trails();
    }

    async getAssociatedTrailList(mtnID, oB) {
        let crud = crudFunctions.getInstance();
        try {
            let promise = await crud.select(
                ["Trail", "Has_trail"], 
                ["Trail.trail_ID", "Trail.trail_name", "Trail.elevation_gain", "Trail.difficulty", "Trail.trail_length", "Trail.trail_location", "Trail.water_station", "Trail.trail_description"], 
                ["Trail.trail_ID = Has_trail.trail_ID", "Has_trail.mountain_ID = " + mtnID],
                oB);
            for(let i = 0; i < res.length; i++) {
                console.log(promise[i] + "\n");
            }
        }
        catch(error) {
            console.log("Cannot retrieve trail list");
        }
    }
}

module.exports = Trails;