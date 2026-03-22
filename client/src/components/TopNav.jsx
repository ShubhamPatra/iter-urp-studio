import React from 'react';
import { Loader2 } from 'lucide-react';

export default function TopNav({
  mode,
  setMode,
  onCompile,
  onDownload,
  onDownloadPdf,
  compiling,
  backendActive,
  backendChecking,
  onWakeBackend,
}) {
  return (
    <header className="h-16 bg-bg flex items-center justify-between px-6 select-none flex-shrink-0">
      <div className="flex items-center gap-8">
        <span className="text-[31px] font-bold leading-none tracking-[-0.03em] text-t1">
          URP Generator
        </span>
        <button
          type="button"
          onClick={onWakeBackend}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
            backendActive
              ? 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10'
              : 'text-amber-200 border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20'
          }`}
        >
          {backendChecking ? 'Checking backend...' : backendActive ? 'Backend active' : 'Backend inactive - click to ping'}
        </button>
        <nav className="flex items-center gap-6">
          <button
            onClick={() => setMode('ppt')}
            className={`text-[15px] pb-1 border-b-2 transition-colors ${
              mode === 'ppt'
                ? 'text-accent2 border-accent2'
                : 'text-t3 border-transparent hover:text-t1'
            }`}
          >
            Presentation
          </button>
          <button
            onClick={() => setMode('report')}
            className={`text-[15px] pb-1 border-b-2 transition-colors ${
              mode === 'report'
                ? 'text-accent2 border-accent2'
                : 'text-t3 border-transparent hover:text-t1'
            }`}
          >
            Report
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onDownload}
          type="button"
          className="px-4 py-2 text-sm font-medium text-t1 bg-surface3 rounded-lg hover:bg-border transition-colors"
        >
          Export Source
        </button>
        <button
          onClick={onCompile}
          type="button"
          disabled={compiling || !backendActive}
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-accent text-[#00285d] hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {compiling ? (
            <span className="flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Compiling...
            </span>
          ) : (
            'Compile'
          )}
        </button>
        <button
          onClick={onDownloadPdf}
          type="button"
          disabled={!backendActive}
          className="px-4 py-2 text-sm font-medium text-t1 bg-surface3 rounded-lg hover:bg-border transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Download PDF
        </button>
      </div>
    </header>
  );
}
