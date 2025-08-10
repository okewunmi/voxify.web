// src/app/api/extract-image/route.js
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import tesseract from 'node-tesseract-ocr';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images');
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    const results = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        results.push({
          filename: file.name,
          error: 'File is not an image',
          success: false
        });
        continue;
      }

      let tempFilePath = null;

      try {
        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Process image with Sharp for better performance
        const processedImage = await sharp(buffer)
          .resize(2000, 2000, { 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .sharpen()
          .normalize()
          .png()
          .toBuffer();

        // Create temporary file for tesseract
        tempFilePath = join(tmpdir(), `ocr-${Date.now()}-${i}.png`);
        writeFileSync(tempFilePath, processedImage);

        // Perform OCR with node-tesseract-ocr
        const text = await tesseract.recognize(tempFilePath, {
          lang: 'eng',
          oem: 1,
          psm: 3,
        });

        results.push({
          filename: file.name,
          text: text.trim(),
          success: true
        });

      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        results.push({
          filename: file.name,
          error: 'Failed to process image',
          success: false
        });
      } finally {
        // Clean up temporary file
        if (tempFilePath) {
          try {
            unlinkSync(tempFilePath);
          } catch (cleanupError) {
            console.error('Failed to cleanup temp file:', cleanupError);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
      totalFiles: files.length,
      successfulExtractions: results.filter(r => r.success).length
    });

  } catch (error) {
    console.error('OCR API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}