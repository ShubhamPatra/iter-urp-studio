import { useReducer, useCallback } from 'react';

function makeSubsection(idPrefix, label) {
  return {
    id: `${idPrefix}-sub-${Date.now()}`,
    title: label,
    content: '',
    images: [],
  };
}

function makeSection(idPrefix, label) {
  const sectionId = `${idPrefix}-sec-${Date.now()}`;
  return {
    id: sectionId,
    title: label,
    content: '',
    images: [],
    subsections: [makeSubsection(sectionId, 'Subsection 1.1')],
  };
}

const initialState = {
  front: {
    projectTitle: '',
    department: 'Computer Science & Information Technology',
    authors: [
      { name: '', regNo: '' },
      { name: '', regNo: '' },
      { name: '', regNo: '' },
    ],
    supervisor: '',
    year: '2026',
  },
  chapters: [
    {
      id: 'ch1',
      title: 'Introduction',
      chapterNum: 1,
      sections: [
        {
          id: 'ch1sec1',
          title: 'Overview',
          content: '',
          images: [],
          subsections: [
            { id: 'ch1sec1sub1', title: 'Background', content: '', images: [] },
          ],
        },
      ],
    },
    {
      id: 'ch2',
      title: 'Literature Review',
      chapterNum: 2,
      sections: [
        {
          id: 'ch2sec1',
          title: 'Introduction to the Domain',
          content: '',
          images: [],
          subsections: [
            { id: 'ch2sec1sub1', title: 'Existing Methods', content: '', images: [] },
            { id: 'ch2sec1sub2', title: 'Research Gaps', content: '', images: [] },
          ],
        },
      ],
    },
  ],
  references: [{ key: '', text: '' }],
  annexure: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FRONT_FIELD':
      return { ...state, front: { ...state.front, [action.field]: action.value } };
    case 'SET_FRONT_AUTHOR':
      return {
        ...state,
        front: {
          ...state.front,
          authors: state.front.authors.map((a, i) =>
            i === action.index ? { ...a, [action.field]: action.value } : a
          ),
        },
      };
    case 'ADD_FRONT_AUTHOR':
      return {
        ...state,
        front: { ...state.front, authors: [...state.front.authors, { name: '', regNo: '' }] },
      };
    case 'REMOVE_FRONT_AUTHOR':
      return {
        ...state,
        front: { ...state.front, authors: state.front.authors.filter((_, i) => i !== action.index) },
      };
    case 'SET_CHAPTER_TITLE':
      return {
        ...state,
        chapters: state.chapters.map(ch =>
          ch.id === action.id ? { ...ch, title: action.value } : ch
        ),
      };
    case 'ADD_CHAPTER':
      {
        const chapterId = `ch${Date.now()}`;
      return {
        ...state,
        chapters: [...state.chapters, {
          id: chapterId,
          title: 'New Chapter',
          chapterNum: state.chapters.length + 1,
          sections: [makeSection(chapterId, 'Section 1')],
        }],
      };
      }
    case 'REMOVE_CHAPTER':
      return {
        ...state,
        chapters: state.chapters
          .filter(ch => ch.id !== action.id)
          .map((ch, i) => ({ ...ch, chapterNum: i + 1 })),
      };
    case 'SET_SECTION_FIELD':
      return {
        ...state,
        chapters: state.chapters.map(ch =>
          ch.id === action.chapterId
            ? {
                ...ch,
                sections: (ch.sections || []).map(section =>
                  section.id === action.sectionId ? { ...section, [action.field]: action.value } : section
                ),
              }
            : ch
        ),
      };
    case 'ADD_SECTION':
      return {
        ...state,
        chapters: state.chapters.map(ch =>
          ch.id === action.chapterId
            ? {
                ...ch,
                sections: [...(ch.sections || []), makeSection(ch.id, `Section ${(ch.sections || []).length + 1}`)],
              }
            : ch
        ),
      };
    case 'REMOVE_SECTION':
      return {
        ...state,
        chapters: state.chapters.map(ch =>
          ch.id === action.chapterId
            ? { ...ch, sections: (ch.sections || []).filter(section => section.id !== action.sectionId) }
            : ch
        ),
      };
    case 'SET_SUBSECTION_FIELD':
      return {
        ...state,
        chapters: state.chapters.map(ch =>
          ch.id === action.chapterId
            ? {
                ...ch,
                sections: (ch.sections || []).map(section =>
                  section.id === action.sectionId
                    ? {
                        ...section,
                        subsections: (section.subsections || []).map(sub =>
                          sub.id === action.subId ? { ...sub, [action.field]: action.value } : sub
                        ),
                      }
                    : section
                ),
              }
            : ch
        ),
      };
    case 'ADD_SUBSECTION':
      return {
        ...state,
        chapters: state.chapters.map(ch =>
          ch.id === action.chapterId
            ? {
                ...ch,
                sections: (ch.sections || []).map(section =>
                  section.id === action.sectionId
                    ? {
                        ...section,
                        subsections: [
                          ...(section.subsections || []),
                          makeSubsection(section.id, `Subsection ${(section.subsections || []).length + 1}`),
                        ],
                      }
                    : section
                ),
              }
            : ch
        ),
      };
    case 'ADD_SUBSECTION_IMAGE':
      return {
        ...state,
        chapters: state.chapters.map((ch) =>
          ch.id === action.chapterId
            ? {
                ...ch,
                sections: (ch.sections || []).map((section) =>
                  section.id === action.sectionId
                    ? {
                        ...section,
                        subsections: (section.subsections || []).map((sub) =>
                          sub.id === action.subId
                            ? {
                                ...sub,
                                images: [
                                  ...(sub.images || []),
                                  {
                                    id: `img-${Date.now()}`,
                                    path: '',
                                    caption: '',
                                    width: '0.5\\textwidth',
                                    position: 'center',
                                  },
                                ],
                              }
                            : sub
                        ),
                      }
                    : section
                ),
              }
            : ch
        ),
      };
    case 'SET_SUBSECTION_IMAGE_FIELD':
      return {
        ...state,
        chapters: state.chapters.map((ch) =>
          ch.id === action.chapterId
            ? {
                ...ch,
                sections: (ch.sections || []).map((section) =>
                  section.id === action.sectionId
                    ? {
                        ...section,
                        subsections: (section.subsections || []).map((sub) =>
                          sub.id === action.subId
                            ? {
                                ...sub,
                                images: (sub.images || []).map((img, idx) =>
                                  idx === action.imageIndex
                                    ? { ...img, [action.field]: action.value }
                                    : img
                                ),
                              }
                            : sub
                        ),
                      }
                    : section
                ),
              }
            : ch
        ),
      };
    case 'REMOVE_SUBSECTION_IMAGE':
      return {
        ...state,
        chapters: state.chapters.map((ch) =>
          ch.id === action.chapterId
            ? {
                ...ch,
                sections: (ch.sections || []).map((section) =>
                  section.id === action.sectionId
                    ? {
                        ...section,
                        subsections: (section.subsections || []).map((sub) =>
                          sub.id === action.subId
                            ? {
                                ...sub,
                                images: (sub.images || []).filter((_, idx) => idx !== action.imageIndex),
                              }
                            : sub
                        ),
                      }
                    : section
                ),
              }
            : ch
        ),
      };
    case 'REMOVE_SUBSECTION':
      return {
        ...state,
        chapters: state.chapters.map(ch =>
          ch.id === action.chapterId
            ? {
                ...ch,
                sections: (ch.sections || []).map(section =>
                  section.id === action.sectionId
                    ? { ...section, subsections: (section.subsections || []).filter(sub => sub.id !== action.subId) }
                    : section
                ),
              }
            : ch
        ),
      };
    case 'SET_REFERENCE_FIELD':
      return {
        ...state,
        references: state.references.map((r, i) => i === action.index ? { ...r, [action.field]: action.value } : r),
      };
    case 'ADD_REFERENCE':
      return { ...state, references: [...state.references, { key: '', text: '' }] };
    case 'REMOVE_REFERENCE':
      return { ...state, references: state.references.filter((_, i) => i !== action.index) };
    case 'SET_ANNEXURE':
      return { ...state, annexure: action.value };
    default:
      return state;
  }
}

