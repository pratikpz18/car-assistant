const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
const session = require('express-session');

let app = express();
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.json({}));
dotenv.config();

app.set('trust proxy', 1);
const secretKey = process.env.SECRET_SESSION_KEY;
app.use(session({
    secret: secretKey,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000 // 1 hr
    }
}))

app.get('/', async (req, res) => {
    req.session.UID = 1; //test
    return res.render('home-page');
})

app.get('/login-page', async (req, res) => {
    console.log(req.session); //test
    return res.render('login-page');
})

app.get('/register-page', async (req, res) => {
    return res.render('register-page');
})
const PORT = process.env.PORT;
app.listen(PORT, async (err) => {
    console.log('Server is running on localhost:' + PORT);
});
