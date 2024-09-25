import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const connectionPool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const testConnection = async () => {
  try {
    const connection = await connectionPool.getConnection();
    console.log("connected to database successfully");
  } catch (error) {
    throw new Error("Error connecting to database", error.message);
  }
};
testConnection();
