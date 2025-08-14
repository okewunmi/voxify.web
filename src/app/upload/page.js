// // src/app/upload/page.js
// 'use client';

// import { useState } from 'react';

// export default function DocumentUpload() {
//   const [extractedData, setExtractedData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [dragOver, setDragOver] = useState(false);

//   const supportedTypes = [
//     'pdf', 'docx', 'doc', 'xlsx', 'xls', 'csv', 'txt', 
//     'rtf', 'xml', 'json', 'html', 'htm', 'md', 'markdown'
//   ];

//   const handleFileUpload = async (file) => {
//     if (!file) return;

//     // Check file type
//     const fileExtension = file.name.toLowerCase().split('.').pop();
//     if (!supportedTypes.includes(fileExtension)) {
//       setError(`Unsupported file type: ${fileExtension}`);
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setExtractedData(null);
    
//     const formData = new FormData();
//     formData.append('document', file);

//     try {
//       const response = await fetch('/api/extract-text', {
//         method: 'POST',
//         body: formData,
//       });

//       const result = await response.json();
      
//       if (response.ok) {
//         setExtractedData(result);
//       } else {
//         setError(result.error || 'Failed to extract document');
//       }
//     } catch (error) {
//       setError('Network error: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileSelect = (event) => {
//     const file = event.target.files[0];
//     handleFileUpload(file);
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     setDragOver(false);
//     const file = event.dataTransfer.files[0];
//     handleFileUpload(file);
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//     setDragOver(true);
//   };

//   const handleDragLeave = (event) => {
//     event.preventDefault();
//     setDragOver(false);
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     alert('Text copied to clipboard!');
//   };

//   const downloadExtractedText = () => {
//     if (!extractedData) return;
    
//     const blob = new Blob([extractedData.text], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `extracted_${extractedData.fileName.replace(/\.[^/.]+$/, '')}.txt`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">Document Text Extractor</h1>
      
//       {/* File Upload Area */}
//       <div 
//         className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
//           dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
//         }`}
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//       >
//         <div className="mb-4">
//           <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
//           </svg>
//         </div>
        
//         <div className="mb-4">
//           <label className="cursor-pointer">
//             <span className="text-lg font-medium text-blue-600 hover:text-blue-500">
//               Choose a file
//             </span>
//             <input
//               type="file"
//               className="hidden"
//               accept={supportedTypes.map(type => `.${type}`).join(',')}
//               onChange={handleFileSelect}
//               disabled={loading}
//             />
//           </label>
//           <p className="text-gray-500 mt-2">or drag and drop a file here</p>
//         </div>
        
//         <div className="text-sm text-gray-600">
//           <p className="mb-2">Supported formats:</p>
//           <p className="flex flex-wrap justify-center gap-2">
//             {supportedTypes.map(type => (
//               <span key={type} className="px-2 py-1 bg-gray-200 rounded text-xs">
//                 .{type}
//               </span>
//             ))}
//           </p>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="text-center py-8">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           <p className="mt-2 text-gray-600">Extracting text from document...</p>
//         </div>
//       )}

//       {/* Error State */}
//       {error && (
//         <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <p className="text-red-800">{error}</p>
//         </div>
//       )}

//       {/* Results */}
//       {extractedData && (
//         <div className="mt-6 space-y-4">
//           {/* Metadata */}
//           <div className="bg-blue-50 p-4 rounded-lg">
//             <h3 className="font-semibold text-blue-800 mb-2">Document Information</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//               <div>
//                 <span className="text-gray-600">File:</span>
//                 <p className="font-medium">{extractedData.fileName}</p>
//               </div>
//               <div>
//                 <span className="text-gray-600">Type:</span>
//                 <p className="font-medium uppercase">{extractedData.fileType}</p>
//               </div>
//               <div>
//                 <span className="text-gray-600">Pages/Sheets:</span>
//                 <p className="font-medium">{extractedData.pages}</p>
//               </div>
//               <div>
//                 <span className="text-gray-600">Text Length:</span>
//                 <p className="font-medium">{extractedData.text.length.toLocaleString()} chars</p>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-2">
//             <button
//               onClick={() => copyToClipboard(extractedData.text)}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//             >
//               Copy to Clipboard
//             </button>
//             <button
//               onClick={downloadExtractedText}
//               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
//             >
//               Download as TXT
//             </button>
//           </div>

//           {/* Extracted Text */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="font-semibold text-gray-800 mb-2">Extracted Text</h3>
//             <div className="max-h-96 overflow-y-auto">
//               <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
//                 {extractedData.text}
//               </pre>
//             </div>
//           </div>

