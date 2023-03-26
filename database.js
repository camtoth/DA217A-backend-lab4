const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')
const bcrypt = require("bcrypt")

const init = () => {
    db.serialize(async () => {
        db.run(`CREATE TABLE User (userID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL, role INTEGER NOT NULL)`)
        db.run(`INSERT INTO User (username, password, role) VALUES ('user1', '${await bcrypt.hash('password', 10)}',1)`)
        db.run(`INSERT INTO User (username, password, role) VALUES ('user2', '${await bcrypt.hash('password1', 10)}',1)`)
        db.run(`INSERT INTO User (username, password, role) VALUES ('user3', '${await bcrypt.hash('password2', 10)}',0)`)
        db.run(`INSERT INTO User (username, password, role) VALUES ('admin', '${await bcrypt.hash('admin', 10)}',2)`)
    })
}

const getAllUsers = async() => {
    return new Promise ((resolve, reject) => {
       //here you need to add the sql query to retrieve data from the DB
        db.all("SELECT * FROM User" ,(error, result) => {
            if (error){
                reject(error)
            }
            else
                resolve(result)
        })
    })
}

const getPasswordFromUsername = (username) => {
    return new Promise ((resolve, reject) => {
        //here you need to add the sql query to retrieve data from the DB
         db.get(`SELECT username, password FROM User WHERE username = '${username}'` ,(error, row) => {
             if (error){
                 reject(error)
             }
             else {
                resolve(row?.password);
             }
         })
     })
}

const getRoleFromUsername = (username) => {
    return new Promise ((resolve, reject) => {
        //here you need to add the sql query to retrieve data from the DB
         db.get(`SELECT role FROM User WHERE username = '${username}'` ,(error, row) => {
             if (error){
                 reject(error)
             }
             else {
                resolve(row?.role);
             }
         })
     })
}

const addUser = (username, password, role) => {
    return new Promise ((resolve, reject) => {
        db.all(`INSERT INTO User (username, password, role) VALUES ('${username}', '${password}', '${role}')` , (error, result) => {
            if (error){
                reject(error)
            }
            else
                resolve(result)
        })
    })
}

module.exports = {init, getAllUsers, getPasswordFromUsername, getRoleFromUsername, addUser}
