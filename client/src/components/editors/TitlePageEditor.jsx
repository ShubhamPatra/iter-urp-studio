import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function TitlePageEditor({ data, onChange, onAuthorChange, onAddAuthor, onRemoveAuthor }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-surface3 text-t3 text-xs font-mono px-2 py-0.5 rounded">FP</span>
        <h2 className="text-xl font-medium text-t1">Title Page</h2>
      </div>

      {/* Project Title */}
      <div className="bg-surface border border-border rounded-xl p-5 transition-colors focus-within:border-accent/60">
        <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-t3 mb-1.5 block">
          Project Title
        </label>
        <textarea
          rows={3}
          value={data.projectTitle}
          onChange={(e) => onChange('projectTitle', e.target.value)}
          data-field-label="front.projectTitle"
          placeholder="Enter your project title"
          className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm text-t1 focus:border-accent/70 placeholder:text-t4 resize-y"
        />
      </div>

      {/* Department */}
      <div className="bg-surface border border-border rounded-xl p-5 transition-colors focus-within:border-accent/60">
        <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-t3 mb-1.5 block">
          Department
        </label>
        <input
          type="text"
          value={data.department}
          onChange={(e) => onChange('department', e.target.value)}
          data-field-label="front.department"
          placeholder="Computer Science & Information Technology"
          className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm text-t1 focus:border-accent/70 placeholder:text-t4"
        />
      </div>

      {/* Authors */}
      <div className="bg-surface border border-border rounded-xl p-5 transition-colors focus-within:border-accent/60">
        <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-t3 mb-1.5 block">
          Authors
        </label>
        {data.authors.map((author, i) => (
          <div key={i} className="flex gap-2 items-center mb-2">
            <input
              type="text"
              value={author.name}
              onChange={(e) => onAuthorChange(i, 'name', e.target.value)}
              data-field-label={`front.authors[${i}].name`}
              placeholder="Full Name"
              className="flex-1 bg-surface2 border border-border rounded-lg px-3 py-2 text-sm text-t1 focus:border-accent/70 placeholder:text-t4"
            />
            <input
              type="text"
              value={author.regNo}
              onChange={(e) => onAuthorChange(i, 'regNo', e.target.value)}
              data-field-label={`front.authors[${i}].regNo`}
              placeholder="Regd. No."
              className="w-36 bg-surface2 border border-border rounded-lg px-3 py-2 text-sm text-t1 focus:border-accent/70 placeholder:text-t4"
            />
            <button
              onClick={() => onRemoveAuthor(i)}
              className="w-7 h-7 rounded flex items-center justify-center text-t3 hover:text-error hover:bg-error/10 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={onAddAuthor}
          className="flex items-center gap-1.5 text-sm text-t3 border border-dashed border-border2 rounded-lg px-3 py-1.5 mt-2 hover:border-accent/50 hover:text-t2 transition-colors"
        >
          <Plus size={13} />
          Add Author
        </button>
      </div>

      {/* Supervisor */}
      <div className="bg-surface border border-border rounded-xl p-5 transition-colors focus-within:border-accent/60">
        <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-t3 mb-1.5 block">
          Supervisor
        </label>
        <input
          type="text"
          value={data.supervisor}
          onChange={(e) => onChange('supervisor', e.target.value)}
          data-field-label="front.supervisor"
          placeholder="Prof./Dr./Mr./Ms. XXXX XXXX"
          className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm text-t1 focus:border-accent/70 placeholder:text-t4"
        />
      </div>

      {/* Year */}
      <div className="bg-surface border border-border rounded-xl p-5 transition-colors focus-within:border-accent/60">
        <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-t3 mb-1.5 block">
          Year
        </label>
        <input
          type="text"
          value={data.year}
          onChange={(e) => onChange('year', e.target.value)}
          data-field-label="front.year"
          placeholder="2026"
          className="w-32 bg-surface2 border border-border rounded-lg px-3 py-2 text-sm text-t1 focus:border-accent/70 placeholder:text-t4"
        />
      </div>
    </div>
  );
}
