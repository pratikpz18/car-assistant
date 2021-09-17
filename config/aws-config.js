let AWS = require("aws-sdk");
let dotenv = require("dotenv");
dotenv.config();

let awsConfig = {
    "region": process.env.REGION,
    "endpoint": process.env.ENDPOINT,
    "accessKeyId": process.env.ACCESS_KEY_ID,
    "secretAccessKey": process.env.SECRET_ACCESS_KEY
};
AWS.config.update(awsConfig);
module.exports = AWS;
