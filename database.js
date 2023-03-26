const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

const init = () => {
    db.serialize(() => {
        db.run("CREATE TABLE User (username TEXT, password TEXT)")
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

const addUser = (username, password) => {
    return new Promise ((resolve, reject) => {
        db.all(`INSERT INTO User (username, password) VALUES ('${username}', '${password}')` , (error, result) => {
            if (error){
                reject(error)
            }
            else
                resolve(result)
        })
    })
}

module.exports = {init, getPasswordFromUsername, addUser}
