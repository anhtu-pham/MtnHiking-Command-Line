const crud = require("./crud.js");
const fs = require("fs");
let instance = null;

class Mountains {
  static getInstance() {
    instance = instance ? instance : new Mountains();
    return instance;
  }

  printOutput(data) {
    if(data.length == 0) {
      console.log("No mountains satisfy this criteria");
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

  async getMountainList(cds, oB) {
    try {
      let mountains = await crud.select(["Mountain"], null, cds, oB);
    //   console.log(mountains);
    //   mountains.forEach((mountain) => console.log(mountain + "\n"));
        this.printOutput(mountains);
    } catch (error) {
      console.log("Cannot retrieve mountain list");
    }
  }

  async getSpecialPlaces(mountainID) {
    try {
      let specialPlaceList = await crud.select(
        ["Mountain", "Contains_Special_place"],
        ["place_name", "Contains_Special_place.elevation", "special_quality"],
        [
          "Mountain.mountain_ID = Contains_Special_place.mountain_ID",
          "Mountain.mountain_ID = " + mountainID,
        ],
        null
      );
    //   specialPlaceList.forEach((specialPlace) =>
    //     console.log(specialPlace + "\n")
    //   );
        this.printOutput(specialPlaceList);
    } catch (error) {
      console.log("Cannot retrieve special places");
    }
  }

  async getConditions(mountainID) {
    try {
      let conditionList = await crud.select(
        ["Mountain", "Faces_Condition"],
        ["condition_name", "description"],
        [
          "Mountain.mountain_ID = Faces_Condition.mountain_ID",
          "Mountain.mountain_ID = " + mountainID,
        ],
        null
      );
    //   conditionList.forEach((condition) => console.log(condition + "\n"));
        this.printOutput(conditionList);
    } catch (error) {
      console.log("Cannot retrieve conditions");
    }
  }
}

module.exports = Mountains;