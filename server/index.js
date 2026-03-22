const express = require('express');
const cors = require('cors');
const { execSync } = require('child_process');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { compileLaTeX } = require('./compiler');
const { generatePPTLatex, generateReportLatex } = require('./latexGenerators');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeExt = ext || '.png';
    const base = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    cb(null, `${base}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
});

app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/api/health', (req, res) => {
  try {
    let version;
    if (process.platform === 'win32') {
      version = execSync('xelatex --version', { encoding: 'utf8', timeout: 5000 }).split('\n')[0];
    } else {
      execSync('which xelatex', { timeout: 5000 });
      version = execSync('xelatex --version', { encoding: 'utf8', timeout: 5000 }).split('\n')[0];
    }
    res.json({ ok: true, compiler: 'xelatex', version });
  } catch (e) {
    console.error('xelatex not found. Install with:');
    console.error('  Ubuntu/Debian: sudo apt install texlive-xetex texlive-full');
    console.error('  macOS:         brew install --cask mactex');
    console.error('  Windows:       Install MiKTeX or TeX Live');
    res.json({
      ok: false,
      compiler: null,
      message: 'xelatex not found. Install TeX Live or MiKTeX.'
    });
  }
});

// Compile endpoint
app.post('/api/compile', async (req, res) => {
  try {
    const { latex, mode } = req.body;
    if (!latex) {
      return res.status(400).json({ error: true, log: 'No LaTeX source provided' });
    }

    const result = await compileLaTeX(latex, mode);

    if (result.success) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="preview.pdf"');
      res.send(result.pdf);
    } else {
      res.status(422).json({ error: true, log: result.log });
    }
  } catch (err) {
    res.status(500).json({ error: true, log: err.message });
  }
});

function handleUpload(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: true, message: 'No image uploaded' });
  }

  const relPath = `/uploads/${req.file.filename}`;
  return res.json({
    filename: req.file.filename,
    path: relPath,
  });
}

app.post('/upload-image', upload.single('image'), handleUpload);
app.post('/api/upload-image', upload.single('image'), handleUpload);

function validateReportReferences(reportData) {
  const refs = reportData?.references;
  if (!Array.isArray(refs)) {
    return null;
  }

  const used = new Set();
  for (let i = 0; i < refs.length; i += 1) {
    const ref = refs[i];
    if (!ref || typeof ref === 'string') {
      continue;
    }

    const text = String(ref.text || '').trim();
    const key = String(ref.key || '').trim();

    if (text && !key) {
      return `Reference ${i + 1} has text but no citation key`;
    }

    if (!key) {
      continue;
    }

    if (used.has(key)) {
      return `Duplicate citation key: ${key}`;
    }

    used.add(key);
  }

  return null;
}

async function handleGeneratePPT(req, res) {
  try {
    const { pptData, output = 'pdf' } = req.body || {};
    if (!pptData) {
      return res.status(400).json({ error: true, message: 'Missing pptData' });
    }

    const latex = generatePPTLatex(pptData);
    if (output === 'latex') {
      return res.json({ latex });
    }

    const result = await compileLaTeX(latex, 'ppt');
    if (!result.success) {
      return res.status(422).json({ error: true, log: result.log });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="preview.pdf"');
    return res.send(result.pdf);
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
}

async function handleGenerateReport(req, res) {
  try {
    const { reportData, output = 'pdf' } = req.body || {};
    if (!reportData) {
      return res.status(400).json({ error: true, message: 'Missing reportData' });
    }

    const referenceError = validateReportReferences(reportData);
    if (referenceError) {
      return res.status(400).json({ error: true, message: referenceError });
    }

    const latex = generateReportLatex(reportData);
    if (output === 'latex') {
      return res.json({ latex });
    }

    const result = await compileLaTeX(latex, 'report');
    if (!result.success) {
      return res.status(422).json({ error: true, log: result.log });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="preview.pdf"');
    return res.send(result.pdf);
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
}

app.post('/generate-ppt', handleGeneratePPT);
app.post('/api/generate-ppt', handleGeneratePPT);
app.post('/generate-report', handleGenerateReport);
app.post('/api/generate-report', handleGenerateReport);

app.use((err, _req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof multer.MulterError || err.message === 'Only image files are allowed') {
    res.status(400).json({ error: true, message: err.message });
    return;
  }

  next(err);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[URP Studio] Server running on http://localhost:${PORT}`);
  
  // Check for xelatex on startup
  try {
    if (process.platform === 'win32') {
      execSync('xelatex --version', { timeout: 5000 });
    } else {
      execSync('which xelatex', { timeout: 5000 });
    }
    console.log('[URP Studio] xelatex found');
  } catch (e) {
    console.warn('[URP Studio] WARNING: xelatex not found. Install with:');
    console.warn('  Ubuntu/Debian: sudo apt install texlive-xetex texlive-full');
    console.warn('  macOS:         brew install --cask mactex');
    console.warn('  Windows:       Install MiKTeX or TeX Live');
  }
});
