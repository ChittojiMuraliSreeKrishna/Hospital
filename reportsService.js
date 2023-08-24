// Imports
require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const db = require("./models/database");
const authenticateToken = require("./models/authentication");

// general Variables
const app = express();
// parse application/json
app.use(bodyParser.json());

// Get Patient History
app.get("/getPatientHistory", authenticateToken, async (req, res) => {
  const patientId = req.query.patientid;
  try {
    const query = `SELECT * FROM checkup WHERE patientid = ${patientId}`;
    db.query(query, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("An error occurred while retrieving the user's medical history.");
  }
});

app.listen(4000);
