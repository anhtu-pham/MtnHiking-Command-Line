const crud = require("./crud.js");
let instance = null;

class Mountains {
    static getInstance() {
        instance = instance ? instance : new Mountains();
        return instance;
    }

    async getMountainList(cds, oB) {
        try {
            let mountains = await crud.select(["Mountain"], null, cds, oB);
            mountains.forEach((mountain) => console.log(mountain + "\n"));
        }
        catch(error) {
            console.log("Cannot retrieve mountain list");
        }
    }

    async getSpecialPlaces(mountainID) {
        try {
            let specialPlaceList = await crud.select(
                ["Mountain", "Contains_Special_place"],
                ["place_name", "Contains_Special_place.elevation", "special_quality"],
                ["Mountain.mountain_ID = Contains_Special_place.mountain_ID", "Mountain.mountain_ID = " + mountainID],
                null,
            );
            specialPlaceList.forEach((specialPlace) => console.log(specialPlace + "\n"));
        }
        catch(error) {
            console.log("Cannot retrieve special places");
        }
    }

    async getConditions(mountainID) {
        try {
            let conditionList = await crud.select(
                ["Mountain", "Faces_Condition"],
                ["condition_name", "description"],
                ["Mountain.mountain_ID = Faces_Condition.mountain_ID", "Mountain.mountain_ID = " + mountainID],
                null,
            );
            conditionList.forEach((condition) => console.log(condition + "\n"));
        }
        catch(error) {
            console.log("Cannot retrieve conditions");
        }
    }
}

module.exports = Mountains;