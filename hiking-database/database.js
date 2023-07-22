const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("./the_database.db", (error) => {
    if(error) {
        console.log(error.message);
        console.log("Cannot connect");
    }
    console.log("Successfully connected to the database");
});

module.exports = db;