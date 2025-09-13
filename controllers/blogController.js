import { Blog } from "../models/Blog.js";
import cloudinary from "../config/cloudinary.js";


// @desc    Créer un blog (Admin / User connecté)
// @route   POST /api/blogs
export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    let imageUrl = null;
    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "blogs",
      });
      imageUrl = uploadRes.secure_url;
    }

    const blog = await Blog.create({
      title,
      content,
      author: req.user._id,   // récupéré via authMiddleware
      image: imageUrl,        // <-- sauvegarde du lien Cloudinary
    });

    // Compter les blogs de cet utilisateur
    const blogsCount = await Blog.countDocuments({ author: req.user._id });

    res.status(201).json({ message: "Blog créé avec succès", blog, blogsCount, });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Récupérer tous les blogs avec pagination
// @route   GET /api/blogs?page=1&limit=10
export const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;  // par défaut page 1
    const limit = parseInt(req.query.limit) || 5; // par défaut 5 blogs par page
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments();

    res.status(200).json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBlogs: total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// @desc    Récupérer un blog par ID
// @route   GET /api/blogs/:id
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name email");
    if (!blog) return res.status(404).json({ message: "Blog introuvable" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Supprimer un blog (Admin / Auteur)
// @route   DELETE /api/blogs/:id
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog introuvable" });

    // Vérifier que l'auteur correspond à l'utilisateur connecté
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé ❌" });
    }

    await blog.deleteOne();
    res.status(200).json({ message: "Blog supprimé avec succès ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Modifier un blog
// @route   PUT /api/blogs/:id
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog introuvable" });

    // Vérifie si l’utilisateur est bien l’auteur
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé ❌" });
    }

    // Mettre à jour les champs
    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;

    // Si une nouvelle image est envoyée
    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "blogs",
      });
      blog.image = uploadRes.secure_url;
    }

    const updatedBlog = await blog.save();
    res.status(200).json({ message: "Blog modifié ✅", blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
