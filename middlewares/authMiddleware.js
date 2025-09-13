import jwt from "jsonwebtoken";
import { SECRETS } from "../config/secrets.js";
import { User } from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Accès non autorisé, token manquant" });
  }

  try {
    const decoded = jwt.verify(token, SECRETS.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // attache l’utilisateur au req
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};
