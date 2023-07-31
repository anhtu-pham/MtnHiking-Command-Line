const db = require("../hiking-database/database_connection.js");

async function insert(tb, atts, vals) {
  let attrs = atts.join(", ");
  let values = vals.join(", ");
  let sql = "INSERT INTO " + tb + " (" + attrs + ") VALUES (" + values + ")";
  // console.log(sql);
  return new Promise((resolve, reject) => {
    db.run(sql, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function select(tbs, atts, cds, oB, rowConstraint = 0) {
  let tables = tbs.join(", ");
  let attrs = atts == null ? "*" : atts.join(", ");
  let conds = cds == null ? "" : " WHERE " + cds.join(" AND ");
  let oBCmd = oB == null ? "" : " ORDER BY " + oB;
  let rows = rowConstraint == 0 ? "" : " LIMIT " + rowConstraint;
  let sql =
    "SELECT DISTINCT " + attrs + " FROM " + tables + conds + oBCmd + rows;
  // console.log(sql);
  return new Promise((resolve, reject) => {
    db.all(sql, (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
}

async function update(tb, uds, cds) {
  let conds = cds.join(" AND ");
  let updates = uds.join(", ");
  let sql = "UPDATE " + tb + " SET " + updates + " WHERE " + conds;
  // console.log(sql);
  return new Promise((resolve, reject) => {
    db.run(sql, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function remove(tb, cds) {
  let conds = cds.join(" AND ");
  let sql = "DELETE FROM " + tb + " WHERE " + conds;
  // console.log(sql);
  return new Promise((resolve, reject) => {
    db.run(sql, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

const crudFunctions = {
  insert: insert,
  select: select,
  update: update,
  remove: remove,
};

module.exports = crudFunctions;