//           {/* Additional Metadata */}
//           {extractedData.metadata && Object.keys(extractedData.metadata).length > 0 && (
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="font-semibold text-gray-800 mb-2">Additional Information</h3>
//               <pre className="text-sm text-gray-600 overflow-x-auto">
//                 {JSON.stringify(extractedData.metadata, null, 2)}
//               </pre>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // src/app/upload/page.js
// // 'use client';

// // import { useState, useEffect } from 'react';

// // export default function DocumentUpload() {
// //   const [extractedData, setExtractedData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [dragOver, setDragOver] = useState(false);

// //   const supportedTypes = [
// //     'pdf', 'docx', 'doc', 'xlsx', 'xls', 'csv', 'txt', 
// //     'rtf', 'xml', 'json', 'html', 'htm', 'md', 'markdown'
// //   ];

// //   // Load AdSense script
// //   useEffect(() => {
// //     const script = document.createElement('script');
// //     script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9552203090932814';
// //     script.async = true;
// //     script.crossOrigin = 'anonymous';
// //     document.head.appendChild(script);

// //     return () => {
// //       // Cleanup script if component unmounts
// //       if (document.head.contains(script)) {
// //         document.head.removeChild(script);
// //       }
// //     };
// //   }, []);

// //   // Initialize ads when content changes
// //   useEffect(() => {
// //     try {
// //       if (window.adsbygoogle) {
// //         window.adsbygoogle.push({});
// //       }
// //     } catch (e) {
// //       console.error('AdSense error:', e);
// //     }
// //   }, [extractedData]);

// //   const AdSenseAd = () => (
// //     <div className="my-6 text-center">
// //       <ins 
// //         className="adsbygoogle"
// //         style={{ display: 'block' }}
// //         data-ad-client="ca-pub-9552203090932814"
// //         data-ad-slot="4710767514"
// //         data-ad-format="auto"
// //         data-full-width-responsive="true"
// //       />
// //     </div>
// //   );

// //   const handleFileUpload = async (file) => {
// //     if (!file) return;

// //     // Check file type
// //     const fileExtension = file.name.toLowerCase().split('.').pop();
// //     if (!supportedTypes.includes(fileExtension)) {
// //       setError(`Unsupported file type: ${fileExtension}`);
// //       return;
// //     }

// //     setLoading(true);
// //     setError(null);
// //     setExtractedData(null);
    
// //     const formData = new FormData();
// //     formData.append('document', file);

// //     try {
// //       const response = await fetch('/api/extract-text', {
// //         method: 'POST',
// //         body: formData,
// //       });

// //       const result = await response.json();
      
// //       if (response.ok) {
// //         setExtractedData(result);
// //       } else {
// //         setError(result.error || 'Failed to extract document');
// //       }
// //     } catch (error) {
// //       setError('Network error: ' + error.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleFileSelect = (event) => {
// //     const file = event.target.files[0];
// //     handleFileUpload(file);
// //   };

// //   const handleDrop = (event) => {
// //     event.preventDefault();
// //     setDragOver(false);
// //     const file = event.dataTransfer.files[0];
// //     handleFileUpload(file);
// //   };

// //   const handleDragOver = (event) => {
// //     event.preventDefault();
// //     setDragOver(true);
// //   };

// //   const handleDragLeave = (event) => {
// //     event.preventDefault();
// //     setDragOver(false);
// //   };

// //   const copyToClipboard = (text) => {
// //     navigator.clipboard.writeText(text);
// //     alert('Text copied to clipboard!');
// //   };

// //   const downloadExtractedText = () => {
// //     if (!extractedData) return;
    
// //     const blob = new Blob([extractedData.text], { type: 'text/plain' });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = `extracted_${extractedData.fileName.replace(/\.[^/.]+$/, '')}.txt`;
// //     document.body.appendChild(a);
// //     a.click();
// //     document.body.removeChild(a);
// //     URL.revokeObjectURL(url);
// //   };

// //   return (
// //     <div className="max-w-4xl mx-auto p-6">
// //       <h1 className="text-3xl font-bold mb-6 text-center">Document Text Extractor</h1>
      
// //       {/* First Ad - After title */}
// //       {/* <AdSenseAd /> */}
      
// //       {/* File Upload Area */}
// //       <div 
// //         className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
// //           dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
// //         }`}
// //         onDrop={handleDrop}
// //         onDragOver={handleDragOver}
// //         onDragLeave={handleDragLeave}
// //       >
// //         <div className="mb-4">
// //           <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
// //           </svg>
// //         </div>
        
