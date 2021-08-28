const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')

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

app.get('/', async (req, res) => {
    return res.render('home-page');
})

const PORT = process.env.PORT;
app.listen(PORT, async (err) => {
    console.log('Server is running on localhost:' + PORT);
});
