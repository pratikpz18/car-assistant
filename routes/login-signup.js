const express = require('express');
let router = express.Router();

let AWS = require('../config/aws-config')
let docClient = new AWS.DynamoDB.DocumentClient();

async function getUser(email, password) {
    let params = {
        TableName: "carOwners",
        Key: {
            "ownerID": email
        }
    };
    let response;
    try {
        response = await docClient.get(params).promise()
    } catch (error) {
        //Error in Checking values from DB
        console.log(error.code)
        console.log(error.statusCode)
        return false
    }
    if (response.Item && response.Item.details.password == password) {
        return true; //Account exists
    } else {
        return false; //Account doesn't exists
    }
}

async function isEmailExist(email) {
    let params = {
        TableName: "carOwners",
        Key: {
            "ownerID": email
        }
    };
    let response;
    try {
        response = await docClient.get(params).promise()
    } catch (error) {
        //Error in Checking values from DB
        console.log(error.code)
        console.log(error.statusCode)
        return false
    }
    console.log(response);
    if (response.Item) {
        return true; //Email already taken
    } else {
        return false; //Email is ready to be used
    }
}

async function createAccount(email, password) {
    let params = {
        TableName: "carOwners",
        Item: {
            "ownerID": email,
            //default values
            "details": {
                "name": "NA",
                "password": password,
                "email": email,
                "contactNo": 0
            }
        }
    };
    let response;
    try {
        response = await docClient.put(params).promise()
    } catch (error) {
        //Error in Checking values from DB
        console.log(error.code)
        console.log(error.statusCode)
        return false
    }
    return true;
}

router.get('/login', async (req, res) => {
    if (req.session.UID) { // Check if user is already logged in
        return res.redirect('/');
    }
    return res.render('login-page', {
        msg: ""
    });
})

router.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (email && password) {
        const isAccountExist = await getUser(email, password);
        if (isAccountExist) {
            req.session.UID = email; // User autharized
            return res.redirect('/');
        } else {
            return res.render('login-page', {
                msg: "Please, enter valid email & password"
            });
        }
    } else {
        return res.render('login-page', {
            msg: "Please, enter emailId & password"
        });
    }
})

router.get('/register', async (req, res) => {
    if (req.session.UID) { // Check if user is already logged in
        return res.redirect('/');
    }
    return res.render('register-page', {
        msg: ""
    });
})

router.post('/register', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (email && password) {
        const isEmailTaken = await isEmailExist(email);
        if (!isEmailTaken) {
            let msg = "Something went bad, Please try again";
            const isAccountCreatedSuccessfully = await createAccount(email, password);
            if (isAccountCreatedSuccessfully) {
                msg = "Account created successfully, Please login";
            }
            return res.render('register-page', {
                msg: msg
            });
        } else {
            return res.render('register-page', {
                msg: "Email already exists. Please login"
            });
        }
    } else {
        return res.render('register-page', {
            msg: "Please, enter emailId & password"
        });
    }
})

router.get('/logout', async (req, res) => {
    req.session.destroy();
    return res.redirect('/login');
})

module.exports = router;