// //         <div className="mb-4">
// //           <label className="cursor-pointer">
// //             <span className="text-lg font-medium text-blue-600 hover:text-blue-500">
// //               Choose a file
// //             </span>
// //             <input
// //               type="file"
// //               className="hidden"
// //               accept={supportedTypes.map(type => `.${type}`).join(',')}
// //               onChange={handleFileSelect}
// //               disabled={loading}
// //             />
// //           </label>
// //           <p className="text-gray-500 mt-2">or drag and drop a file here</p>
// //         </div>
        
// //         <div className="text-sm text-gray-600">
// //           <p className="mb-2">Supported formats:</p>
// //           <p className="flex flex-wrap justify-center gap-2">
// //             {supportedTypes.map(type => (
// //               <span key={type} className="px-2 py-1 bg-gray-200 rounded text-xs">
// //                 .{type}
// //               </span>
// //             ))}
// //           </p>
// //         </div>
// //       </div>

// //       {/* Loading State */}
// //       {loading && (
// //         <div className="text-center py-8">
// //           <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// //           <p className="mt-2 text-gray-600">Extracting text from document...</p>
// //         </div>
// //       )}

// //       {/* Error State */}
// //       {error && (
// //         <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
// //           <p className="text-red-800">{error}</p>
// //         </div>
// //       )}

// //       {/* Second Ad - Before results (only show if there are results) */}
// //       {extractedData && <AdSenseAd />}

// //       {/* Results */}
// //       {extractedData && (
// //         <div className="mt-6 space-y-4">
// //           {/* Metadata */}
// //           <div className="bg-blue-50 p-4 rounded-lg">
// //             <h3 className="font-semibold text-blue-800 mb-2">Document Information</h3>
// //             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
// //               <div>
// //                 <span className="text-gray-600">File:</span>
// //                 <p className="font-medium">{extractedData.fileName}</p>
// //               </div>
// //               <div>
// //                 <span className="text-gray-600">Type:</span>
// //                 <p className="font-medium uppercase">{extractedData.fileType}</p>
// //               </div>
// //               <div>
// //                 <span className="text-gray-600">Pages/Sheets:</span>
// //                 <p className="font-medium">{extractedData.pages}</p>
// //               </div>
// //               <div>
// //                 <span className="text-gray-600">Text Length:</span>
// //                 <p className="font-medium">{extractedData.text.length.toLocaleString()} chars</p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Action Buttons */}
// //           <div className="flex gap-2">
// //             <button
// //               onClick={() => copyToClipboard(extractedData.text)}
// //               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
// //             >
// //               Copy to Clipboard
// //             </button>
// //             <button
// //               onClick={downloadExtractedText}
// //               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
// //             >
// //               Download as TXT
// //             </button>
// //           </div>

// //           {/* Extracted Text */}
// //           <div className="bg-gray-50 p-4 rounded-lg">
// //             <h3 className="font-semibold text-gray-800 mb-2">Extracted Text</h3>
// //             <div className="max-h-96 overflow-y-auto">
// //               <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
// //                 {extractedData.text}
// //               </pre>
// //             </div>
// //           </div>

// //           {/* Additional Metadata */}
// //           {extractedData.metadata && Object.keys(extractedData.metadata).length > 0 && (
// //             <div className="bg-gray-50 p-4 rounded-lg">
// //               <h3 className="font-semibold text-gray-800 mb-2">Additional Information</h3>
// //               <pre className="text-sm text-gray-600 overflow-x-auto">
// //                 {JSON.stringify(extractedData.metadata, null, 2)}
// //               </pre>
// //             </div>
// //           )}

// //           {/* Third Ad - After results */}
// //           <AdSenseAd />
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

import React, { useState } from 'react';
import { Copy, Download, FileText, Code, Play, Book, ChevronRight, CheckCircle } from 'lucide-react';

