// src/app/ocr/page.js
'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, Eye, Download, Trash2, CheckCircle, XCircle, Clock, Image } from 'lucide-react';

export default function OCRTestPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection
  const handleFileSelect = useCallback((files) => {
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'image/webp', 'image/svg+xml'];
      return validTypes.includes(file.type);
    });
    setSelectedFiles(prev => [...prev, ...validFiles]);
  }, []);

  // Handle drag and drop
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  // Remove file from selection
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all files
  const clearFiles = () => {
    setSelectedFiles([]);
    setResults(null);
  };

  // Process OCR
  const processOCR = async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    const formData = new FormData();
    
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch('/api/extract-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setResults(result);
    } catch (error) {
      setResults({
        success: false,
        error: 'Failed to process images: ' + error.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Download results as text file
  const downloadResults = () => {
    if (!results?.combinedText) return;
    
    const blob = new Blob([results.combinedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ocr_results_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Text copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <FileText className="w-10 h-10 text-blue-600" />
            Advanced OCR Image Text Extractor
          </h1>
          <p className="text-gray-600 text-lg">
            Extract text from multiple images simultaneously with high accuracy
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Upload className="w-6 h-6 text-blue-600" />
              Upload Images
            </h2>

            {/* File Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4 text-lg">
                Drag and drop images here, or click to select
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                Choose Files
              </label>
              <p className="text-sm text-gray-500 mt-3">
                Supports: JPG, PNG, GIF, BMP, TIFF, WebP, SVG (Max 10MB each)
              </p>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Selected Files ({selectedFiles.length})
                  </h3>
                  <button
                    onClick={clearFiles}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                </div>
                
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 truncate">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={processOCR}
                  disabled={isProcessing}
                  className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Clock className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Eye className="w-5 h-5" />
                      Extract Text
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-green-600" />
              Extraction Results
            </h2>

            {!results ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Upload and process images to see results</p>
              </div>
            ) : (
              <div>
                {/* Results Summary */}
                {results.summary && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">Processing Summary</h3>
                    <div className="flex gap-4 text-sm">
                      <span className="text-blue-600">Total: {results.summary.total}</span>
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Success: {results.summary.successful}
                      </span>
                      {results.summary.failed > 0 && (
                        <span className="text-red-600 flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          Failed: {results.summary.failed}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Combined Text Output */}
                {results.combinedText && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-700">Extracted Text</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(results.combinedText)}
                          className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                        >
                          Copy
                        </button>
                        <button
                          onClick={downloadResults}
                          className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={results.combinedText}
                      readOnly
                      className="w-full h-64 p-4 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm resize-none"
                    />
                  </div>
                )}

                {/* Individual Results */}
                {results.results && results.results.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Individual Results</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {results.results.map((result, index) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800 truncate">
                              {result.filename}
                            </span>
                            {result.success ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                          {result.success ? (
                            <p className="text-sm text-gray-600 truncate">
                              {result.text.substring(0, 100)}
                              {result.text.length > 100 ? '...' : ''}
                            </p>
                          ) : (
                            <p className="text-sm text-red-600">{result.error}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {results.error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <h3 className="font-semibold mb-2">Error</h3>
                    <p>{results.error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}