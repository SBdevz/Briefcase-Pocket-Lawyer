import React, { useState, useRef } from "react";

export default function FileUploader() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Maximum allowed file size (e.g., 100MB)
  const MAX_SIZE_MB = 100;

  // Converts large raw bytes into highly readable formats (KB, MB, GB)
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Validates file size limits before committing them to state
  const processFiles = (incomingFiles) => {
    const validFiles = incomingFiles.filter((file) => {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > MAX_SIZE_MB) {
        alert(`"${file.name}" is too large! Maximum limit is ${MAX_SIZE_MB}MB.`);
        return false;
      }
      return true;
    });

    // Merge new files into state without duplicating exact file duplicates
    setFiles((prevFiles) => {
      const existingNames = prevFiles.map((f) => f.name + f.size);
      const uniqueNewFiles = validFiles.filter(
        (f) => !existingNames.includes(f.name + f.size)
      );
      return [...prevFiles, ...uniqueNewFiles];
    });
  };

  // Drag handshakes & prevent background window redirecting
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Dropped file event handling
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Standard OS explorer selection event handling
  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  // Removes a target item from the selection queue
  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, idx) => idx !== indexToRemove));
  };

  // Main submission handler logic
  const handleUploadSubmit = () => {
    if (files.length === 0) {
      alert("Please select or drop files first!");
      return;
    }

    // Prepare files to send to an API endpoint 
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("uploadedFiles", file);
    });

    console.log("Submitting FormData structure containing:", files);
    alert(`Success! Ready to push ${files.length} file(s) to server.`);
    
    // Optional: Reset state queue post-upload
    // setFiles([]);
  };

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "40px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      
      {/* Hidden File Picker Input — open to documents, images, text & spreadsheets */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleChange}
        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain"
      />

      {/* Expanded Interactive Drop Zone Dashboard */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        style={{
          border: dragActive ? "3px dashed #007bff" : "3px dashed #bbb",
          backgroundColor: dragActive ? "#f0f7ff" : "#fbfbfb",
          padding: "80px 40px",
          textAlign: "center",
          borderRadius: "16px",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}
      >
        <div style={{ fontSize: "56px", marginBottom: "15px" }}>📁</div>
        <h3 style={{ margin: "0 0 10px 0", color: "#333", fontSize: "22px", fontWeight: "600" }}>
          Drag and drop your files here
        </h3>
        <p style={{ margin: "0 0 25px 0", color: "#666", fontSize: "15px" }}>
          Accepts Photos, PDFs, Word docs, Spreadsheets, and Text up to {MAX_SIZE_MB}MB
        </p>
        <button
          type="button"
          style={{
            padding: "12px 28px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            fontSize: "16px",
            fontWeight: "600",
            borderRadius: "6px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,123,255,0.3)"
          }}
        >
          Browse Files from Device
        </button>
      </div>

      {/* Interactive Selected File Feed */}
      {files.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h4 style={{ fontSize: "18px", color: "#222", marginBottom: "15px" }}>
            Staged Files ({files.length}):
          </h4>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            {files.map((file, idx) => (
              <li
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "between",
                  alignItems: "center",
                  backgroundColor: "#f4f4f5",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "8px",
                  fontSize: "14px"
                }}
              >
                <div style={{ flexGrow: 1, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", paddingRight: "10px" }}>
                  <span>📄</span> <strong style={{ color: "#333" }}>{file.name}</strong> 
                  <span style={{ color: "#666", marginLeft: "10px" }}>({formatFileSize(file.size)})</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Stops system file explorer from firing on click
                    removeFile(idx);
                  }}
                  style={{
                    backgroundColor: "transparent",
                    color: "#dc3545",
                    border: "none",
                    fontWeight: "bold",
                    cursor: "pointer",
                    padding: "4px 8px",
                    fontSize: "16px"
                  }}
                  title="Remove from queue"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          {/* Core Master Action Submission Upload Button */}
          <div style={{ textAlign: "right", marginTop: "25px" }}>
            <button
              type="button"
              onClick={handleUploadSubmit}
              style={{
                padding: "14px 40px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "6px",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(40,167,69,0.3)",
                transition: "background-color 0.2s"
              }}
            >
              Upload {files.length} File{files.length > 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

