import multer from "multer";

// stockage en mémoire (pas de fichier temporaire sur disque)
const storage = multer.diskStorage({});
export const upload = multer({ storage });
