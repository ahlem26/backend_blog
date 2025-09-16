import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { SECRETS } from "./config/secrets.js";
import blogRoutes from "./routes/blogRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Lire les origines autorisées depuis .env
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

app.use(cors({
  origin: function (origin, callback) {
    // autoriser si pas d’origin (Postman) ou si l’origin est dans la liste
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Hello World ✅");
});

// Routes
app.use("/blogs", blogRoutes);
app.use("/auth", authRoutes);

// Lancer serveur
app.listen(SECRETS.PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${SECRETS.PORT}`);
});
