import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import ResizeHandle from './components/ResizeHandle';
import PDFPreview from './components/preview/PDFPreview';
import TitleSlideEditor from './components/editors/TitleSlideEditor';
import ContentSlideEditor from './components/editors/ContentSlideEditor';
import TitlePageEditor from './components/editors/TitlePageEditor';
import ChapterEditor from './components/editors/ChapterEditor';
import ReferencesEditor from './components/editors/ReferencesEditor';
import AnnexureEditor from './components/editors/AnnexureEditor';
import { usePPTStore } from './store/pptStore';
import { useReportStore } from './store/reportStore';
import { useCompiler } from './hooks/useCompiler';
import { generatePPTLatex, generateReportLatex } from './lib/latexGenerators';

export default function App() {
  const [mode, setMode] = useState('ppt');
  const [activeSection, setActiveSection] = useState('title');
  const [previewWidth, setPreviewWidth] = useState(480);
  const [uploadingImage, setUploadingImage] = useState(false);
  const containerRef = useRef(null);

  // PPT Store
  const {
    pptData, setTitleField, setAuthor, addAuthor, removeAuthor,
    setSlideField, addSlide, removeSlide,
    addSlideImage, setSlideImageField, removeSlideImage,
  } = usePPTStore();

  // Report Store
  const {
    reportData, setFrontField, setFrontAuthor, addFrontAuthor, removeFrontAuthor,
    setChapterTitle, addChapter, removeChapter,
    setSectionField, addSection, removeSection,
    setSubsectionField, addSubsection, removeSubsection,
    addSubsectionImage, setSubsectionImageField, removeSubsectionImage,
    setReferenceField, addReference, removeReference,
    setAnnexure,
  } = useReportStore();

  const uploadImage = useCallback(async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    setUploadingImage(true);
    try {
      try {
        const res = await axios.post('/api/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
      } catch (_err) {
        // Backward compatibility for deployments exposing non-/api routes.
        const res = await axios.post('/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
      }
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const handlePPTImageChange = useCallback(async (slideId, imageIndex, field, value) => {
    if (field === 'upload') {
      try {
        const uploaded = await uploadImage(value);
        setSlideImageField(slideId, imageIndex, 'path', uploaded.path);
        toast.success('Image uploaded');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Image upload failed');
      }
      return;
    }

    setSlideImageField(slideId, imageIndex, field, value);
  }, [setSlideImageField, uploadImage]);

  const handleReportImageChange = useCallback(async (chapterId, sectionId, subId, imageIndex, field, value) => {
    if (field === 'upload') {
      try {
        const uploaded = await uploadImage(value);
        setSubsectionImageField(chapterId, sectionId, subId, imageIndex, 'path', uploaded.path);
        toast.success('Image uploaded');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Image upload failed');
      }
      return;
    }

    setSubsectionImageField(chapterId, sectionId, subId, imageIndex, field, value);
  }, [setSubsectionImageField, uploadImage]);

  // Generate LaTeX string
  const latexString = useMemo(() => {
    try {
      if (mode === 'ppt') return generatePPTLatex(pptData);
      return generateReportLatex(reportData);
    } catch (e) {
      console.error('LaTeX generation error:', e);
      return '';
    }
  }, [mode, pptData, reportData]);

  // Compiler hook
  const { pdfData, compiling, compileError, lastSuccess, compileTime, manualCompile } = useCompiler(latexString, mode);

  // Resize handler
  const handleResize = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newWidth = rect.right - clientX;
    const clamped = Math.max(320, Math.min(newWidth, rect.width - 400));
    setPreviewWidth(clamped);
  }, []);

  // Download .tex
  const handleDownload = useCallback(() => {
    const blob = new Blob([latexString], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.tex';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded main.tex');
  }, [latexString]);

  const savePdfBytes = useCallback((bytes) => {
    if (!bytes || bytes.length === 0) return false;

    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mode === 'ppt' ? 'presentation' : 'report'}-preview.pdf`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    // Delay cleanup to avoid browser race conditions that cancel downloads.
    setTimeout(() => {
      URL.revokeObjectURL(url);
      link.remove();
    }, 1000);

    return true;
  }, [mode]);

  const handleCompile = useCallback(async () => {
    const result = await manualCompile();
    if (result && !result.ok) {
      toast.error('Compile failed');
    }
  }, [manualCompile]);

  const handleDownloadPdf = useCallback(async () => {
    if (compiling) {
      toast.message('Compilation is in progress...');
      return;
    }

    if (pdfData && pdfData.length > 0) {
      if (savePdfBytes(pdfData)) {
        toast.success('Downloaded PDF');
        return;
      }
    }

    const result = await manualCompile();
    if (result && result.ok && result.pdf) {
      if (savePdfBytes(result.pdf)) {
        toast.success('Compiled and downloaded PDF');
        return;
      }
    }

    toast.error('Unable to download PDF');
  }, [compiling, manualCompile, pdfData, savePdfBytes]);

  // Mode change
  const handleModeChange = useCallback((newMode) => {
    setMode(newMode);
    setActiveSection(newMode === 'ppt' ? 'title' : 'titlepage');
  }, []);

  // Compile notification
  React.useEffect(() => {
    if (lastSuccess && !compiling) {
      toast.success(`Compiled in ${Math.round(compileTime / 1000)}s`);
    }
  }, [lastSuccess]);

  React.useEffect(() => {
    if (compileError) {
      toast.error('Compile error — check log');
    }
  }, [compileError]);

  // Render active editor
  const renderEditor = () => {
    if (mode === 'ppt') {
      switch (activeSection) {
        case 'title':
          return (
            <TitleSlideEditor
              data={pptData.title}
              onChange={setTitleField}
              onAuthorChange={setAuthor}
              onAddAuthor={addAuthor}
              onRemoveAuthor={removeAuthor}
            />
          );
        case 'slides':
          return (
            <ContentSlideEditor
              slides={pptData.slides}
              onSlideChange={setSlideField}
              onAddSlide={addSlide}
              onRemoveSlide={removeSlide}
              onAddImage={addSlideImage}
              onImageChange={handlePPTImageChange}
              onRemoveImage={removeSlideImage}
              uploadingImage={uploadingImage}
            />
          );
        default:
          return null;
      }
    }

    // Report mode
    switch (activeSection) {
      case 'titlepage':
        return (
          <TitlePageEditor
            data={reportData.front}
            onChange={setFrontField}
            onAuthorChange={setFrontAuthor}
            onAddAuthor={addFrontAuthor}
            onRemoveAuthor={removeFrontAuthor}
          />
        );
      case 'chapters':
        return (
          <ChapterEditor
            chapters={reportData.chapters}
            onChapterTitleChange={setChapterTitle}
            onAddChapter={addChapter}
            onRemoveChapter={removeChapter}
            onSectionChange={setSectionField}
            onAddSection={addSection}
            onRemoveSection={removeSection}
            onSubsectionChange={setSubsectionField}
            onAddSubsection={addSubsection}
            onRemoveSubsection={removeSubsection}
            onAddSubsectionImage={addSubsectionImage}
            onSubsectionImageChange={handleReportImageChange}
            onRemoveSubsectionImage={removeSubsectionImage}
            uploadingImage={uploadingImage}
          />
        );
      case 'references':
        return (
          <ReferencesEditor
            references={reportData.references}
            onRefFieldChange={setReferenceField}
            onAddRef={addReference}
            onRemoveRef={removeReference}
          />
        );
      case 'annexure':
        return (
          <AnnexureEditor
            value={reportData.annexure}
            onChange={setAnnexure}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-bg text-t1">
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: '#201f1f',
            border: '1px solid #353534',
            color: '#e5e2e1',
            fontSize: '13px',
          },
        }}
      />

      <TopNav
        mode={mode}
        setMode={handleModeChange}
        onCompile={handleCompile}
        onDownload={handleDownload}
        onDownloadPdf={handleDownloadPdf}
        compiling={compiling}
      />

      <div ref={containerRef} className="flex-1 flex overflow-hidden">
        <Sidebar
          mode={mode}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <div className="flex-1 flex overflow-hidden bg-surface0">
          {/* Editor panel */}
          <div className="flex-1 overflow-y-auto px-10 py-8">
            {renderEditor()}
          </div>

          <ResizeHandle onResize={handleResize} />

          {/* Preview panel */}
          <div style={{ width: previewWidth, minWidth: 340 }} className="flex-shrink-0">
            <PDFPreview
              pdfData={pdfData}
              compiling={compiling}
              compileError={compileError}
              lastSuccess={lastSuccess}
              compileTime={compileTime}
              mode={mode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
