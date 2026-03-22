import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function CompileStatus({ compiling, compileError, lastSuccess, compileTime }) {
  const [showLog, setShowLog] = useState(false);

  return (
    <div className="bg-surface rounded-xl p-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-t3 uppercase tracking-[0.08em]">Compiler Status</span>
          <div className="h-5 flex items-center gap-2 text-xs mt-1">
            {compiling && (
              <>
                <Loader2 size={12} className="animate-spin text-accent2" />
                <span className="text-t2">XeLaTeX - Compiling...</span>
              </>
            )}
            {!compiling && compileError && (
              <>
                <div className="w-2 h-2 rounded-full bg-error flex-shrink-0" />
                <span className="text-error">XeLaTeX - Error</span>
                <button
                  onClick={() => setShowLog(!showLog)}
                  className="text-t3 hover:text-t2 ml-1 underline transition-colors"
                >
                  {showLog ? 'Hide log' : 'View log'}
                </button>
              </>
            )}
            {!compiling && !compileError && lastSuccess && (
              <>
                <span className="text-accent2">
                  XeLaTeX - Ready{compileTime ? ` (${Math.round(compileTime / 1000)}s)` : ''}
                </span>
              </>
            )}
            {!compiling && !compileError && !lastSuccess && (
              <span className="text-t2">XeLaTeX - Ready</span>
            )}
          </div>
        </div>
        <div className={`w-2 h-2 rounded-full ${compileError ? 'bg-error' : 'bg-accent2'} shadow-[0_0_10px_rgba(173,198,255,0.5)]`} />
      </div>

      {showLog && compileError && (
        <div className="mt-3 border-t border-border pt-3 max-h-40 overflow-y-auto">
          <pre className="text-xs text-error font-mono whitespace-pre-wrap break-all">
            {compileError}
          </pre>
        </div>
      )}
    </div>
  );
}
