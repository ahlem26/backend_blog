import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { SECRETS } from "./config/secrets.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Route de test
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Routes utilisateurs
app.use("/api/users", userRoutes);

// Démarrage du serveur
app.listen(SECRETS.PORT, () => {
    console.log(`Server is running on http://localhost:${SECRETS.PORT}`);
});
