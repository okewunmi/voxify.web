
import { NextRequest, NextResponse } from 'next/server';
import { promisify } from 'util';

// Dynamic imports to avoid build-time issues
let pdfParse, mammoth, XLSX, parseString, Tesseract;

// Initialize dependencies only when needed
async function initializeDependencies() {
  // PDF parsing libraries - using correct import paths
  if (!pdfParse) {
    try {
      const pdfParseModule = await import('pdf-parse/lib/pdf-parse.js');
      pdfParse = pdfParseModule.default || pdfParseModule;
    } catch (error) {
      try {
        // Fallback to regular import
        pdfParse = (await import('pdf-parse')).default;
      } catch (fallbackError) {
        console.warn('pdf-parse not available:', fallbackError.message);
      }
    }
  }

  if (!Tesseract) {
    try {
      Tesseract = await import('tesseract.js');
    } catch (error) {
      console.warn('tesseract.js not available:', error.message);
    }
  }
  
  // Other document parsers
  if (!mammoth) {
    try {
      mammoth = await import('mammoth');
    } catch (error) {
      console.warn('mammoth not available:', error.message);
    }
  }
  
  if (!XLSX) {
    try {
      XLSX = await import('xlsx');
    } catch (error) {
      console.warn('xlsx not available:', error.message);
    }
  }
  
  if (!parseString) {
    try {
      const xml2js = await import('xml2js');
      parseString = promisify(xml2js.parseString);
    } catch (error) {
      console.warn('xml2js not available:', error.message);
    }
  }
}

// PDF extraction method 1: pdf-parse (corrected version)
async function extractWithPdfParse(buffer) {
  if (!pdfParse) throw new Error('pdf-parse not available');
  
  try {
    // Ensure we pass buffer correctly with proper options
    const pdfData = await pdfParse(buffer, {
      max: 0, // No limit on pages
      version: 'default',
      // Disable file system operations
      normalizeWhitespace: true,
      disableCombineTextItems: false
    });
    
    return {
      text: pdfData.text || '',
      pages: pdfData.numpages || 0,
      metadata: {
        ...pdfData.info,
        producer: pdfData.metadata?.Producer,
        creator: pdfData.metadata?.Creator,
        title: pdfData.metadata?.Title
      },
      method: 'pdf-parse'
    };
  } catch (error) {
    throw new Error(`pdf-parse failed: ${error.message}`);
  }
}

// PDF extraction method 2: pdf.js with proper Node.js setup
async function extractWithPdfJs(buffer) {
  try {
    // Try different import paths for pdf.js
    let pdfjs;
    try {
      pdfjs = await import('pdfjs-dist/es5/build/pdf.js');
    } catch (e1) {
      try {
        pdfjs = await import('pdfjs-dist/build/pdf.js');
      } catch (e2) {
        try {
          pdfjs = await import('pdfjs-dist');
        } catch (e3) {
          throw new Error('Cannot import pdfjs-dist');
        }
      }
    }
    
    // Set up worker if needed
    if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    }
    
    const uint8Array = new Uint8Array(buffer);
    const loadingTask = pdfjs.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      disableFontFace: false,
      isEvalSupported: false
    });
    
    const pdf = await loadingTask.promise;
    let fullText = '';
    const totalPages = pdf.numPages;
    
    for (let i = 1; i <= totalPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map(item => {
            // Handle different text item formats
            if (typeof item === 'string') return item;
            return item.str || item.text || '';
          })
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (pageText) {
          fullText += pageText + '\n\n';
        }
        
        // Clean up page resources
        await page.cleanup();
      } catch (pageError) {
        console.warn(`Error extracting page ${i}:`, pageError.message);
        fullText += `[Error extracting page ${i}]\n\n`;
      }
    }
    
    // Clean up PDF document
    await pdf.destroy();
    
    return {
      text: fullText.trim(),
      pages: totalPages,
      metadata: { 
        producer: 'pdfjs',
        title: 'Extracted via PDF.js'
      },
      method: 'pdfjs'
    };
  } catch (error) {
    throw new Error(`pdfjs failed: ${error.message}`);
  }
}

