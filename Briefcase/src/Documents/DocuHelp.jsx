import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import Header from "../Home/Header.jsx";

export default function DocuHelp() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [simplifiedResult, setSimplifiedResult] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [followUps, setFollowUps] = useState([]);
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [followUpError, setFollowUpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const fileInputRef = useRef(null);

  // Keep uploads below Vercel's serverless request size limit.
  const MAX_SIZE_MB = 4;

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
    setDocumentText("");
    setFollowUps([]);
    setFollowUpQuestion("");
    setFollowUpError("");
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
    setDocumentText("");
    setFollowUps([]);
    setFollowUpQuestion("");
    setFollowUpError("");
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
      // Keep the extracted document text so follow-up questions can reference it
      setDocumentText(typeof data.documentText === "string" ? data.documentText : "");
      setFollowUps([]);
      setFollowUpQuestion("");
      setFollowUpError(typeof data.documentText === "string" && data.documentText
        ? ""
        : "Follow-up questions need a fresh simplify. Re-run Simplify document, then ask away.");
    } catch (error) {
      console.error("Simplification pipeline failure:", error);
      alert(error.message || "Failed to simplify document. Check backend routing.");
    } finally {
      setIsLoading(false);
    }
  };

  // Asks a follow-up question about the document that was just simplified
  const handleFollowUpSubmit = async (event) => {
    event.preventDefault();

    const question = followUpQuestion.trim();
    if (!question || isAsking) return;

    if (!documentText) {
      setFollowUpError("This result came from an older session. Re-run Simplify document, then ask your question.");
      return;
    }

    setIsAsking(true);
    setFollowUpError("");

    try {
      const response = await fetch("/api/document-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText,
          question,
          history: followUps.flatMap((item) => [
            { role: "user", content: item.question },
            { role: "assistant", content: item.answer },
          ]),
        }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.error || `Follow-up request failed (${response.status}). Check that the backend is running.`);
      }
      if (typeof data?.answer !== "string" || !data.answer.trim()) {
        throw new Error("The backend returned an invalid response. Check the backend logs.");
      }

      setFollowUps((current) => [...current, { id: `followup-${Date.now()}`, question, answer: data.answer.trim() }]);
      setFollowUpQuestion("");
    } catch (error) {
      console.error("Follow-up question failure:", error);
      setFollowUpError(error.message || "Failed to answer that question. Check backend routing.");
    } finally {
      setIsAsking(false);
    }
  };

  // Enter sends the follow-up; Shift+Enter adds a new line
  const handleFollowUpKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleFollowUpSubmit(event);
    }
  };

  return (
    <div className="ai-shell document-help-shell">
      <Header showAccountLink />
      <main className="ai-page document-help-main">
        <nav className="document-help-nav" aria-label="Breadcrumb">
          <Link to="/Home"><span aria-hidden="true">&larr;</span> Resource Toolbox</Link>
          <span>Document Help</span>
        </nav>

        <section className="document-help-intro" aria-labelledby="document-help-title">
          <p className="ai-kicker">A plain-language legal tool</p>
          <h1 id="document-help-title">Document Help</h1>
          <p>Upload a PDF or text file to get a clearer, plain-language breakdown of what it says.</p>
        </section>

        <section className="document-help-tool" aria-labelledby="document-upload-title">
          <div className="document-help-tool-heading">
            <div>
              <p className="ai-kicker">AI document simplifier</p>
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

          {isLoading && (
            <div className="ai-message ai-message-assistant ai-typing document-help-thinking" role="status">
              <span className="ai-message-label">BEN SAYS</span>
              <p>Reading and simplifying your document...</p>
            </div>
          )}

          {simplifiedResult && (
            <section className="document-help-result" aria-labelledby="document-result-title">
              <div className="ai-message-list document-help-result-list">
                <article className="ai-message ai-message-assistant document-help-result-message">
                  <span className="ai-message-label">SIMPLIFIED BREAKDOWN</span>
                  <div className="ai-markdown">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{simplifiedResult.replace(/<br\s*\/?>/gi, '\n')}</ReactMarkdown>
                  </div>
                </article>
              </div>

              <div className="document-help-followup" aria-labelledby="document-followup-title">
                <p className="ai-kicker">Still curious?</p>
                <h2 id="document-followup-title">Ask a question about this document</h2>
                <p className="document-help-followup-intro">
                  Follow up on anything in the breakdown — deadlines, obligations, or terms you want explained in plainer language.
                </p>

                {(followUps.length > 0 || isAsking) && (
                  <div className="ai-message-list document-help-qa-list" aria-live="polite">
                    {followUps.map((item) => (
                      <div className="document-help-qa-pair" key={item.id}>
                        <article className="ai-message ai-message-user">
                          <span className="ai-message-label">YOU ASKED</span>
                          <p>{item.question}</p>
                        </article>
                        <article className="ai-message ai-message-assistant">
                          <span className="ai-message-label">BEN SAYS</span>
                          <div className="ai-markdown">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.answer.replace(/<br\s*\/?>/gi, '\n')}</ReactMarkdown>
                          </div>
                        </article>
                      </div>
                    ))}
                    {isAsking && (
                      <div className="ai-message ai-message-assistant ai-typing" role="status">
                        <span className="ai-message-label">BEN SAYS</span>
                        <p>Reviewing your document...</p>
                      </div>
                    )}
                  </div>
                )}

                {followUpError && <p className="ai-error document-help-followup-error" role="alert">{followUpError}</p>}

                <form className="ai-composer document-help-followup-form" onSubmit={handleFollowUpSubmit}>
                  <label className="ai-sr-only" htmlFor="document-followup-question">Your follow-up question</label>
                  <textarea
                    id="document-followup-question"
                    className="document-help-followup-input"
                    value={followUpQuestion}
                    onChange={(event) => setFollowUpQuestion(event.target.value)}
                    onKeyDown={handleFollowUpKeyDown}
                    placeholder="Ask a question about this document..."
                    rows={2}
                    disabled={isAsking}
                  />
                  <button className="document-help-followup-submit" type="submit" aria-label="Send follow-up question" disabled={isAsking || !followUpQuestion.trim()}>
                    <span aria-hidden="true">&uarr;</span>
                  </button>
                </form>
              </div>
            </section>
          )}
        </section>

        <aside className="document-help-disclaimer">
          <strong>Information, not legal advice.</strong>
          <span>This tool helps explain document language and is not a substitute for advice from a qualified attorney.</span>
        </aside>

        <footer className="document-help-footer">
          <Link to="/Home"><span aria-hidden="true">&larr;</span> Back to Resource Toolbox</Link>
          <p>Briefcase Pocket Lawyer · Information, not legal advice</p>
        </footer>
      </main>
    </div>
  );
}


