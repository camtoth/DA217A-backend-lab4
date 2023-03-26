const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require('./database')
require("dotenv").config();

const app = express();
app.set('view-engine', 'ejs');

const roles = ["teacher", "student", "admin"];
let currentKey = '';

app.use(express.urlencoded({extended: false}));
app.use(express.json());
db.init();

app.get('/', (req, res) => {
    req.method = 'GET'; //not strictly necessary but good for readability
    res.redirect("/LOGIN");
})

app.get('/LOGIN', (req, res) => {
    res.render('login.ejs');
})

app.post('/LOGIN', async (req, res) => {
    if((req.body.username != '')) {
        try {
            const encryptedPassword = await db.getPasswordFromUsername(req.body.username);

            if(encryptedPassword && (await bcrypt.compare(req.body.password, encryptedPassword))) {
                let token = jwt.sign(req.body.username, process.env.ACCESS_TOKEN_SECRET);
                currentKey = token;
                console.log("TOKEN: " + token);
                res.render('start.ejs');
            } else {
                res.render('fail.ejs');
            }
        } catch (err) {
            console.log("ERROR: bcrypt.compare failed " + err);
        }
    }
})

function authenticateToken (req, res, next) {
    console.log(currentKey)
    if (currentKey == ""){
        res.redirect("/LOGIN")
    } else if (jwt.verify(currentKey, process.env.ACCESS_TOKEN_SECRET)){
        next()
    } else {
        res.render('fail.ejs')
    }
}

app.get('/admin', authenticateToken, (req, res, next) => {
    authenticateToken(req, res, next)
    res.render('admin.ejs', {users: [{userID: 3, name: "name3", role: "clown", password:'admin'}]});
})

app.get('/REGISTER', (req, res) => {
    res.render('register.ejs');
})

app.post('/REGISTER', async (req, res) => {
    if((req.body.username != '') && (req.body.password != '')) {
        try {
            const passwordEncryption = await bcrypt.hash(req.body.password, 10);
            console.log(roles.indexOf(req.body.role))
            let dbResult = await db.addUser(req.body.username, passwordEncryption, roles.indexOf(req.body.role));
        } catch (err) {
            console.log(err)
        }
    }

    req.method = 'GET';
    res.redirect("/LOGIN");
})

app.listen(5000)