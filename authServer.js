// Imports
require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const db = require("./models/database");

// general Variables
const app = express();
// parse application/json
app.use(bodyParser.json());
let refreshTokens = [];

// Post Request('Creating User')
app.post("/auth/signup", async (req, res) => {
  let password = req.body.password;
  let name = req.body.firstname + "." + req.body.lastname;
  try {
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(req.body);
    let query = "SELECT * FROM users WHERE name = ?";
    db.query(query, name, (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        let sql = "INSERT INTO users SET ?";
        let user = {
          clientid: req.body.clientid,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          name: name,
          password: hashedPassword,
          role: req.body.role,
          designation: req.body.designation,
          email: req.body.email,
          mobile: req.body.mobile,
          address: req.body.address,
        };

        db.query(sql, user, (err, result) => {
          if (err) throw err;
          console.log(result);
          res.status(201).send("user added...");
        });
      } else {
        res.status(401).send();
      }
    });
  } catch {
    res.status(500).send();
  }
});

// Post Request('Creating patient')
app.post("/auth/patient/signup", async (req, res) => {
  let password = req.body.password;
  let name = req.body.firstname + "." + req.body.lastname;
  try {
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(req.body);
    let query = "SELECT * FROM patients WHERE name = ?";
    db.query(query, name, (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        let sql = "INSERT INTO patients SET ?";
        let user = {
          clientid: req.body.clientid,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          name: name,
          password: hashedPassword,
          email: req.body.email,
          mobile: req.body.mobile,
          address: req.body.address,
        };

        db.query(sql, user, (err, result) => {
          if (err) throw err;
          console.log(result);
          res.status(201).send("user added...");
        });
      } else {
        res.status(401).send();
      }
    });
  } catch {
    res.status(500).send();
  }
});

// Post Request('Logiging in User')
app.post("/auth/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  // console.log(req);
  let query = `SELECT * FROM users WHERE name = '${username}'`;
  db.query(query, async (err, result) => {
    if (err) throw err;
    if (!result || !result.length) {
      return res.status(400).send(`Invalid user login ${username}`);
    }
    const user = result[0];
    const accessToken = generateAccessToken(
      user.name,
      user.role,
      user.hospital
    );
    try {
      if (await bcrypt.compareSync(password, user.password)) {
        const refreshToken = jwt.sign(user.name, process.env.REFRESH_TOKEN);
        refreshTokens.push(refreshToken);
        res.json({ accessToken: accessToken, refreshToken: refreshToken });
        res.send("success");
      } else {
        res.send("Invalid User");
      }
    } catch {
      res.status(500).send();
    }
  });
});

app.post("/auth/activity", async (req, res) => {
  let username = req.body.username;
  let isactive = req.body.isactive;
  let sql = `UPDATE users SET is_active='${isactive}' WHERE name = '${username}'`;
  try {
    db.query(sql, async (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch {
    res.status(500).send();
  }
});

// Get All Roles
app.get("/auth/roles", async (req, res) => {
  let query = "SELECT * FROM roles";
  db.query(query, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken === null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken(user);
    res.json({ accessToken: accessToken });
  });
});

function generateAccessToken(name, role, hospital) {
  const tokenPayload = { name: name, role: role, hospital: hospital };
  console.log(name, role);
  return jwt.sign(tokenPayload, process.env.ACCESS_TOKEN, { expiresIn: "15m" });
}

// Setting Port Number
app.listen(4001);