export function useReportStore() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setFrontField = useCallback((field, value) => dispatch({ type: 'SET_FRONT_FIELD', field, value }), []);
  const setFrontAuthor = useCallback((index, field, value) => dispatch({ type: 'SET_FRONT_AUTHOR', index, field, value }), []);
  const addFrontAuthor = useCallback(() => dispatch({ type: 'ADD_FRONT_AUTHOR' }), []);
  const removeFrontAuthor = useCallback((index) => dispatch({ type: 'REMOVE_FRONT_AUTHOR', index }), []);

  const setChapterTitle = useCallback((id, value) => dispatch({ type: 'SET_CHAPTER_TITLE', id, value }), []);
  const addChapter = useCallback(() => dispatch({ type: 'ADD_CHAPTER' }), []);
  const removeChapter = useCallback((id) => dispatch({ type: 'REMOVE_CHAPTER', id }), []);

  const setSectionField = useCallback((chapterId, sectionId, field, value) => {
    dispatch({ type: 'SET_SECTION_FIELD', chapterId, sectionId, field, value });
  }, []);
  const addSection = useCallback((chapterId) => dispatch({ type: 'ADD_SECTION', chapterId }), []);
  const removeSection = useCallback((chapterId, sectionId) => dispatch({ type: 'REMOVE_SECTION', chapterId, sectionId }), []);

  const setSubsectionField = useCallback((chapterId, sectionId, subId, field, value) => {
    dispatch({ type: 'SET_SUBSECTION_FIELD', chapterId, sectionId, subId, field, value });
  }, []);
  const addSubsection = useCallback((chapterId, sectionId) => dispatch({ type: 'ADD_SUBSECTION', chapterId, sectionId }), []);
  const removeSubsection = useCallback((chapterId, sectionId, subId) => dispatch({ type: 'REMOVE_SUBSECTION', chapterId, sectionId, subId }), []);
  const addSubsectionImage = useCallback((chapterId, sectionId, subId) => {
    dispatch({ type: 'ADD_SUBSECTION_IMAGE', chapterId, sectionId, subId });
  }, []);
  const setSubsectionImageField = useCallback((chapterId, sectionId, subId, imageIndex, field, value) => {
    dispatch({ type: 'SET_SUBSECTION_IMAGE_FIELD', chapterId, sectionId, subId, imageIndex, field, value });
  }, []);
  const removeSubsectionImage = useCallback((chapterId, sectionId, subId, imageIndex) => {
    dispatch({ type: 'REMOVE_SUBSECTION_IMAGE', chapterId, sectionId, subId, imageIndex });
  }, []);

  const setReferenceField = useCallback((index, field, value) => dispatch({ type: 'SET_REFERENCE_FIELD', index, field, value }), []);
  const addReference = useCallback(() => dispatch({ type: 'ADD_REFERENCE' }), []);
  const removeReference = useCallback((index) => dispatch({ type: 'REMOVE_REFERENCE', index }), []);

  const setAnnexure = useCallback((value) => dispatch({ type: 'SET_ANNEXURE', value }), []);

  return {
    reportData: state,
    setFrontField, setFrontAuthor, addFrontAuthor, removeFrontAuthor,
    setChapterTitle, addChapter, removeChapter,
    setSectionField, addSection, removeSection,
    setSubsectionField, addSubsection, removeSubsection,
    addSubsectionImage, setSubsectionImageField, removeSubsectionImage,
    setReferenceField, addReference, removeReference,
    setAnnexure,
  };
}
