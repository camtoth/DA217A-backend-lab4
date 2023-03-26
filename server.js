const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require('./database')
require("dotenv").config();

const app = express();
app.set('view-engine', 'ejs');

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
                let token = jwt.sign(req.body.username, process.env.TOKEN);
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

app.get('/REGISTER', (req, res) => {
    res.render('register.ejs');
})

app.post('/REGISTER', async (req, res) => {
    if((req.body.username != '') && (req.body.password != '')) {
        try {
            const passwordEncryption = await bcrypt.hash(req.body.password, 10);
            let dbResult = await db.addUser(req.body.username, passwordEncryption);
        } catch (err) {
            console.log(err)
        }
    }

    req.method = 'GET';
    res.redirect("/LOGIN");
})

app.listen(5000)