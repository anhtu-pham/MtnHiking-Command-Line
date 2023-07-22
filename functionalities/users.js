const crudFunctions = require("./crud.js");
// const Mountains = require("./mountains.js");

let instance = null;

class Users {

    usedUsername = null;
    mountains = require("./mountains.js");

    static getInstance() {
        return instance ? instance : new Users();
    }

    async signUp(username, email, password) {
        let crud = crudFunctions.getInstance();
        try {
            let promise = await crud.insert(
                db, 
                "User",
                ["username", "email", "password"],
                ["\'" + username + "\'", "\'" + email + "\'", "\'" + password + "\'"]
            )
        }
        catch(error) {
            console.log("Signup failed");
        };
    }
    async logIn(username, password) {
        let crud = crudFunctions.getInstance();
        try {
            let promise = await crud.select(
                ["User"], 
                null, 
                ["username = \'" + username + "\'", "password = \'" + password + "\'"], 
                null);
            if(promise.length == 1) {
                usedUsername = promise[0]["username"];
                console.log("Login succeeded");
            }
            else {
                console.log("Login failed");
            }
        }
        catch(error) {
            console.log("Login failed");
        }
    }

    logout() {
        usedUsername = null;
    }
}

module.exports = Users;