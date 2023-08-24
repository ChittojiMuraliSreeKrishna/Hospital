// Imports
require("dotenv").config();

const express = require("express");
const db = require("./models/database");

const app = express();

// Create DataBase
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE IF NOT EXISTS nquest";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("database created...");
  });
});

// Create StaffTable
app.get("/userstable", async (req, res) => {
  let sql =
    "CREATE TABLE IF NOT EXISTS users(id int AUTO_INCREMENT, clientid INT(10), firstname VARCHAR(255), lastname VARCHAR(255), name VARCHAR(255), password VARCHAR(255), designation VARCHAR(255), role VARCHAR(255), email VARCHAR(255), mobile INT(10), address VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, is_active BOOLEAN, primary key(id))";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send("users table created");
  });
});

// Create PatientTable
app.get("/patientstable", async (req, res) => {
  let sql =
    "CREATE TABLE IF NOT EXISTS patients(id int AUTO_INCREMENT, clientid INT(10), firstname VARCHAR(255), lastname VARCHAR(255), name VARCHAR(255), password VARCHAR(255), email VARCHAR(255), mobile INT(10), address VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, primary key(id))";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send("patients table created");
  });
});

// Create RoleTable
app.get("/roletable", async (req, res) => {
  let sql = `CREATE TABLE IF NOT EXISTS roles(id int AUTO_INCREMENT, role VARCHAR(255), primary key(id))`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send("role table created");
  });
});

// Create Hospital Table
app.get("/hospitaltable", async (req, res) => {
  let sql = `CREATE TABLE IF NOT EXISTS hospital(id int AUTO_INCREMENT, name VARCHAR(255), state VARCHAR(255), city VARCHAR(255), address VARCHAR(255), phoneno int(10), clientid INT(10), userid INT(10), primary key(id))`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send("hospital table created");
  });
});

// Create Checkups Table
app.get("/checkuptable", async (req, res) => {
  let sql = `CREATE TABLE IF NOT EXISTS checkup(id int AUTO_INCREMENT, patientid INT(20), doctorname VARCHAR(255), reason VARCHAR(255), disease VARCHAR(255), nextcheck TIMESTAMP, primary key(id))`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send("checkup table created");
  });
});

app.listen(4004);
