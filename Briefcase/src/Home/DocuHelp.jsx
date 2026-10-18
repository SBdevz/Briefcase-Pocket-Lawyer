import React, { useState, useRef } from "react";

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
    <div style={{ width: "100%", maxWidth: "850px", margin: "40px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      
      {/* Target Title Entity */}
      <h2 style={{ textAlign: "center", color: "#111827", marginBottom: "30px", fontSize: "28px" }}>
        AI Document Simplifier
      </h2>

      {/* Hidden Explorer Invoker element hook */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleChange}
        accept="application/pdf,text/plain"
      />

      {/* Massive Visual Drag Dropboard Interface */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        style={{
          border: dragActive ? "3px dashed #4f46e5" : "3px dashed #d1d5db",
          backgroundColor: dragActive ? "#eef2ff" : "#f9fafb",
          padding: "70px 40px",
          textAlign: "center",
          borderRadius: "16px",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
        }}
      >
        <div style={{ fontSize: "56px", marginBottom: "15px" }}>📄</div>
        <h3 style={{ margin: "0 0 10px 0", color: "#1f2937", fontSize: "22px", fontWeight: "600" }}>
          Drag and drop your document here
        </h3>
        <p style={{ margin: "0 0 25px 0", color: "#6b7280", fontSize: "15px" }}>
          Supports PDF and text files up to {MAX_SIZE_MB}MB
        </p>
        <button
          type="button"
          style={{
            padding: "12px 28px",
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            fontSize: "16px",
            fontWeight: "600",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)"
          }}
        >
          Select File from Device
        </button>
      </div>

      {/* Selected File Stage Status Area */}
      {selectedFile && (
        <div style={{ marginTop: "30px", backgroundColor: "#f3f4f6", padding: "16px 20px", borderRadius: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              <span style={{ marginRight: "8px" }}>📎</span>
              <strong style={{ color: "#374151" }}>{selectedFile.name}</strong>
              <span style={{ color: "#6b7280", marginLeft: "10px" }}>({formatFileSize(selectedFile.size)})</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Avoids firing parent div explorer trigger
                removeFile();
              }}
              style={{
                backgroundColor: "transparent",
                color: "#ef4444",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "18px"
              }}
            >
              ✕
            </button>
          </div>

          {/* Action trigger submit button wrapper */}
          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <button
              type="button"
              onClick={handleSimplifySubmit}
              disabled={isLoading}
              style={{
                padding: "14px 35px",
                backgroundColor: isLoading ? "#9ca3af" : "#10b981",
                color: "white",
                border: "none",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "8px",
                cursor: isLoading ? "not-allowed" : "pointer",
                boxShadow: isLoading ? "none" : "0 4px 6px -1px rgba(16, 185, 129, 0.2)",
                transition: "all 0.2s"
              }}
            >
              {isLoading ? "Analyzing & Simplifying..." : "Simplify Document"}
            </button>
          </div>
        </div>
      )}

      {/* AI Output Stream Interface Dashboard Block */}
      {simplifiedResult && (
        <div style={{ marginTop: "40px", borderTop: "2px solid #e5e7eb", paddingTop: "30px" }}>
          <h3 style={{ color: "#111827", fontSize: "20px", marginBottom: "15px", fontWeight: "600" }}>
            ✨ Simplified Breakdown
          </h3>
          <div 
            style={{ 
              backgroundColor: "#fff", 
              border: "1px solid #e5e7eb", 
              borderRadius: "12px", 
              padding: "24px", 
              whiteSpace: "pre-wrap", 
              lineHeight: "1.6",
              color: "#374151",
              fontSize: "15px",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
            }}
          >
            {simplifiedResult}
          </div>
        </div>
      )}
    </div>
  );
}


