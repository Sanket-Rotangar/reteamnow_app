import { google } from 'googleapis';
import config from '../config/gemini_config.js';
import { parsePdfBuffer } from '../utils/pdf-parser.js';
import { parseDocxBuffer } from '../utils/docx-parser.js';

// Create auth and drive instances with better error handling
let auth, drive, docs;

const initializeGoogleServices = async () => {
  try {
    console.log('🔧 Initializing Google Drive services...');
    console.log('🔧 Key file path:', config.google.keyFilePath);
    
    auth = new google.auth.GoogleAuth({
      keyFile: config.google.keyFilePath,
      scopes: [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/documents.readonly',
      ],
    });
    
    // Test authentication by getting the client
    const authClient = await auth.getClient();
    console.log('✅ Authentication client created successfully');
    
    drive = google.drive({ version: 'v3', auth });
    docs = google.docs({ version: 'v1', auth });
    
    console.log('✅ Google Drive services initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Google Drive services:', error.message);
    console.error('❌ Full error:', error);
    return false;
  }
};

const extractTextFromGoogleDoc = (doc) => {
  let text = '';
  doc.body.content.forEach(element => {
    if (element.paragraph) {
      element.paragraph.elements.forEach(elem => {
        if (elem.textRun) text += elem.textRun.content;
      });
    }
  });
  return text;
};

export const extractTextFromFiles = async (fileNames) => {
  // Initialize services if needed
  if (!drive || !docs) {
    console.log('🔄 Initializing Google Drive services...');
    const initialized = await initializeGoogleServices();
    if (!initialized) {
      throw new Error('Failed to initialize Google Drive services - check service account key file');
    }
  }

  let fileContent = '';
  for (const fileName of fileNames) {
    try {
      console.log(`🔍 Searching for file: ${fileName}`);
      const driveRes = await drive.files.list({
        q: `name='${fileName.trim()}' and (mimeType='application/vnd.google-apps.document' or mimeType='application/pdf' or mimeType='application/vnd.openxmlformats-officedocument.wordprocessingml.document') and trashed=false`,
        fields: 'files(id, name, mimeType)',
        pageSize: 1
      });

      const file = driveRes.data.files[0];
      if (!file) {
        console.log(`⚠️ File not found: ${fileName}`);
        continue;
      }

      console.log(`✅ Found file: ${file.name} (${file.mimeType})`);
      
      // Process the file content
      let extractedText = '';

      if (file.mimeType === 'application/vnd.google-apps.document') {
        console.log(`📄 Processing Google Doc: ${file.name}`);
        const docRes = await docs.documents.get({ documentId: file.id });
        extractedText = extractTextFromGoogleDoc(docRes.data);
      } else if (file.mimeType === 'application/pdf') {
        console.log(`📑 Processing PDF: ${file.name}`);
        const pdfRes = await drive.files.get({ fileId: file.id, alt: 'media' }, { responseType: 'arraybuffer' });
        extractedText = (await parsePdfBuffer(Buffer.from(pdfRes.data))).text;
      } else if (file.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        console.log(`📝 Processing DOCX: ${file.name}`);
        const docxRes = await drive.files.get({ fileId: file.id, alt: 'media' }, { responseType: 'arraybuffer' });
        extractedText = (await parseDocxBuffer(Buffer.from(docxRes.data))).text;
      }
      
      if (extractedText.trim()) {
        fileContent += `\n\n--- Content from ${file.name} ---\n` + extractedText;
        console.log(`✅ Successfully extracted ${extractedText.length} characters from ${file.name}`);
      } else {
        console.log(`⚠️ No text content extracted from ${file.name}`);
      }
      
    } catch (error) {
      console.error(`❌ Error accessing file ${fileName}:`, error.message);
      // If it's an auth error, provide helpful message
      if (error.message.includes('invalid_grant') || error.message.includes('JWT')) {
        throw new Error(`Google Drive authentication failed: ${error.message}. Please check your service account credentials.`);
      }
      throw error;
    }
  }
  return fileContent;
};