import express from "express";
import dotenv from "dotenv";
import cors from "cors";   // ✅ importer cors
import { connectDB } from "./config/db.js";
import { SECRETS } from "./config/secrets.js";
// import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Autoriser les requêtes venant du frontend
app.use(cors({ origin: "http://localhost:5173" }));
// si ton frontend est en CRA => mets http://localhost:3000

app.use(express.json());

// Route de test
app.get("/", (req, res) => {
    res.send("Hello World ✅");
});

// Routes utilisateurs
// app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);
app.use("/auth", authRoutes);

// Démarrage du serveur
app.listen(SECRETS.PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${SECRETS.PORT}`);
});
