import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function TitleSlideEditor({ data, onChange, onAuthorChange, onAddAuthor, onRemoveAuthor }) {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-5xl font-light tracking-tight text-t1 mb-2">Title Slide</h1>
        <p className="text-sm text-t3">Define the entry point of your presentation</p>
      </div>

      <div className="space-y-6">
        <div className="group">
          <label className="block text-[10px] uppercase tracking-[0.1em] text-accent2 font-bold mb-2">Presentation Title</label>
          <textarea
            rows={2}
            value={data.projectTitle}
            onChange={(e) => onChange('projectTitle', e.target.value)}
            data-field-label="title.projectTitle"
            placeholder="Enter title..."
            className="w-full bg-surface2 border-b border-transparent focus:border-accent2 p-4 rounded-lg text-t1 placeholder:text-t4 resize-y transition-colors"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="group">
            <label className="block text-[10px] uppercase tracking-[0.1em] text-t3 font-bold mb-2">Authors</label>
            <div className="bg-surface2 rounded-xl p-4 space-y-2">
              {data.authors.map((author, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={author.name}
                    onChange={(e) => onAuthorChange(i, 'name', e.target.value)}
                    data-field-label={`title.authors[${i}].name`}
                    placeholder="Full Name"
                    className="flex-1 bg-surface0 rounded-lg px-3 py-2 text-sm text-t1 placeholder:text-t4"
                  />
                  <input
                    type="text"
                    value={author.regNo}
                    onChange={(e) => onAuthorChange(i, 'regNo', e.target.value)}
                    data-field-label={`title.authors[${i}].regNo`}
                    placeholder="Regd. No."
                    className="w-36 bg-surface0 rounded-lg px-3 py-2 text-sm text-t1 placeholder:text-t4"
                  />
                  <button
                    onClick={() => onRemoveAuthor(i)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-t4 hover:text-error hover:bg-error/10 transition-colors"
                    aria-label="Remove author"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={onAddAuthor}
                className="flex items-center gap-1.5 text-sm text-t3 border border-dashed border-border2 rounded-lg px-3 py-2 mt-1 hover:border-accent2/50 hover:text-accent2 transition-colors"
              >
                <Plus size={13} />
                Add Author
              </button>
            </div>
          </div>

          <div className="group">
            <label className="block text-[10px] uppercase tracking-[0.1em] text-t3 font-bold mb-2">Supervisor</label>
            <div className="bg-surface2 rounded-xl p-4 space-y-3">
              <input
                type="text"
                value={data.supervisorName}
                onChange={(e) => onChange('supervisorName', e.target.value)}
                data-field-label="title.supervisorName"
                placeholder="Prof./Dr./Mr./Ms. XYZ"
                className="w-full bg-surface0 rounded-lg px-3 py-2 text-sm text-t1 placeholder:text-t4"
              />
              <input
                type="text"
                value={data.supervisorDept}
                onChange={(e) => onChange('supervisorDept', e.target.value)}
                data-field-label="title.supervisorDept"
                placeholder="Department"
                className="w-full bg-surface0 rounded-lg px-3 py-2 text-sm text-t1 placeholder:text-t4"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-surface2 p-6 rounded-xl space-y-3">
          <label className="block text-[10px] uppercase tracking-[0.1em] text-t3 font-bold">Subtitle / Review Type</label>
          <textarea
            rows={5}
            value={data.reviewType}
            onChange={(e) => onChange('reviewType', e.target.value)}
            data-field-label="title.reviewType"
            placeholder="Interim Progress Review Presentation"
            className="w-full bg-surface0/70 rounded-lg p-4 text-sm text-t1 placeholder:text-t4 resize-y"
          />
        </div>

        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="bg-surface3/80 p-5 rounded-xl text-center">
            <p className="text-[11px] uppercase tracking-[0.1em] text-t3 font-semibold mb-2">Quick Metadata</p>
            <p className="text-xs text-t2">Authors: {data.authors.length}</p>
            <p className="text-xs text-t2 mt-1">Mode: Presentation</p>
          </div>
          <div className="bg-surface2 p-4 rounded-xl space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.1em] text-t3 font-bold">Review Type</label>
            <input
              type="text"
              value={data.reviewType}
              onChange={(e) => onChange('reviewType', e.target.value)}
              data-field-label="title.reviewType"
              placeholder="Interim Progress Review Presentation"
              className="w-full bg-surface0 rounded px-3 py-2 text-xs text-t1 placeholder:text-t4"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-end opacity-60 hover:opacity-100 transition-opacity">
        <div className="flex gap-4">
          <span className="text-[10px] text-t3 font-mono">ID: TITLE-SLD</span>
          <span className="text-[10px] text-t3 font-mono">LATEX_RENDER: OK</span>
        </div>
      </div>
    </div>
  );
}
