const crud = require("./crud.js");
let instance = null;

class Trails {
    static getInstance() {
        instance = instance ? instance : new Trails();
        return instance;
    }

    // async getAssociatedTrailList(mtnID, oB) {
    //     let crud = crudFunctions.getInstance();
    //     try {
    //         let trails = await crud.select(
    //             ["Trail", "Has_trail"], 
    //             ["Trail.trail_ID", "Trail.trail_name", "Trail.elevation_gain", "Trail.difficulty", "Trail.trail_length", "Trail.trail_location", "Trail.water_station", "Trail.trail_description"], 
    //             ["Trail.trail_ID = Has_trail.trail_ID", "Has_trail.mountain_ID = " + mtnID],
    //             oB);
    //         trails.forEach((trail) => console.log(trail + "\n"));
    //     }
    //     catch(error) {
    //         console.log("Cannot retrieve trail list");
    //     }
    // }

    async getAssociatedTrailList(mtnID, oB) {
        try {
            let trails = await crud.select(
                ["Trail", "Mountain_Trail"], 
                ["Trail.trail_ID", "trail_name", "elevation_gain", "difficulty", "trail_length", "trail_location", "water_station", "trail_description"], 
                ["Trail.trail_ID = Mountain_Trail.trail_ID", "Mountain_Trail.mountain_ID = " + mtnID],
                oB);
            trails.forEach((trail) => console.log(trail + "\n"));
        }
        catch(error) {
            console.log("Cannot retrieve trail list");
        }
    }
}

module.exports = Trails;