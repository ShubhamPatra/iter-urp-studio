import React, { useRef, useCallback } from 'react';
import {
  Bold, Italic, Underline, List,
  ListOrdered, Table, Image, Minus
} from 'lucide-react';

const toolbarButtons = [
  { id: 'bold', icon: Bold, before: '\\textbf{', after: '}', group: 'format' },
  { id: 'italic', icon: Italic, before: '\\textit{', after: '}', group: 'format' },
  { id: 'underline', icon: Underline, before: '\\underline{', after: '}', group: 'format' },
  { id: 'sep1', separator: true },
  { id: 'bullet', icon: List, before: '\\begin{itemize}\n\\item ', after: '\n\\end{itemize}', group: 'list' },
  { id: 'ordered', icon: ListOrdered, before: '\\begin{enumerate}\n\\item ', after: '\n\\end{enumerate}', group: 'list' },
  { id: 'sep2', separator: true },
  {
    id: 'table', icon: Table, group: 'insert',
    before: '\\begin{table}[H]\n\\centering\n\\begin{tabular}{|l|l|l|}\n\\hline\nA & B & C \\\\\\ \\hline\n1 & 2 & 3 \\\\\\ \\hline\n\\end{tabular}\n\\caption{',
    after: '}\n\\label{tab:label}\n\\end{table}'
  },
  {
    id: 'image', icon: Image, group: 'insert',
    before: '\\begin{figure}[H]\n\\centering\n\\includegraphics[scale=0.5]{',
    after: '}\n\\caption{Caption}\n\\label{fig:label}\n\\end{figure}'
  },
  {
    id: 'equation', icon: Minus, group: 'insert',
    before: '\\[\n',
    after: '\n\\]'
  },
];

export default function Toolbar({ activeFieldLabel, activeFieldRef }) {
  const handleInsert = useCallback((btn) => {
    const el = activeFieldRef?.current;
    if (!el || el.tagName !== 'TEXTAREA') return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const val = el.value;
    const selected = val.slice(start, end);
    const newVal = val.slice(0, start) + btn.before + selected + btn.after + val.slice(end);

    // Create native input event to trigger React's onChange
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value'
    ).set;
    nativeInputValueSetter.call(el, newVal);
    el.dispatchEvent(new Event('input', { bubbles: true }));

    // Restore focus and selection
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + btn.before.length, start + btn.before.length + selected.length);
    });
  }, [activeFieldRef]);

  return (
    <div className="h-[52px] bg-surface border-b border-border flex items-center px-3 gap-0.5 flex-shrink-0">
      {/* Left: Format buttons */}
      <div className="flex items-center gap-0.5">
        {toolbarButtons.map((btn) => {
          if (btn.separator) {
            return <div key={btn.id} className="w-px h-5 bg-border mx-1" />;
          }
          const Icon = btn.icon;
          return (
            <button
              key={btn.id}
              onClick={() => handleInsert(btn)}
              title={btn.id.charAt(0).toUpperCase() + btn.id.slice(1)}
              className="w-7 h-7 rounded flex items-center justify-center text-t2 hover:bg-surface3 hover:text-t1 transition-colors"
            >
              <Icon size={14} strokeWidth={1.75} />
            </button>
          );
        })}
      </div>

      {/* Right: Active field label */}
      <div className="ml-auto">
        {activeFieldLabel && (
          <span className="text-t3 text-xs font-mono">{activeFieldLabel}</span>
        )}
      </div>
    </div>
  );
}
