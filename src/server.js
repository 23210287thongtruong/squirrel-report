import express from "express";
import { Pool } from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

app.use(cors()); // Enable CORS for all origins

// API endpoint to get salary data
app.get("/api/salaries", async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT lt.*, nv.hoten, pb.tenpb
            FROM luongthang lt
            JOIN nhanvien nv ON lt.nhanvienid = nv.nhanvienid
            JOIN phongban pb ON nv.phongban = pb.phongbanid
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi khi truy vấn dữ liệu" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
