import React, { useState } from 'react';
import { ChevronRight, Plus, Trash2 } from 'lucide-react';

export default function ChapterEditor({
  chapters,
  onChapterTitleChange,
  onAddChapter,
  onRemoveChapter,
  onSectionChange,
  onAddSection,
  onRemoveSection,
  onSubsectionChange,
  onAddSubsection,
  onRemoveSubsection,
  onAddSubsectionImage,
  onSubsectionImageChange,
  onRemoveSubsectionImage,
  uploadingImage,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="bg-surface3 text-t3 text-xs font-mono px-2 py-0.5 rounded">
            {chapters.length} ch
          </span>
          <h2 className="text-xl font-medium text-t1">Chapters</h2>
        </div>
        <button
          onClick={onAddChapter}
          className="flex items-center gap-1.5 text-sm text-t3 border border-dashed border-border2 rounded-lg px-3 py-1.5 hover:border-accent/50 hover:text-t2 transition-colors"
        >
          <Plus size={13} />
          Add Chapter
        </button>
      </div>

      {chapters.map((chapter) => (
        <ChapterBlock
          key={chapter.id}
          chapter={chapter}
          onTitleChange={(val) => onChapterTitleChange(chapter.id, val)}
          onRemove={() => onRemoveChapter(chapter.id)}
          onSectionChange={(sectionId, field, val) => onSectionChange(chapter.id, sectionId, field, val)}
          onAddSection={() => onAddSection(chapter.id)}
          onRemoveSection={(sectionId) => onRemoveSection(chapter.id, sectionId)}
          onSubsectionChange={(sectionId, subId, field, val) => onSubsectionChange(chapter.id, sectionId, subId, field, val)}
          onAddSubsection={(sectionId) => onAddSubsection(chapter.id, sectionId)}
          onRemoveSubsection={(sectionId, subId) => onRemoveSubsection(chapter.id, sectionId, subId)}
          onAddSubsectionImage={(sectionId, subId) => onAddSubsectionImage(chapter.id, sectionId, subId)}
          onSubsectionImageChange={(sectionId, subId, imageIndex, field, value) =>
            onSubsectionImageChange(chapter.id, sectionId, subId, imageIndex, field, value)
          }
          onRemoveSubsectionImage={(sectionId, subId, imageIndex) =>
            onRemoveSubsectionImage(chapter.id, sectionId, subId, imageIndex)
          }
          uploadingImage={uploadingImage}
        />
      ))}
    </div>
  );
}

function ChapterBlock({
  chapter,
  onTitleChange,
  onRemove,
  onSectionChange,
  onAddSection,
  onRemoveSection,
  onSubsectionChange,
  onAddSubsection,
  onRemoveSubsection,
  onAddSubsectionImage,
  onSubsectionImageChange,
  onRemoveSubsectionImage,
  uploadingImage,
}) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-surface3 text-t3 text-xs font-mono px-2 py-0.5 rounded flex-shrink-0">
          Ch {chapter.chapterNum}
        </span>
        <input
          type="text"
          value={chapter.title}
          onChange={(e) => onTitleChange(e.target.value)}
          data-field-label={`chapter[${chapter.chapterNum}].title`}
          placeholder="Chapter Title"
          className="flex-1 bg-transparent border-none text-md text-t1 font-medium focus:outline-none placeholder:text-t4"
        />
        <button
          onClick={onRemove}
          className="w-7 h-7 rounded flex items-center justify-center text-t4 hover:text-error hover:bg-error/10 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="space-y-2.5">
        {(chapter.sections || []).map((section, sectionIndex) => (
          <SectionAccordion
            key={section.id}
            section={section}
            chapterNum={chapter.chapterNum}
            sectionIndex={sectionIndex}
            onSectionChange={(field, val) => onSectionChange(section.id, field, val)}
            onRemoveSection={() => onRemoveSection(section.id)}
            onSubsectionChange={(subId, field, val) => onSubsectionChange(section.id, subId, field, val)}
            onAddSubsection={() => onAddSubsection(section.id)}
            onRemoveSubsection={(subId) => onRemoveSubsection(section.id, subId)}
            onAddImage={(subId) => onAddSubsectionImage(section.id, subId)}
            onImageChange={(subId, imageIndex, field, value) => onSubsectionImageChange(section.id, subId, imageIndex, field, value)}
            onRemoveImage={(subId, imageIndex) => onRemoveSubsectionImage(section.id, subId, imageIndex)}
            uploadingImage={uploadingImage}
          />
        ))}
      </div>

      <button
        onClick={onAddSection}
        className="flex items-center gap-1.5 text-sm text-t3 border border-dashed border-border2 rounded-lg px-3 py-1.5 mt-3 hover:border-accent/50 hover:text-t2 transition-colors"
      >
        <Plus size={13} />
        Add Section
      </button>
    </div>
  );
}

