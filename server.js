// Imports
require("dotenv").config();

const express = require("express");
const db = require("./models/database");
const authenticateToken = require("./models/authentication");

// general Variables
const app = express();
app.use(express.json());

// Get Request
app.get("/users", authenticateToken, (req, res) => {
  const isactive = req.query.isActive;
  const query = "";
  if (isactive === true || isactive === false) {
    query = `SELECT * FROM users WHERE isactive = '${isactive}'`;
  } else {
    query = "SELECT * FROM users";
  }
  db.query(query, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/getRoutes", authenticateToken, (req, res) => {
  let query = `SELECT * FROM routes`;
  // console.log({ req });
  const user = req.user;
  try {
    db.query(query, (err, result) => {
      if (err) throw err;
      console.log(result, user.role);
      if (user.role === "doctor") {
        res.send(result[2]);
      } else if (user.role === "staff") {
        res.send(result[1]);
      } else {
        res.send(result[0]);
      }
    });
  } catch {
    res.send().status(500);
  }
});

// Checkup Details
app.post("/checkup", async (req, res) => {
  let patientid = req.body.patientid;
  let query = "INSERT INTO checkup SET ?";
  try {
    let details = {
      patientid: patientid,
      doctorname: req.body.doctorname,
      reason: req.body.reason,
      disease: req.body.disease,
      nextcheck: req.body.nextcheck,
    };
    db.query(query, details, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.status(201).send("patient details added");
    });
  } catch {
    res.status(500).send;
  }
});

// Setting Port Number
app.listen(4002);
