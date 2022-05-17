// const mysql = require("mysql2/promise"); // object
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "block4.cjcokpqq3ufq.ap-northeast-2.rds.amazonaws.com",
  user: "admin",
  password: "qwer1234",
  database: "block4ky",
});

// console.log(pool)

// async function select() {
//   try{

//     const sql = `SELECT * FROM blocks_tx`
//     const [result] = await pool.query(sql) // pool.query -> getConnection + query + release 전부다 가능함.(개사기)
//     console.log(result)
//   } catch(e) {
//     console.log('에러?')
//   }
// }

// select()

export { pool }