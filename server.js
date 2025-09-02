import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { User } from "./models/User.js";

dotenv.config();
connectDB();
const app = express();
app.use(express.json())

app.get("/", (req,res) => {
    res.send("Hello World");
});

app.post("/users", async (req,res) => {
    const {name, email} =req.body;
    try {
        const user = await User.create({name, email});
        res.status(201).json({message: "User created successfully", user});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

app.listen(process.env.PORT, () => {
    console.log(`server is running on port http://localhost:${process.env.PORT}`);
});