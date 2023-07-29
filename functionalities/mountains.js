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
}

module.exports = Mountains;