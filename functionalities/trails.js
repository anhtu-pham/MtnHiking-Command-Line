const crud = require("./crud.js");
let instance = null;

class Trails {
    static getInstance() {
        instance = instance ? instance : new Trails();
        return instance;
    }

    printOutput(data) {
      if(data.length == 0) {
        console.log("No trails satisfy this criteria");
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

    async getAssociatedTrailList(mtnID, oB) {
        try {
            let trails = await crud.select(
                ["Trail", "Mountain_Trail"], 
                ["Trail.trail_ID", "trail_name", "difficulty", "trail_length", "water_station", "trail_description"], 
                ["Trail.trail_ID = Mountain_Trail.trail_ID", "Mountain_Trail.mountain_ID = " + mtnID],
                oB);
            // trails.forEach((trail) => console.log(trail + "\n"));
            this.printOutput(trails);
        }
        catch(error) {
            console.log("Cannot retrieve trail list");
        }
    }

    async getTrailsWithAllTripsFinished() {
      try {
        let trails = await crud.select(
            ["Trail T", "Trip_Trail R1"], 
            ["T.trail_ID", "T.trail_name", "T.difficulty", "T.trail_length", "T.water_station", "T.trail_description"], 
            ["T.trail_ID = R1.trail_ID",
             "NOT EXISTS (SELECT DISTINCT R2.trip_ID FROM Trip_Trail R2 WHERE R2.trail_ID = R1.trail_ID EXCEPT SELECT DISTINCT trip_ID FROM Trip WHERE finished = 1)"],
            "T.trail_name");
        this.printOutput(trails);
      }
      catch(error) {
        console.log(error);
        console.log("Cannot retrieve trail list");
      }
    }

  async getSpanningTrails() {
    try {
      let trails = await crud.select(
          ["Trail T", "Mountain_Trail M1"], 
          ["T.trail_ID", "T.trail_name", "T.difficulty", "T.trail_length", "T.water_station", "T.trail_description"], 
          ["T.trail_ID = M1.trail_ID",
           "2 <= (SELECT COUNT(DISTINCT M2.mountain_ID) FROM Mountain_Trail M2 WHERE M2.trail_ID = M1.trail_ID)"],
          "T.trail_name");
      this.printOutput(trails);
    }
    catch(error) {
        console.log(error);
        console.log("Cannot retrieve trail list");
    }
}
}

module.exports = Trails;