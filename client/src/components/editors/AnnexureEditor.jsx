import React from 'react';

export default function AnnexureEditor({ value, onChange }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-surface3 text-t3 text-xs font-mono px-2 py-0.5 rounded">AX</span>
        <h2 className="text-xl font-medium text-t1">Annexure</h2>
      </div>

      <div className="bg-surface border border-border rounded-xl p-5 transition-colors focus-within:border-accent/60">
        <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-t3 mb-1.5 block">
          Annexure Content (raw LaTeX)
        </label>
        <textarea
          rows={12}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          data-field-label="annexure"
          placeholder="Write annexure content in raw LaTeX..."
          className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm text-t1 font-mono focus:border-accent/70 placeholder:text-t4 resize-y"
        />
      </div>
    </div>
  );
}
