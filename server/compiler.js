const { spawn, execSync } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs/promises');
const fsSync = require('fs');
const { v4: uuid } = require('uuid');

const TEMPLATES_DIR = path.join(__dirname, 'templates');
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const TIMEOUT_MS = 45000;

function collectUploadImagePaths(latexString) {
  const paths = [];
  const re = /\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}/g;
  let match;

  while ((match = re.exec(latexString)) !== null) {
    const raw = (match[1] || '').trim();
    const normalized = raw.replace(/\\/g, '/');
    if (normalized.startsWith('/uploads/') || normalized.startsWith('uploads/')) {
      paths.push({
        original: raw,
        normalized,
        relativeUpload: normalized.replace(/^\//, ''),
      });
    }
  }

  return paths;
}

async function prepareLatexWithImages(latexString, compileDir) {
  const usedPaths = collectUploadImagePaths(latexString);
  if (!usedPaths.length) {
    return latexString;
  }

  const resolved = new Map();
  for (const item of usedPaths) {
    const relParts = item.relativeUpload.split('/').slice(1);
    const fileName = relParts[relParts.length - 1];
    const srcFile = path.join(UPLOADS_DIR, fileName);
    const dstFile = path.join(compileDir, fileName);

    if (!fsSync.existsSync(srcFile)) {
      continue;
    }

    await fs.copyFile(srcFile, dstFile);
    resolved.set(item.normalized, fileName);
  }

  const updated = latexString.replace(/\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}/g, (full, rawPath) => {
    const normalized = (rawPath || '').trim().replace(/\\/g, '/');
    const replacement = resolved.get(normalized);
    if (!replacement) {
      return full;
    }
    return full.replace(rawPath, replacement);
  });

  return updated;
}

async function compileLaTeX(latexString, mode) {
  const id = uuid();
  const dir = path.join(os.tmpdir(), `urp-${id}`);

  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.mkdir(path.join(dir, 'images'), { recursive: true });

    // Copy static assets into temp dir
    await Promise.all([
      fs.copyFile(path.join(TEMPLATES_DIR, 'file-setup.tex'), path.join(dir, 'file-setup.tex')),
      fs.copyFile(path.join(TEMPLATES_DIR, 'logo_soa.png'), path.join(dir, 'logo_soa.png')),
      fs.copyFile(path.join(TEMPLATES_DIR, 'logo_soa.png'), path.join(dir, 'logo.png')),
      fs.copyFile(path.join(TEMPLATES_DIR, 'logo_soa.png'), path.join(dir, 'images', 'logo.png')),
    ]);

    const preparedLatex = await prepareLatexWithImages(latexString, dir);

    // Write the LaTeX source
    await fs.writeFile(path.join(dir, 'main.tex'), preparedLatex, 'utf8');

    // Determine xelatex command (Windows uses xelatex.exe from PATH)
    const xelatexCmd = process.platform === 'win32' ? 'xelatex.exe' : 'xelatex';

    // Run XeLaTeX twice
    const runXelatex = (pass) => new Promise((resolve, reject) => {
      const proc = spawn(xelatexCmd, [
        '-interaction=nonstopmode',
        '-halt-on-error',
        'main.tex'
      ], { cwd: dir, shell: process.platform === 'win32' });

      let log = '';
      proc.stdout.on('data', (d) => { log += d.toString(); });
      proc.stderr.on('data', (d) => { log += d.toString(); });
      proc.on('error', (err) => reject({ log: err.message, code: -1 }));
      proc.on('close', (code) => {
        if (code === 0) resolve(log);
        else reject({ log, code });
      });
    });

    // Wrap in timeout
    const compileWithTimeout = async () => {
      return Promise.race([
        (async () => {
          await runXelatex(1);
          await runXelatex(2);
        })(),
        new Promise((_, reject) =>
          setTimeout(() => reject({ log: 'Compilation timed out after 45 seconds', code: -1 }), TIMEOUT_MS)
        )
      ]);
    };

    try {
      await compileWithTimeout();
    } catch (err) {
      const errorLog = err.log || 'Unknown compilation error';
      const errors = errorLog.split('\n')
        .filter(l => l.startsWith('!') || l.includes('Error'))
        .join('\n');
      await cleanup(dir);
      return { success: false, log: errors || errorLog.slice(-5000) };
    }

    // Read PDF
    const pdfPath = path.join(dir, 'main.pdf');
    try {
      const pdf = await fs.readFile(pdfPath);
      await cleanup(dir);
      return { success: true, pdf };
    } catch (e) {
      await cleanup(dir);
      return { success: false, log: 'PDF was not generated. Check LaTeX syntax.' };
    }
  } catch (err) {
    await cleanup(dir);
    return { success: false, log: err.message || 'Unknown error during compilation' };
  }
}

async function cleanup(dir) {
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch (e) {
    // Ignore cleanup errors
  }
}

module.exports = { compileLaTeX };
