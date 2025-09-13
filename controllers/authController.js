import { User } from "../models/User.js";
import { Blog } from "../models/Blog.js";
import jwt from "jsonwebtoken";
import { SECRETS } from "../config/secrets.js";
import cloudinary from "../config/cloudinary.js";


// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, SECRETS.JWT_SECRET, { expiresIn: "1h" });
};

// @desc    Inscription
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  const { name, email, password, avatar } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email déjà utilisé" });

    const user = await User.create({ name, email, password, avatar: avatar || "", });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Connexion
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar, // ajouter avatar dans la réponse
        token: generateToken(user._id),
        createdAt: user.createdAt,
      });
    } else {
      res.status(401).json({ message: "Identifiants invalides" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Modifier profil utilisateur
// @route   PUT /api/auth/profile
// @access  Privé

export const updateUserProfile = async (req, res) => {
  try {

    // req.user est injecté par authMiddleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Mise à jour des champs
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Si un fichier avatar a été uploadé (multer)
    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
      });
      user.avatar = uploadRes.secure_url;
    }


    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Erreur updateUserProfile:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir le profil utilisateur avec nombre de blogs
// @route   GET /api/auth/profile
// @access  Privé
export const getUserProfile = async (req, res) => {
  try {
    // récupérer l'utilisateur connecté (req.user est injecté par ton middleware auth)
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // compter ses blogs
    const blogsCount = await Blog.countDocuments({ author: user._id });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      blogsCount, // ✅ ici le compteur
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