function SectionAccordion({
  section,
  chapterNum,
  sectionIndex,
  onSectionChange,
  onRemoveSection,
  onSubsectionChange,
  onAddSubsection,
  onRemoveSubsection,
  onAddImage,
  onImageChange,
  onRemoveImage,
  uploadingImage,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div
        className="flex items-center gap-2.5 px-4 py-3 hover:bg-surface2 cursor-pointer select-none group"
        onClick={() => setOpen(!open)}
      >
        <span className="bg-surface3 text-t3 text-xs font-mono px-1.5 py-0.5 rounded flex-shrink-0">
          {chapterNum}.{sectionIndex + 1}
        </span>
        <input
          type="text"
          value={section.title}
          onChange={(e) => {
            e.stopPropagation();
            onSectionChange('title', e.target.value);
          }}
          onClick={(e) => e.stopPropagation()}
          data-field-label={`chapter[${chapterNum}].section[${sectionIndex}].title`}
          placeholder="Section Title"
          className="flex-1 bg-transparent border-none text-sm text-t1 font-medium focus:outline-none placeholder:text-t4"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemoveSection();
          }}
          className="w-5 h-5 rounded flex items-center justify-center text-t4 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={13} />
        </button>
        <ChevronRight
          size={13}
          className={`text-t3 chevron-rotate ${open ? 'open' : ''}`}
        />
      </div>

      <div className={`accordion-body ${open ? 'open' : ''}`}>
        <div className="px-4 pb-4 pt-1">
          <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-t3 mb-1.5 block">
            Section Content (raw LaTeX)
          </label>
          <textarea
            rows={5}
            value={section.content || ''}
            onChange={(e) => onSectionChange('content', e.target.value)}
            data-field-label={`chapter[${chapterNum}].section[${sectionIndex}].content`}
            placeholder="Write section content in raw LaTeX..."
            className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm text-t1 font-mono focus:border-accent/70 placeholder:text-t4 resize-y"
          />

          <div className="mt-4 pt-3 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-t3 block">
                Subsections
              </label>
              <button
                type="button"
                onClick={onAddSubsection}
                className="flex items-center gap-1 text-xs text-t3 border border-dashed border-border2 rounded-md px-2 py-1 hover:border-accent/50 hover:text-t2 transition-colors"
              >
                <Plus size={12} />
                Add Subsection
              </button>
            </div>

            {(section.subsections || []).map((subsection, subsectionIndex) => (
              <SubsectionCard
                key={subsection.id}
                subsection={subsection}
                chapterNum={chapterNum}
                sectionIndex={sectionIndex}
                subsectionIndex={subsectionIndex}
                onChange={(field, val) => onSubsectionChange(subsection.id, field, val)}
                onRemove={() => onRemoveSubsection(subsection.id)}
                onAddImage={() => onAddImage(subsection.id)}
                onImageChange={(imageIndex, field, value) => onImageChange(subsection.id, imageIndex, field, value)}
                onRemoveImage={(imageIndex) => onRemoveImage(subsection.id, imageIndex)}
                uploadingImage={uploadingImage}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SubsectionCard({
  subsection,
  chapterNum,
  sectionIndex,
  subsectionIndex,
  onChange,
  onRemove,
  onAddImage,
  onImageChange,
  onRemoveImage,
  uploadingImage,
}) {
  return (
    <div className="bg-surface2 border border-border rounded-lg p-3 space-y-2">
      <div className="flex items-center gap-2">
        <span className="bg-surface3 text-t3 text-xs font-mono px-1.5 py-0.5 rounded flex-shrink-0">
          {chapterNum}.{sectionIndex + 1}.{subsectionIndex + 1}
        </span>
        <input
          type="text"
          value={subsection.title}
          onChange={(e) => onChange('title', e.target.value)}
          data-field-label={`chapter[${chapterNum}].section[${sectionIndex}].subsection[${subsectionIndex}].title`}
          placeholder="Subsection Title"
          className="flex-1 bg-surface border border-border rounded-lg px-2 py-1.5 text-sm text-t1 focus:border-accent/70 placeholder:text-t4"
        />
        <button
          type="button"
          onClick={onRemove}
          className="w-7 h-7 rounded flex items-center justify-center text-t4 hover:text-error hover:bg-error/10 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-t3 mb-1.5 block">
        Content (raw LaTeX)
      </label>
      <textarea
        rows={6}
        value={subsection.content || ''}
        onChange={(e) => onChange('content', e.target.value)}
        data-field-label={`chapter[${chapterNum}].section[${sectionIndex}].subsection[${subsectionIndex}].content`}
        placeholder="Write LaTeX content here..."
        className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-t1 font-mono focus:border-accent/70 placeholder:text-t4 resize-y"
      />

      <div className="mt-3 pt-3 border-t border-border space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-t3 block">
            Images
          </label>
          <button
            type="button"
            onClick={onAddImage}
            className="flex items-center gap-1 text-xs text-t3 border border-dashed border-border2 rounded-md px-2 py-1 hover:border-accent/50 hover:text-t2 transition-colors"
          >
            <Plus size={12} />
            Add Image
          </button>
        </div>

        {(subsection.images || []).map((img, imgIdx) => (
          <div key={img.id || imgIdx} className="bg-surface border border-border rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    onImageChange(imgIdx, 'upload', file);
                  }
                }}
                className="flex-1 text-xs text-t2"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(imgIdx)}
                className="w-7 h-7 rounded flex items-center justify-center text-t4 hover:text-error hover:bg-error/10 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={img.caption || ''}
                onChange={(e) => onImageChange(imgIdx, 'caption', e.target.value)}
                placeholder="Caption"
                className="bg-surface2 border border-border rounded-lg px-2 py-1.5 text-xs text-t1 focus:border-accent/70 placeholder:text-t4"
              />
              <input
                type="text"
                value={img.width || ''}
                onChange={(e) => onImageChange(imgIdx, 'width', e.target.value)}
                placeholder="0.5\\textwidth"
                className="bg-surface2 border border-border rounded-lg px-2 py-1.5 text-xs text-t1 focus:border-accent/70 placeholder:text-t4"
              />
              <select
                value={img.position || 'center'}
                onChange={(e) => onImageChange(imgIdx, 'position', e.target.value)}
                className="bg-surface2 border border-border rounded-lg px-2 py-1.5 text-xs text-t1 focus:border-accent/70"
              >
                <option value="center">Center</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>

            {img.path && <p className="text-[10px] text-t4 truncate">{img.path}</p>}
          </div>
        ))}

        {uploadingImage && (
          <p className="text-[10px] text-t4">Uploading image...</p>
        )}
      </div>
    </div>
  );
}
