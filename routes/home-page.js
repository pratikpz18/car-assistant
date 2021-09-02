const express = require('express');
let router = express.Router();

router.get('/', async (req, res) => {
    if (!req.session.UID) {
        return res.redirect('/login');
    }
    return res.render('home-page');
})

module.exports = router;