// PDF extraction method 3: Using python-style extraction (better regex)
async function extractWithAdvancedRegex(buffer) {
  try {
    const pdfString = buffer.toString('latin1');
    let extractedText = '';
    
    // Method 1: Look for text objects with better patterns
    const textObjectRegex = /BT\s+(.*?)\s+ET/gs;
    const textMatches = pdfString.match(textObjectRegex) || [];
    
    for (const match of textMatches) {
      // Extract text from within parentheses and brackets
      const textContentRegex = /\((.*?)\)|<(.*?)>/g;
      let textMatch;
      
      while ((textMatch = textContentRegex.exec(match)) !== null) {
        const content = textMatch[1] || textMatch[2];
        if (content && content.length > 0) {
          // Decode basic PDF text encoding
          let decodedText = content
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\\\/g, '\\')
            .replace(/\\'/g, "'")
            .replace(/\\"/g, '"')
            .replace(/\\([0-7]{3})/g, (match, oct) => String.fromCharCode(parseInt(oct, 8)));
          
          extractedText += decodedText + ' ';
        }
      }
    }
    
    // Method 2: If no text objects found, try stream extraction
    if (!extractedText.trim()) {
      const streamRegex = /stream\s+(.*?)\s+endstream/gs;
      const streamMatches = pdfString.match(streamRegex) || [];
      
      for (const stream of streamMatches) {
        // Remove stream markers
        const content = stream.replace(/^stream\s*|\s*endstream$/g, '');
        
        // Try to find readable text in the stream
        const readableText = content.match(/[A-Za-z0-9\s.,!?;:'"()-]{10,}/g);
        if (readableText) {
          extractedText += readableText.join(' ') + ' ';
        }
      }
    }
    
    // Clean up the extracted text
    const cleanText = extractedText
      .replace(/\s+/g, ' ')
      .replace(/[^\x20-\x7E\n\r\t]/g, '') // Keep only printable ASCII
      .trim();
    
    return {
      text: cleanText || 'No readable text found using regex extraction',
      pages: 1,
      metadata: { 
        note: 'Advanced regex extraction - may miss some content',
        textObjectsFound: textMatches.length
      },
      method: 'advanced-regex'
    };
  } catch (error) {
    throw new Error(`Advanced regex extraction failed: ${error.message}`);
  }
}

// PDF extraction method 4: OCR with image conversion
async function extractWithOCR(buffer) {
  if (!Tesseract) throw new Error('tesseract.js not available');
  
  try {
    // First, try to convert PDF to images using canvas (if available in Node.js)
    // For now, let's try OCR directly on the PDF
    const base64 = buffer.toString('base64');
    
    console.log('Starting OCR processing...');
    
    const { data: { text } } = await Tesseract.recognize(
      `data:application/pdf;base64,${base64}`,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      }
    );
    
    return {
      text: text || 'No text recognized via OCR',
      pages: 1,
      metadata: { 
        ocrEngine: 'tesseract.js',
        language: 'eng',
        note: 'OCR extraction - may have errors but good for scanned PDFs'
      },
      method: 'OCR'
    };
  } catch (error) {
    throw new Error(`OCR failed: ${error.message}`);
  }
}

// Main PDF extraction with improved fallback
async function extractPdfWithFallback(buffer) {
  const methods = [
    { name: 'pdf-parse', func: extractWithPdfParse, priority: 1 },
    { name: 'pdfjs', func: extractWithPdfJs, priority: 2 },
    { name: 'advanced-regex', func: extractWithAdvancedRegex, priority: 3 },
    { name: 'OCR', func: extractWithOCR, priority: 4 }
  ];
  
  const errors = [];
  let bestResult = null;
  let bestScore = 0;
  
  for (const method of methods) {
    try {
      console.log(`Trying PDF extraction with ${method.name}...`);
      const result = await method.func(buffer);
      
      // Score the result based on text quality
      const textLength = result.text?.trim().length || 0;
      const hasReadableWords = /[a-zA-Z]{3,}/.test(result.text || '');
      const score = textLength + (hasReadableWords ? 1000 : 0);
      
      console.log(`${method.name}: ${textLength} chars, readable: ${hasReadableWords}, score: ${score}`);
      
      if (score > bestScore) {
        bestScore = score;
        bestResult = result;
      }
      
      // If we got good readable content, use it
      if (hasReadableWords && textLength > 50) {
        console.log(`✓ Successfully extracted PDF with ${method.name} (${textLength} characters)`);
        return result;
      }
      
    } catch (error) {
      console.warn(`✗ ${method.name} failed:`, error.message);
      errors.push({ method: method.name, error: error.message });
    }
  }
  
  // Return the best result we got, even if not perfect
  if (bestResult && bestScore > 0) {
    console.log(`Using best available result from ${bestResult.method}`);
    return bestResult;
  }
  
  // If all methods failed completely
  return {
    text: 'PDF processing failed with all methods. This may be a password-protected PDF, heavily encrypted, or corrupted file.',
    pages: 1,
    metadata: {
      errors: errors,
      note: 'All extraction methods failed',
      suggestions: [
        'Try converting the PDF to images and using OCR',
        'Check if the PDF is password protected',
        'Verify the PDF file is not corrupted',
        'Try saving/exporting the PDF from another application'
      ]
    },
    method: 'failed'
  };
}

// Helper functions remain the same...
function extractTextFromXML(obj) {
  let text = '';
  
  if (typeof obj === 'string') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    for (const item of obj) {
      text += extractTextFromXML(item) + ' ';
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (key !== '$' && obj.hasOwnProperty(key)) {
        text += extractTextFromXML(obj[key]) + ' ';
      }
    }
  }
  
  return text.trim();
}

function extractTextFromJSON(obj, depth = 0) {
  if (depth > 10) return '';
  
  let text = '';
  
  if (typeof obj === 'string') {
    return obj + ' ';
  }
  
  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj.toString() + ' ';
  }
  
  if (Array.isArray(obj)) {
    for (const item of obj) {
      text += extractTextFromJSON(item, depth + 1);
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        text += key + ': ' + extractTextFromJSON(obj[key], depth + 1);
      }
    }
  }
  
  return text;
}

