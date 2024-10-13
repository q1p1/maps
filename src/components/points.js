const express = require("express");
const router = express.Router();
const mysql = require("mysql");

// إعداد اتصال MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // استبدلها باسم المستخدم الخاص بـ MySQL
  password: "Meshari2002@", // استبدلها بكلمة المرور الخاصة بـ MySQL
  database: "project_db", // استبدلها باسم قاعدة البيانات التي تستخدمها
});

// الاتصال بقاعدة البيانات
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

 router.get("/points/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = "SELECT * FROM points WHERE user_id = ?";

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching points:", err);
      res.status(500).send("Error fetching points");
      return;
    }
    res.json(results); // إرجاع البيانات إلى العميل كـ JSON
  });
});

module.exports = router;
