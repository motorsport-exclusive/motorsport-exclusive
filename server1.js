const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Serve HTML/CSS/JS (if needed)
app.use(express.static(path.join(__dirname, '/')));

// MongoDB Connection
mongoose.connect('mongodb+srv://knvknitheshvinny:R13dHeKlvKWSUgJC@test.umwrdva.mongodb.net/?retryWrites=true&w=majority&appName=test')
  .then(() => console.log('✅ Connected to MongoDB Atlas!'))
  .catch((err) => console.error('❌ Error connecting to MongoDB Atlas', err));

// Create uploads folder if not exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Article Model
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String }
}, { timestamps: true }); // createdAt, updatedAt automatically

const Article = mongoose.model('Article', articleSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save with timestamp
  }
});
const upload = multer({ storage });

// API Routes

// POST: Upload new article
app.post('/api/articles', upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const article = new Article({ title, content, imageUrl });
    await article.save();

    res.status(201).json({ success: true, message: 'Article added successfully', article });
  } catch (err) {
    console.error('❌ Error adding article:', err);
    res.status(500).json({ success: false, error: 'Failed to add article' });
  }
});

// GET: Fetch all articles
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error('❌ Error fetching articles:', err);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// DELETE: Delete article by ID
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Delete image if it exists
    if (article.imageUrl) {
      const imagePath = path.join(__dirname, article.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Article.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Article deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting article:', err);
    res.status(500).json({ success: false, error: 'Failed to delete article' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
