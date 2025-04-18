// routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Set storage destination and filename
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // must match the folder name
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// POST /api/upload
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;
