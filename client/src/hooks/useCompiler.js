import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import { withApiBase } from '../lib/apiBase';

export function useCompiler(latexString, mode, enabled = true) {
  const [pdfData, setPdfData] = useState(null);
  const [compiling, setCompiling] = useState(false);
  const [compileError, setCompileError] = useState(null);
  const [lastSuccess, setLastSuccess] = useState(null);
  const [compileTime, setCompileTime] = useState(null);

  const [debouncedLatex] = useDebounce(latexString, 1500);

  const runCompile = async (source) => {
    if (!enabled) {
      return { ok: false, error: 'Backend is not active yet' };
    }

    if (!source) {
      return { ok: false, error: 'No LaTeX source provided' };
    }

    const startTime = Date.now();
    setCompiling(true);
    setCompileError(null);

    try {
      const res = await axios.post(withApiBase('/api/compile'), { latex: source, mode }, {
        responseType: 'arraybuffer',
        validateStatus: (s) => s < 500,
      });

      const contentType = (res.headers?.['content-type'] || '').toLowerCase();

      if (res.status === 422) {
        const text = new TextDecoder().decode(res.data);
        let log = text;
        try {
          const parsed = JSON.parse(text);
          log = parsed.log;
        } catch {
          // Keep plain text fallback.
        }
        setCompileError(log);
        return { ok: false, error: log };
      }

      if (res.status !== 200 || !contentType.includes('application/pdf')) {
        let detail = '';
        try {
          detail = new TextDecoder().decode(res.data).slice(0, 300);
        } catch {
          // Best-effort decode only.
        }

        const message = `Compile endpoint returned ${res.status}${
          detail ? `: ${detail}` : ''
        }`;
        setCompileError(message);
        return { ok: false, error: message };
      }

      const pdfBytes = new Uint8Array(res.data);
      setPdfData(pdfBytes);
      setLastSuccess(new Date());
      setCompileTime(Date.now() - startTime);
      setCompileError(null);
      return { ok: true, pdf: pdfBytes };
    } catch (err) {
      const message = err.message || 'Compile request failed';
      setCompileError(message);
      return { ok: false, error: message };
    } finally {
      setCompiling(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    if (!debouncedLatex) return;
    runCompile(debouncedLatex);
  }, [debouncedLatex, mode, enabled]);

  const manualCompile = () => runCompile(latexString);

  return { pdfData, compiling, compileError, lastSuccess, compileTime, manualCompile };
}
