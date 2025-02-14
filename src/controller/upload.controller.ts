import { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

const UPLOAD_FOLDER = 'D:\\Resources';
//const UPLOAD_FOLDER = path.join(path.dirname(__dirname), 'uploads');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    //console.log('uploading folder: ', UPLOAD_FOLDER);
    //cb(null, 'src/resources/');
      cb(null, UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    console.log('File: ', file);
    // Generate unique filename with original extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter to allow only certain file types
const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF and PDF files are allowed.'));
  }
};

// Create multer upload instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Controller for handling file upload
export const handleFileUpload = async (req: Request, res: Response) => {
  try {

    //console.log('dirname:', path.join(path.dirname(__dirname), 'uploads'));

    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    const fileUrl = `/resources/${req.file.filename}`;
    
    return res.status(200).json({
      status: 'success',
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        url: fileUrl,
        mimetype: req.file.mimetype,
        size: req.file.size
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error uploading file',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Controller for handling file uploads
export const handleFileUploads = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    console.log('Inside handleFileUploads: ', files);

    if (!files || files.length === 0) {
      return res.status(400).json({ status: 'error', message: 'No files uploaded' });
    }

    const uploadedFiles = files.map(file => ({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size
    }));

    return res.status(200).json({
      status: 'success',
      message: 'Files uploaded successfully',
      data: uploadedFiles
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error uploading files',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
