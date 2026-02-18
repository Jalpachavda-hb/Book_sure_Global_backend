// import mysql from "mysql2";
// import dotenv from "dotenv";

// dotenv.config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   timezone: 'Z',
//   dateStrings: true, 
//   supportBigNumbers: true,
//   bigNumberStrings: true
// });

// db.connect((err) => {
//   if (err) {
//     console.error("❌ MySQL connection failed:", err);
//   } else {
//     console.log("✅ MySQL Connected Successfully");
//   }
// });

// export default db;

import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: 'Z', // Force UTC timezone
  dateStrings: true, // Return dates as strings instead of JavaScript Date objects
  supportBigNumbers: true,
  bigNumberStrings: true
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ MySQL Connected Successfully");
    
    // Set session timezone to UTC
    db.query("SET time_zone = '+00:00';", (err) => {
      if (err) {
        console.error("Failed to set timezone:", err);
      } else {
        console.log("✅ MySQL timezone set to UTC");
      }
    });
  }
});

export default db;