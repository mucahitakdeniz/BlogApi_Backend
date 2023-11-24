"use strict";

const express = require("express");
const app = express();

require("dotenv").config();
const HOST = process.env?.HOST || "127.0.0.1";
const PORT = process.env?.PORT || 8000;

//error handler for async errors
require("express-async-errors");

// Connect to DB:
const {dbConnection} =require('./src/configs/dbConnection')
dbConnection()

//Accept JSON
app.use(express.json())



app.use(require('./src/routes'))
app.get("/", (req, res) => res.send("Hello World!"));

//routes

//error handler
app.use(require('./src/middlewares/errorHandler'))
app.listen(PORT, () => console.log(`${PORT}`));
