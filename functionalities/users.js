const crud = require("./crud.js");

let instance = null;

class Users {

    usedUsername = null;

    static getInstance() {
        instance = instance ? instance : new Users();
        return instance;
    }

    async signUp(username, email, password) {
        try {
            await crud.insert(
                "User",
                ["username", "email", "password"],
                ["\'" + username + "\'", "\'" + email + "\'", "\'" + password + "\'"]
            );
            this.usedUsername = username;
        }
        catch(error) {
            console.log(error);
            console.log("Username has been chosen. Please use another one.");
            throw(error);
        };
    }
    async logIn(username, password) {
        try {
            let user = await crud.select(
                ["User"], 
                null, 
                ["username = \'" + username + "\'", "password = \'" + password + "\'"], 
                null,
                1);
            usedUsername = user[0]["username"];
            console.log("Login succeeded");
        }
        catch(error) {
            console.log("Login failed");
        }
    }

    async updateInfo(username, age, phoneNumber, currentLocation, fitnessLevel, emergencyContact) {
        let toUpdate = [];
        if(age != "U") {
            toUpdate.push("age = " + age);
        }
        if(phoneNumber != "U") {
            toUpdate.push("phone_number = \'" + phoneNumber + "\'");
        }
        if(currentLocation != "U") {
            toUpdate.push("current_location = \'" + currentLocation + "\'");
        }
        if(fitnessLevel != "U") {
            toUpdate.push("fitness_level = " + fitnessLevel);
        }
        if(emergencyContact != "U") {
            toUpdate.push("emergency_contact = \'" + emergencyContact + "\'");
        }
        try {
            await crud.update("User", toUpdate, ["username = \'" + username + "\'"]);
        }
        catch(error) {
            console.log("Cannot update optional information for user");
        }
    }

    logout() {
        this.usedUsername = null;
    }
}

module.exports = Users;