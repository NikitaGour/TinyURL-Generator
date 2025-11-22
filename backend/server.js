// server.js
require('dotenv').config();

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION', err && err.stack ? err.stack : err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION', reason && reason.stack ? reason.stack : reason);
});


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Link = require('./models/Link');

const app = express();
app.use(express.json());
app.use(cors());

app.use(cors()); // or app.use(cors());

const PORT = process.env.PORT || 4000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

function generateCode(len = 7) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// Connect to MongoDB
async function startDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set. Please create a .env file from .env.example and set MONGODB_URI');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}
startDb();

// Healthcheck
app.get('/healthz', (req, res) => {
  res.json({ ok: true, version: '1.0' });
});

// Create link
app.post('/api/links', async (req, res) => {
  try {
    const { url, code } = req.body || {};
    if (!url) return res.status(400).json({ error: 'Missing url' });

    // Validate URL
    try { new URL(url); } catch { return res.status(400).json({ error: 'Invalid URL' }); }

    let finalCode = code;
    if (finalCode) {
      if (!CODE_REGEX.test(finalCode)) {
        return res.status(400).json({ error: 'Code must match [A-Za-z0-9]{6,8}' });
      }
      const exists = await Link.findOne({ code: finalCode });
      if (exists) return res.status(409).json({ error: 'Code already exists' });
    } else {
      // generate unique
      for (let i = 0; i < 6; i++) {
        const candidate = generateCode();
        const exists = await Link.findOne({ code: candidate });
        if (!exists) { finalCode = candidate; break; }
      }
      if (!finalCode) finalCode = generateCode(8);
    }

    const newLink = await Link.create({
      code: finalCode,
      url,
    });

    return res.status(201).json(newLink);
  } catch (err) {
    console.error('POST /api/links error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// List all links
app.get('/api/links', async (req, res) => {
  try {
    const links = await Link.find({}).sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    console.error('GET /api/links error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Stats for single code
app.get('/api/links/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ code });
    if (!link) return res.status(404).json({ error: 'Not found' });
    return res.json(link);
  } catch (err) {
    console.error('GET /api/links/:code error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete link
app.delete('/api/links/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ code });
    if (!link) return res.status(404).json({ error: 'Not found' });
    await Link.deleteOne({ code });
    return res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/links/:code error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Redirect route
app.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    if (code === 'api' || code === 'healthz' || code === 'favicon.ico') {
      return res.status(404).send('Not found');
    }

    const link = await Link.findOne({ code });
    if (!link) return res.status(404).send('Not found');

    link.totalClicks = (link.totalClicks || 0) + 1;
    link.lastClicked = new Date();
    await link.save();

    return res.redirect(302, link.url);
  } catch (err) {
    console.error('Redirect error:', err);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
