import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import Header from "../Home/Header.jsx";

export default function DocuHelp() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [simplifiedResult, setSimplifiedResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // 100MB File Ceiling
  const MAX_SIZE_MB = 100;

  // Converts file bytes into a clean, human-readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Validates file size limits before staging it
  const processFile = (file) => {
    if (!file) return;

    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > MAX_SIZE_MB) {
      alert(`"${file.name}" is too large! Maximum limit is ${MAX_SIZE_MB}MB.`);
      return;
    }

    // Set as the active single file to be processed
    setSelectedFile(file);
    // Clear out previous results when a new file is staged
    setSimplifiedResult(""); 
  };

  // Drag handshake controls to prevent default browser page redirects
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handles files dropped directly onto the element
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Handles traditional system explorer selection paths
  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // Clears out the current file selection
  const removeFile = () => {
    setSelectedFile(null);
    setSimplifiedResult("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Asynchronous API Pipeline invocation
  const handleSimplifySubmit = async () => {
    if (!selectedFile) {
      alert("Please select or drop a file first!");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    // "uploadedFiles" maps directly to your Node upload.single('uploadedFiles') parameter
    formData.append("uploadedFiles", selectedFile);

    try {
      // NOTE: Update this URL to match your specific backend router configuration (e.g., port 5000)
      const response = await fetch("/api/simplify", {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.error || `Simplification request failed (${response.status}). Check that the backend is running.`);
      }

      if (typeof data?.simplifiedText !== "string") {
        throw new Error("The backend returned an invalid response. Check the backend logs.");
      }

      // Set the AI generated markdown text block directly into the UI hook
      setSimplifiedResult(data.simplifiedText);
    } catch (error) {
      console.error("Simplification pipeline failure:", error);
      alert(error.message || "Failed to simplify document. Check backend routing.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-page home-newspaper document-help-page">
      <Header showAccountLink />
      <main className="document-help-main">
        <nav className="document-help-nav" aria-label="Breadcrumb">
          <Link to="/Home"><span aria-hidden="true">&larr;</span> Resource Toolbox</Link>
          <span>Document Help</span>
        </nav>

        <section className="document-help-intro" aria-labelledby="document-help-title">
          <p className="home-eyebrow"><span aria-hidden="true"></span> A plain-language legal tool</p>
          <h1 id="document-help-title">Document Help</h1>
          <p>Upload a PDF or text file to get a clearer, plain-language breakdown of what it says.</p>
        </section>

        <section className="document-help-tool" aria-labelledby="document-upload-title">
          <div className="document-help-tool-heading">
            <div>
              <p className="home-eyebrow">AI document simplifier</p>
              <h2 id="document-upload-title">Start with a document</h2>
            </div>
            <span className="document-help-step">PDF / TXT</span>
          </div>

          <input
            ref={fileInputRef}
            className="document-help-file-input"
            type="file"
            onChange={handleChange}
            accept="application/pdf,text/plain"
            aria-label="Choose a PDF or text document"
          />

          <button
            type="button"
            className={`document-help-dropzone${dragActive ? ' is-active' : ''}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            aria-describedby="document-help-file-types"
          >
            <span className="document-help-file-mark" aria-hidden="true">PDF<br />TXT</span>
            <span className="document-help-drop-title">Drop your document here</span>
            <span className="document-help-file-types" id="document-help-file-types">
              PDF and plain text files · maximum {MAX_SIZE_MB} MB
            </span>
            <span className="document-help-select-button">Choose a file</span>
          </button>

          {selectedFile && (
            <div className="document-help-selected-file" aria-live="polite">
              <div className="document-help-file-info">
                <span className="document-help-file-tag" aria-hidden="true">FILE</span>
                <div className="document-help-file-name">
                  <strong>{selectedFile.name}</strong>
                  <span>{formatFileSize(selectedFile.size)}</span>
                </div>
              </div>
              <button className="document-help-remove" type="button" onClick={removeFile} aria-label="Remove selected file" title="Remove selected file">
                &times;
              </button>
              <button className="document-help-submit" type="button" onClick={handleSimplifySubmit} disabled={isLoading}>
                {isLoading ? 'Analyzing and simplifying...' : 'Simplify document'}
              </button>
            </div>
          )}

          {simplifiedResult && (
            <section className="document-help-result" aria-labelledby="document-result-title">
              <p className="home-eyebrow">Your document, clarified</p>
              <h2 id="document-result-title">Simplified Breakdown</h2>
              <div className="document-help-markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{simplifiedResult}</ReactMarkdown>
              </div>
            </section>
          )}
        </section>

        <aside className="document-help-disclaimer">
          <strong>Information, not legal advice.</strong>
          <span>This tool helps explain document language and is not a substitute for advice from a qualified attorney.</span>
        </aside>
      </main>
      <footer className="document-help-footer">
        <Link to="/Home"><span aria-hidden="true">&larr;</span> Back to Resource Toolbox</Link>
        <p>Briefcase Pocket Lawyer · Information, not legal advice</p>
      </footer>
    </div>
  );
}


