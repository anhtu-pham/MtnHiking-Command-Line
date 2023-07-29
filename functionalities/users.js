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
            )
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
                null);
            usedUsername = user[0]["username"];
            console.log("Login succeeded");
        }
        catch(error) {
            console.log("Login failed");
        }
    }

    logout() {
        this.usedUsername = null;
    }
}

module.exports = Users;