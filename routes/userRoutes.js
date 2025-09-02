import express from "express";
import { createUser, getUsers, getUserById } from "../controllers/userController.js";

const router = express.Router();

// Ajouter un utilisateur
router.post("/", createUser);

// Lister tous les utilisateurs
router.get("/", getUsers);

// Récupérer un utilisateur par ID
router.get("/:id", getUserById);

export default router;
