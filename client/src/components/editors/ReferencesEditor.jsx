import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function ReferencesEditor({ references, onRefFieldChange, onAddRef, onRemoveRef }) {
  const keyCounts = (references || []).reduce((acc, ref) => {
    const key = (ref?.key || '').trim();
    if (!key) return acc;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="bg-surface3 text-t3 text-xs font-mono px-2 py-0.5 rounded">
            {references.length} refs
          </span>
          <h2 className="text-xl font-medium text-t1">References</h2>
        </div>
        <button
          onClick={onAddRef}
          className="flex items-center gap-1.5 text-sm text-t3 border border-dashed border-border2 rounded-lg px-3 py-1.5 hover:border-accent/50 hover:text-t2 transition-colors"
        >
          <Plus size={13} />
          Add Reference
        </button>
      </div>

      {references.map((ref, i) => {
        const key = (ref?.key || '').trim();
        const duplicated = key && keyCounts[key] > 1;
        return (
        <div key={i} className="bg-surface border border-border rounded-xl p-5 transition-colors focus-within:border-accent/60">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-surface3 text-t3 text-xs font-mono px-1.5 py-0.5 rounded">
              [{i + 1}]
            </span>
            <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-t3">
              Reference
            </label>
            <button
              onClick={() => onRemoveRef(i)}
              className="ml-auto w-7 h-7 rounded flex items-center justify-center text-t4 hover:text-error hover:bg-error/10 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <input
            type="text"
            value={ref?.key || ''}
            onChange={(e) => onRefFieldChange(i, 'key', e.target.value)}
            data-field-label={`references[${i}].key`}
            placeholder="Citation key (e.g., ref1)"
            className={`w-full mb-2 bg-surface2 border rounded-lg px-3 py-2 text-sm font-mono focus:border-accent/70 placeholder:text-t4 ${duplicated ? 'border-error text-error' : 'border-border text-t1'}`}
          />
          <textarea
            rows={3}
            value={ref?.text || ''}
            onChange={(e) => onRefFieldChange(i, 'text', e.target.value)}
            data-field-label={`references[${i}].text`}
            placeholder='Author, A. (Year). "Title of paper." Journal, vol(issue), pp. X--Y.'
            className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm text-t1 font-mono focus:border-accent/70 placeholder:text-t4 resize-y"
          />
          {duplicated && (
            <p className="text-[10px] text-error mt-1">Duplicate citation key. Use a unique key.</p>
          )}
        </div>
      );})}
    </div>
  );
}