export async function POST(request) {
  try {
    // Initialize dependencies
    await initializeDependencies();
    
    const formData = await request.formData();
    const file = formData.get('document');
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    console.log(`Processing ${fileExtension} file: ${file.name} (${buffer.length} bytes)`);
    
    let extractedData = {
      text: '',
      pages: 0,
      fileType: fileExtension,
      fileName: file.name,
      metadata: {}
    };
    
    switch (fileExtension) {
      case 'pdf':
        const pdfResult = await extractPdfWithFallback(buffer);
        extractedData.text = pdfResult.text;
        extractedData.pages = pdfResult.pages;
        extractedData.metadata = {
          ...pdfResult.metadata,
          extractionMethod: pdfResult.method
        };
        break;
        
      case 'docx':
        if (!mammoth) {
          return NextResponse.json({ error: 'DOCX parsing not available' }, { status: 500 });
        }
        try {
          const docxResult = await mammoth.extractRawText({ buffer });
          extractedData.text = docxResult.value;
          extractedData.pages = Math.ceil(docxResult.value.length / 3000);
          extractedData.metadata = { messages: docxResult.messages };
        } catch (error) {
          console.error('DOCX parsing error:', error);
          return NextResponse.json({ error: 'Failed to parse DOCX file' }, { status: 500 });
        }
        break;
        
      case 'doc':
        if (!mammoth) {
          return NextResponse.json({ error: 'DOC parsing not available' }, { status: 500 });
        }
        try {
          const docResult = await mammoth.extractRawText({ buffer });
          extractedData.text = docResult.value;
          extractedData.pages = Math.ceil(docResult.value.length / 3000);
          extractedData.metadata = { 
            messages: docResult.messages,
            note: 'Legacy .doc format - extraction may be limited'
          };
        } catch (error) {
          extractedData.text = 'Unable to extract text from .doc file. Please convert to .docx format.';
          extractedData.metadata = { error: error.message };
        }
        break;
        
      case 'xlsx':
      case 'xls':
        if (!XLSX) {
          return NextResponse.json({ error: 'Excel parsing not available' }, { status: 500 });
        }
        try {
          const workbook = XLSX.read(buffer, { type: 'buffer' });
          let xlsxText = '';
          let totalCells = 0;
          
          workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });
            
            xlsxText += `\n--- Sheet: ${sheetName} ---\n`;
            sheetData.forEach((row, rowIndex) => {
              if (row.length > 0) {
                xlsxText += `Row ${rowIndex + 1}: ${row.join(' | ')}\n`;
                totalCells += row.length;
              }
            });
          });
          
          extractedData.text = xlsxText;
          extractedData.pages = workbook.SheetNames.length;
          extractedData.metadata = {
            sheets: workbook.SheetNames,
            totalCells: totalCells
          };
        } catch (error) {
          console.error('Excel parsing error:', error);
          return NextResponse.json({ error: 'Failed to parse Excel file' }, { status: 500 });
        }
        break;
        
      case 'csv':
        const csvText = buffer.toString('utf-8');
        const csvLines = csvText.split('\n');
        let formattedCsv = '';
        
        csvLines.forEach((line, index) => {
          if (line.trim()) {
            formattedCsv += `Row ${index + 1}: ${line}\n`;
          }
        });
        
        extractedData.text = formattedCsv;
        extractedData.pages = 1;
        extractedData.metadata = {
          totalRows: csvLines.filter(line => line.trim()).length,
          estimatedColumns: csvLines[0] ? csvLines[0].split(',').length : 0
        };
        break;
        
      case 'txt':
        extractedData.text = buffer.toString('utf-8');
        extractedData.pages = Math.ceil(extractedData.text.length / 3000);
        extractedData.metadata = {
          encoding: 'utf-8',
          characterCount: extractedData.text.length
        };
        break;
        
      case 'rtf':
        const rtfText = buffer.toString('utf-8');
        const cleanText = rtfText
          .replace(/\\[a-z]+\d*\s?/g, '')
          .replace(/[{}]/g, '')
          .replace(/\\\\/g, '\\')
          .replace(/\s+/g, ' ')
          .trim();
        
        extractedData.text = cleanText;
        extractedData.pages = Math.ceil(cleanText.length / 3000);
        extractedData.metadata = {
          note: 'Basic RTF parsing - formatting removed'
        };
        break;
        
      case 'xml':
        const xmlText = buffer.toString('utf-8');
        try {
          if (parseString) {
            const xmlResult = await parseString(xmlText);
            extractedData.text = extractTextFromXML(xmlResult);
            extractedData.pages = 1;
            extractedData.metadata = {
              rootElement: Object.keys(xmlResult)[0],
              note: 'XML structure flattened to text'
            };
          } else {
            extractedData.text = xmlText;
            extractedData.metadata = { note: 'XML parser not available, showing raw content' };
          }
        } catch (error) {
          extractedData.text = xmlText;
          extractedData.metadata = { 
            error: 'XML parsing failed, showing raw content',
            parseError: error.message 
          };
        }
        break;
        
      case 'json':
        try {
          const jsonText = buffer.toString('utf-8');
          const jsonObj = JSON.parse(jsonText);
          extractedData.text = extractTextFromJSON(jsonObj);
          extractedData.pages = 1;
          extractedData.metadata = {
            objectKeys: Object.keys(jsonObj),
            note: 'JSON structure flattened to text'
          };
        } catch (error) {
          extractedData.text = buffer.toString('utf-8');
          extractedData.metadata = { 
            error: 'JSON parsing failed, showing raw content',
            parseError: error.message 
          };
        }
        break;
        
      case 'html':
      case 'htm':
        const htmlText = buffer.toString('utf-8');
        const cleanHtml = htmlText
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\s+/g, ' ')
          .trim();
        
        extractedData.text = cleanHtml;
        extractedData.pages = Math.ceil(cleanHtml.length / 3000);
        extractedData.metadata = {
          note: 'HTML tags removed, basic text extraction'
        };
        break;
        
      case 'md':
      case 'markdown':
        const markdownText = buffer.toString('utf-8');
        const cleanMarkdown = markdownText
          .replace(/!\[.*?\]\(.*?\)/g, '[Image]')
          .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
          .replace(/^#{1,6}\s+/gm, '')
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          .replace(/`(.*?)`/g, '$1')
          .replace(/```[\s\S]*?```/g, '[Code Block]')
          .trim();
        
        extractedData.text = cleanMarkdown;
        extractedData.pages = Math.ceil(cleanMarkdown.length / 3000);
        extractedData.metadata = {
          note: 'Markdown formatting partially preserved'
        };
        break;
        
      default:
        try {
          extractedData.text = buffer.toString('utf-8');
          extractedData.pages = Math.ceil(extractedData.text.length / 3000);
          extractedData.metadata = {
            note: `Unknown file type '${fileExtension}' - treated as plain text`
          };
        } catch (error) {
          return NextResponse.json({
            error: `Unsupported file type: ${fileExtension}`,
            supportedTypes: ['pdf', 'docx', 'doc', 'xlsx', 'xls', 'csv', 'txt', 'rtf', 'xml', 'json', 'html', 'htm', 'md', 'markdown']
          }, { status: 400 });
        }
    }
    
    extractedData.metadata.fileSize = buffer.length;
    extractedData.metadata.processedAt = new Date().toISOString();
    extractedData.metadata.textLength = extractedData.text.length;
    
    console.log(`Successfully processed ${fileExtension} file: ${extractedData.text.length} characters extracted`);
    
    return NextResponse.json(extractedData);
    
  } catch (error) {
    console.error('Document extraction error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to extract document content',
        details: error.message 
      },
      { status: 500 }
    );
  }
}