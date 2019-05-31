const mongoose = require("mongoose");
const logger = require("morgan");
const express = require('express');
const app = express();

const PORT = 8008;
const db = require("./models");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

const exhb = require("express-handlebars");
app.engine("handlebars", exhb({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

mongoose.connect('mongodb://localhost/scraped', { useNewUrlParser: true });


app.listen(PORT, () => console.log(`Scraper is now running on https://localhost:${PORT} !`));