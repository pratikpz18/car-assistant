const express = require('express');
let router = express.Router();

router.get('/login', async (req, res) => {
    if (req.session.UID) {
        return res.redirect('/');
    }
    return res.render('login-page');
})

router.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (email && password) {
        console.log("Got it");
        console.log(email, password);
    } else {
        console.log("Plz enter credentials");
    }
})

router.get('/register', async (req, res) => {
    return res.render('register-page');
})

module.exports = router;