const DocumentExtractorDocs = () => {
  const [activeTab, setActiveTab] = useState('playground');
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState('javascript');
  const [copiedCode, setCopiedCode] = useState('');

  const supportedTypes = [
    'pdf', 'docx', 'doc', 'xlsx', 'xls', 'csv', 'txt', 
    'rtf', 'xml', 'json', 'html', 'htm', 'md', 'markdown'
  ];

  const handleFileUpload = async (file) => {
    if (!file) return;

    const fileExtension = file.name.toLowerCase().split('.').pop();
    if (!supportedTypes.includes(fileExtension)) {
      setError(`Unsupported file type: ${fileExtension}`);
      return;
    }

    setLoading(true);
    setError(null);
    setExtractedData(null);
    
    // Simulate API call for demo
    setTimeout(() => {
      setExtractedData({
        fileName: file.name,
        fileType: fileExtension,
        pages: Math.floor(Math.random() * 50) + 1,
        text: "This is a sample extracted text from your document. In a real implementation, this would contain the actual extracted content from your " + fileExtension.toUpperCase() + " file.",
        metadata: {
          author: "Sample Author",
          createdAt: new Date().toISOString(),
          wordCount: 324
        }
      });
      setLoading(false);
    }, 2000);
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

  const copyToClipboard = (text, codeId = '') => {
    navigator.clipboard.writeText(text);
    if (codeId) {
      setCopiedCode(codeId);
      setTimeout(() => setCopiedCode(''), 2000);
    }
  };

  const codeExamples = {
    javascript: `// Using Fetch API
const formData = new FormData();
formData.append('document', file);

const response = await fetch('https://api.docextractor.com/v1/extract', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
});

const result = await response.json();
console.log(result.text);`,

    python: `import requests

url = "https://api.docextractor.com/v1/extract"
headers = {
    'Authorization': 'Bearer YOUR_API_KEY'
}
files = {
    'document': open('document.pdf', 'rb')
}

response = requests.post(url, headers=headers, files=files)
result = response.json()
print(result['text'])`,

    curl: `curl -X POST https://api.docextractor.com/v1/extract \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "document=@/path/to/your/document.pdf"`,

    php: `<?php
$url = 'https://api.docextractor.com/v1/extract';
$headers = [
    'Authorization: Bearer YOUR_API_KEY'
];

$file = new CURLFile('/path/to/document.pdf');
$data = ['document' => $file];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$result = json_decode($response, true);
echo $result['text'];
?>`,

    nodejs: `const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

const form = new FormData();
form.append('document', fs.createReadStream('document.pdf'));

const response = await axios.post('https://api.docextractor.com/v1/extract', form, {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    ...form.getHeaders()
  }
});

console.log(response.data.text);`
  };

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'curl', name: 'cURL' },
    { id: 'php', name: 'PHP' },
    { id: 'nodejs', name: 'Node.js' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Document Text Extractor</h1>
                <p className="text-sm text-gray-600">Extract text from any document format</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">v1.0</span>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Get API Key
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('playground')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'playground' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Play className="w-4 h-4 inline mr-2" />
              Playground
            </button>
            <button
              onClick={() => setActiveTab('documentation')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'documentation' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Book className="w-4 h-4 inline mr-2" />
              Documentation
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'playground' ? (
          // Playground Section
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Try the API</h2>
              <p className="text-gray-600">Upload a document and see the text extraction in action</p>
            </div>

            {/* Upload Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                
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
                  <div className="flex flex-wrap justify-center gap-2">
                    {supportedTypes.map(type => (
                      <span key={type} className="px-2 py-1 bg-gray-200 rounded text-xs">
                        .{type}
                      </span>
                    ))}
                  </div>
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
                <div className="mt-8 space-y-6">
                  {/* Metadata */}
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Extraction Successful
                    </h3>
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
                  <div className="flex gap-3">
                    <button
                      onClick={() => copyToClipboard(extractedData.text)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </button>
                    <button
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download as TXT
                    </button>
                  </div>

                  {/* Extracted Text */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-4">Extracted Text</h3>
                    <div className="max-h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono bg-white p-4 rounded border">
                        {extractedData.text}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Documentation Section
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <h3 className="font-semibold text-gray-900 mb-4">Documentation</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#overview" className="text-blue-600 hover:text-blue-800">Overview</a></li>
                  <li><a href="#authentication" className="text-gray-600 hover:text-blue-600">Authentication</a></li>
                  <li><a href="#endpoints" className="text-gray-600 hover:text-blue-600">API Endpoints</a></li>
                  <li><a href="#request-format" className="text-gray-600 hover:text-blue-600">Request Format</a></li>
                  <li><a href="#response-format" className="text-gray-600 hover:text-blue-600">Response Format</a></li>
                  <li><a href="#code-examples" className="text-gray-600 hover:text-blue-600">Code Examples</a></li>
                  <li><a href="#error-handling" className="text-gray-600 hover:text-blue-600">Error Handling</a></li>
                  <li><a href="#rate-limits" className="text-gray-600 hover:text-blue-600">Rate Limits</a></li>
                </ul>
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Overview */}
              <section id="overview" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                <p className="text-gray-600 mb-6">
                  The Document Text Extractor API allows you to extract text content from various document formats including PDFs, Word documents, spreadsheets, and more. Perfect for document processing, content analysis, and data extraction workflows.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Multiple Formats</h4>
                    <p className="text-sm text-blue-700">Support for 13+ document formats</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Fast Processing</h4>
                    <p className="text-sm text-green-700">Extract text in seconds</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">RESTful API</h4>
                    <p className="text-sm text-purple-700">Simple HTTP-based interface</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Supported File Types:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {supportedTypes.map(type => (
                      <span key={type} className="text-sm text-gray-600">.{type}</span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Authentication */}
              <section id="authentication" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h2>
                <p className="text-gray-600 mb-4">
                  All API requests require authentication using your API key in the Authorization header:
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span>Authorization Header</span>
                    <button 
                      onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', 'auth')}
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedCode === 'auth' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  Authorization: Bearer YOUR_API_KEY
                </div>
              </section>

              {/* API Endpoints */}
              <section id="endpoints" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">API Endpoints</h2>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded mr-3 font-mono">POST</span>
                      <code className="text-gray-900 font-mono">/v1/extract</code>
                    </div>
                    <p className="text-gray-600">Extract text from uploaded document</p>
                  </div>
                </div>
              </section>

              {/* Request Format */}
              <section id="request-format" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Format</h2>
                <p className="text-gray-600 mb-4">Send a multipart/form-data POST request with your document:</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Parameters</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Parameter</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Type</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Required</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-2 font-mono text-sm">document</td>
                            <td className="px-4 py-2 text-sm">File</td>
                            <td className="px-4 py-2 text-sm">Yes</td>
                            <td className="px-4 py-2 text-sm">The document file to extract text from</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>

              {/* Response Format */}
              <section id="response-format" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Response Format</h2>
                <p className="text-gray-600 mb-4">Successful responses return JSON with the extracted text and metadata:</p>
                
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <div className="flex justify-between items-center mb-2">
                    <span>Response Example</span>
                    <button 
                      onClick={() => copyToClipboard(`{
  "success": true,
  "fileName": "document.pdf",
  "fileType": "pdf",
  "pages": 5,
  "text": "Extracted text content...",
  "metadata": {
    "author": "John Doe",
    "createdAt": "2024-01-15T10:30:00Z",
    "wordCount": 1250
  }
}`, 'response')}
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedCode === 'response' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <pre>{`{
  "success": true,
  "fileName": "document.pdf",
  "fileType": "pdf",
  "pages": 5,
  "text": "Extracted text content...",
  "metadata": {
    "author": "John Doe",
    "createdAt": "2024-01-15T10:30:00Z",
    "wordCount": 1250
  }
}`}</pre>
                </div>
              </section>

              {/* Code Examples */}
              <section id="code-examples" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Code Examples</h2>
                
                {/* Language Selector */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {languages.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => setActiveLanguage(lang.id)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        activeLanguage === lang.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>

                {/* Code Block */}
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">{languages.find(l => l.id === activeLanguage)?.name} Example</span>
                    <button 
                      onClick={() => copyToClipboard(codeExamples[activeLanguage], activeLanguage)}
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedCode === activeLanguage ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap">{codeExamples[activeLanguage]}</pre>
                </div>
              </section>

              {/* Error Handling */}
              <section id="error-handling" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Handling</h2>
                <p className="text-gray-600 mb-4">The API returns standard HTTP status codes and error messages:</p>
                
                <div className="space-y-3">
                  <div className="border border-red-200 bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <span className="font-mono text-sm font-semibold text-red-800">400</span>
                      <span className="ml-3 text-red-700">Bad Request - Invalid file type or missing parameters</span>
                    </div>
                  </div>
                  <div className="border border-red-200 bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <span className="font-mono text-sm font-semibold text-red-800">401</span>
                      <span className="ml-3 text-red-700">Unauthorized - Invalid or missing API key</span>
                    </div>
                  </div>
                  <div className="border border-red-200 bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <span className="font-mono text-sm font-semibold text-red-800">429</span>
                      <span className="ml-3 text-red-700">Too Many Requests - Rate limit exceeded</span>
                    </div>
                  </div>
                  <div className="border border-red-200 bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <span className="font-mono text-sm font-semibold text-red-800">500</span>
                      <span className="ml-3 text-red-700">Internal Server Error - Processing failed</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Rate Limits */}
              <section id="rate-limits" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Rate Limits</h2>
                <p className="text-gray-600 mb-4">API usage is subject to the following rate limits:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Free Tier</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 100 requests per hour</li>
                      <li>• 1,000 requests per month</li>
                      <li>• Max file size: 10MB</li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Pro Tier</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 1,000 requests per hour</li>
                      <li>• 50,000 requests per month</li>
                      <li>• Max file size: 100MB</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentExtractorDocs;