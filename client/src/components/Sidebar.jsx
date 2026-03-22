import React from 'react';
import {
  Presentation, FileText, BookOpen, List, LayoutList, Plus
} from 'lucide-react';

const pptSections = [
  { id: 'title', label: 'Title Slide', icon: Presentation },
  { id: 'slides', label: 'Content Slides', icon: LayoutList },
];

const reportSections = [
  { id: 'titlepage', label: 'Title Page', icon: FileText },
  { id: 'chapters', label: 'Chapters', icon: BookOpen },
  { id: 'references', label: 'References', icon: List },
  { id: 'annexure', label: 'Annexure', icon: FileText },
];

export default function Sidebar({ mode, activeSection, setActiveSection }) {
  const sections = mode === 'ppt' ? pptSections : reportSections;

  return (
    <aside className="w-64 bg-surface flex flex-col flex-shrink-0 select-none">
      <div className="px-6 pt-5 pb-4">
        <h2 className="text-[11px] uppercase tracking-[0.1em] font-semibold text-t3">
          Project Workspace
        </h2>
        <p className="text-[10px] text-accent2 mt-1">LaTeX Draft v1.0</p>
      </div>

      <div className="px-3 flex-1 overflow-y-auto">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <div
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm cursor-pointer transition-colors mb-1 ${
                isActive
                  ? 'bg-border text-accent2 font-medium'
                  : 'text-t3 hover:bg-surface3 hover:text-t1'
              }`}
            >
              <Icon size={16} strokeWidth={1.7} />
              <span>{section.label}</span>
            </div>
          );
        })}

        {mode === 'ppt' && (
          <button
            type="button"
            className="mt-4 mx-3 flex items-center justify-center gap-2 py-2 text-xs text-t3 rounded-lg border border-dashed border-border2 hover:text-accent2 hover:border-accent2/50 transition-colors"
          >
            <Plus size={14} />
            New Slide
          </button>
        )}
      </div>

    </aside>
  );
}
