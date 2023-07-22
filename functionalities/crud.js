const db = require("../hiking-database/database.js");

let instance = null;

class CrudFunctions {
    static getInstance() {
        return instance ? instance : new CrudFunctions();
    }

    async insert(tb, atts, vals) {
        let attrs = atts.join(", ");
        let values = vals.join(", ");
        let sql = "INSERT INTO " + tb + "(" + attrs + ") VALUES(" + values +")";
        console.log(sql);
        return new Promise((resolve, reject) => {
            db.run(sql, (error) => {
                if(error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    }

    async select(tbs, atts, cds, oB) {
        let tables = tbs.join(", ");
        let attrs = (atts == null) ? "*" : atts.join(", ");
        let conds = (cds == null) ? "" : "WHERE " + cds.join(" AND ");
        let oBCmd = (orderBy == null) ? "" : " ORDER BY " + oB;
        let sql = "SELECT DISTINCT " + attrs + " FROM " + tables + conds + oBCmd;
        console.log(sql);
        return new Promise((resolve, reject) => {
            db.all(sql, (error, rows) => {
                if(error) {
                    reject(error);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }

    async update(tb, uds, cds) {
        let conds = cds.join(" AND ");
        let updates = uds.join(", ");
        let sql = "UPDATE " + tb + " SET " + updates + " WHERE " + conds;
        console.log(sql);
        return new Promise((resolve, reject) => {
            db.run(sql, (error) => {
                if(error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    }

    async delete(tb, cds) {
        let conds = cds.join(" AND ");
        let sql = "DELETE FROM " + tb + " WHERE " + conds;
        console.log(sql);
        return new Promise((resolve, reject) => {
            db.run(sql, (error) => {
                if(error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    }
}

module.exports = CrudFunctions;