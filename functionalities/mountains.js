const crudFunctions = require("./crud.js");

class Mountains {
    static getInstance() {
        return instance ? instance : new Mountains();
    }

    async getMountainList(cds, oB) {
        let crud = crudFunctions.getInstance();
        try {
            let promise = await crud.select(["Mountain"], null, cds, oB);
            for(let i = 0; i < res.length; i++) {
                console.log(promise[i] + "\n");
            }
        }
        catch(error) {
            console.log("Cannot retrieve mountain list");
        }
    }
}

module.exports = Mountains;