// src/app/upload/page.js
'use client';

import { useState } from 'react';

export default function DocumentUpload() {
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const supportedTypes = [
    'pdf', 'docx', 'doc', 'xlsx', 'xls', 'csv', 'txt', 
    'rtf', 'xml', 'json', 'html', 'htm', 'md', 'markdown'
  ];

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Check file type
    const fileExtension = file.name.toLowerCase().split('.').pop();
    if (!supportedTypes.includes(fileExtension)) {
      setError(`Unsupported file type: ${fileExtension}`);
      return;
    }

    setLoading(true);
    setError(null);
    setExtractedData(null);
    
    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await fetch('/api/extract-document', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        setExtractedData(result);
      } else {
        setError(result.error || 'Failed to extract document');
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    handleFileUpload(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Text copied to clipboard!');
  };

  const downloadExtractedText = () => {
    if (!extractedData) return;
    
    const blob = new Blob([extractedData.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted_${extractedData.fileName.replace(/\.[^/.]+$/, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Document Text Extractor</h1>
      
      {/* File Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="mb-4">
          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        
        <div className="mb-4">
          <label className="cursor-pointer">
            <span className="text-lg font-medium text-blue-600 hover:text-blue-500">
              Choose a file
            </span>
            <input
              type="file"
              className="hidden"
              accept={supportedTypes.map(type => `.${type}`).join(',')}
              onChange={handleFileSelect}
              disabled={loading}
            />
          </label>
          <p className="text-gray-500 mt-2">or drag and drop a file here</p>
        </div>
        
        <div className="text-sm text-gray-600">
          <p className="mb-2">Supported formats:</p>
          <p className="flex flex-wrap justify-center gap-2">
            {supportedTypes.map(type => (
              <span key={type} className="px-2 py-1 bg-gray-200 rounded text-xs">
                .{type}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Extracting text from document...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Results */}
      {extractedData && (
        <div className="mt-6 space-y-4">
          {/* Metadata */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Document Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">File:</span>
                <p className="font-medium">{extractedData.fileName}</p>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <p className="font-medium uppercase">{extractedData.fileType}</p>
              </div>
              <div>
                <span className="text-gray-600">Pages/Sheets:</span>
                <p className="font-medium">{extractedData.pages}</p>
              </div>
              <div>
                <span className="text-gray-600">Text Length:</span>
                <p className="font-medium">{extractedData.text.length.toLocaleString()} chars</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => copyToClipboard(extractedData.text)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={downloadExtractedText}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Download as TXT
            </button>
          </div>

          {/* Extracted Text */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Extracted Text</h3>
            <div className="max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {extractedData.text}
              </pre>
            </div>
          </div>

          {/* Additional Metadata */}
          {extractedData.metadata && Object.keys(extractedData.metadata).length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Additional Information</h3>
              <pre className="text-sm text-gray-600 overflow-x-auto">
                {JSON.stringify(extractedData.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}