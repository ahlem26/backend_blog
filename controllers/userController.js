import { User } from "../models/User.js";

// @desc    Créer un nouvel utilisateur
// @route   POST /api/users
export const createUser = async (req, res) => {
    const { name, email } = req.body;
    try {
        const user = await User.create({ name, email });
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Récupérer tous les utilisateurs
// @route   GET /api/users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Récupérer un utilisateur par ID
// @route   GET /api/users/:id
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
