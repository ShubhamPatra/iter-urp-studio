import { useReducer, useCallback } from 'react';

const defaultSlides = [
  {
    id: '1',
    title: 'Presentation Outline',
    content: 'Introduction\n  Overview\n  Title and its justification\n  Motivations\nState-of-the-art Methods / Algorithms\n  Existing System\n  Problems Identification / outcomes\n  Data Description (if applicable)\nProposed Method / Algorithm\n  Dataset if required.\nResources Required\nPlan for next Review Presentation.\nReferences',
    images: [],
  },
  { id: '2', title: 'Introduction', content: 'Overview\nTitle and its justification\nMotivation', images: [] },
  { id: '3', title: 'State-of-art Methods / Algorithms', content: 'Existing systems\nProblem Identification / Outcomes\nData Description (if applicable)', images: [] },
  { id: '4', title: 'Proposed Methods / Algorithms', content: 'Dataset if required', images: [] },
  { id: '5', title: 'Resources Required', content: 'Hardware resources\nSoftware resources', images: [] },
  { id: '6', title: 'Plan for next Review Presentation', content: 'Timeline and milestones', images: [] },
  { id: '7', title: 'References', content: 'Author, A. (Year). Title of paper. Journal, vol(issue), pp. X--Y.', images: [] },
];

const initialState = {
  title: {
    projectTitle: '',
    reviewType: 'Interim Progress Review Presentation',
    authors: [
      { name: '', regNo: '' },
      { name: '', regNo: '' },
      { name: '', regNo: '' },
      { name: '', regNo: '' },
    ],
    supervisorName: '',
    supervisorDept: 'DoCS&IT',
  },
  slides: defaultSlides,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TITLE_FIELD':
      return { ...state, title: { ...state.title, [action.field]: action.value } };
    case 'SET_AUTHOR':
      return {
        ...state,
        title: {
          ...state.title,
          authors: state.title.authors.map((a, i) =>
            i === action.index ? { ...a, [action.field]: action.value } : a
          ),
        },
      };
    case 'ADD_AUTHOR':
      return {
        ...state,
        title: {
          ...state.title,
          authors: [...state.title.authors, { name: '', regNo: '' }],
        },
      };
    case 'REMOVE_AUTHOR':
      return {
        ...state,
        title: {
          ...state.title,
          authors: state.title.authors.filter((_, i) => i !== action.index),
        },
      };
    case 'SET_SLIDE_FIELD':
      return {
        ...state,
        slides: state.slides.map((s) =>
          s.id === action.id ? { ...s, [action.field]: action.value } : s
        ),
      };
    case 'ADD_SLIDE':
      return {
        ...state,
        slides: [...state.slides, {
          id: String(Date.now()),
          title: 'New Slide',
          content: '',
          images: [],
        }],
      };
    case 'ADD_SLIDE_IMAGE':
      return {
        ...state,
        slides: state.slides.map((s) =>
          s.id === action.slideId
            ? {
                ...s,
                images: [
                  ...(s.images || []),
                  {
                    id: `img-${Date.now()}`,
                    path: '',
                    width: '230pt',
                    position: 'center',
                    x: 560,
                    y: 250,
                    aspectRatio: 0.65,
                  },
                ],
              }
            : s
        ),
      };
    case 'SET_SLIDE_IMAGE_FIELD':
      return {
        ...state,
        slides: state.slides.map((s) =>
          s.id === action.slideId
            ? {
                ...s,
                images: (s.images || []).map((img, idx) =>
                  idx === action.imageIndex
                    ? { ...img, [action.field]: action.value }
                    : img
                ),
              }
            : s
        ),
      };
    case 'REMOVE_SLIDE_IMAGE':
      return {
        ...state,
        slides: state.slides.map((s) =>
          s.id === action.slideId
            ? {
                ...s,
                images: (s.images || []).filter((_, idx) => idx !== action.imageIndex),
              }
            : s
        ),
      };
    case 'REMOVE_SLIDE':
      return {
        ...state,
        slides: state.slides.filter((s) => s.id !== action.id),
      };
    default:
      return state;
  }
}

export function usePPTStore() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setTitleField = useCallback((field, value) => {
    dispatch({ type: 'SET_TITLE_FIELD', field, value });
  }, []);

  const setAuthor = useCallback((index, field, value) => {
    dispatch({ type: 'SET_AUTHOR', index, field, value });
  }, []);

  const addAuthor = useCallback(() => dispatch({ type: 'ADD_AUTHOR' }), []);
  const removeAuthor = useCallback((index) => dispatch({ type: 'REMOVE_AUTHOR', index }), []);

  const setSlideField = useCallback((id, field, value) => {
    dispatch({ type: 'SET_SLIDE_FIELD', id, field, value });
  }, []);

  const addSlide = useCallback(() => dispatch({ type: 'ADD_SLIDE' }), []);
  const removeSlide = useCallback((id) => dispatch({ type: 'REMOVE_SLIDE', id }), []);
  const addSlideImage = useCallback((slideId) => {
    dispatch({ type: 'ADD_SLIDE_IMAGE', slideId });
  }, []);
  const setSlideImageField = useCallback((slideId, imageIndex, field, value) => {
    dispatch({ type: 'SET_SLIDE_IMAGE_FIELD', slideId, imageIndex, field, value });
  }, []);
  const removeSlideImage = useCallback((slideId, imageIndex) => {
    dispatch({ type: 'REMOVE_SLIDE_IMAGE', slideId, imageIndex });
  }, []);

  return {
    pptData: state,
    setTitleField,
    setAuthor,
    addAuthor,
    removeAuthor,
    setSlideField,
    addSlide,
    removeSlide,
    addSlideImage,
    setSlideImageField,
    removeSlideImage,
  };
}
