import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create absolute path for uploads directory
// const uploadDir = path.resolve(process.cwd(), 'uploads', 'jobDescriptions');
const uploadDir = path.join('/tmp', 'uploads', 'jobDescriptions');
// Ensure upload directory exists
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('Created uploads directory at:', uploadDir);
    }
} catch (error) {
    console.error('Error creating uploads directory:', error);
    throw new Error('Failed to create uploads directory');
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Double-check directory exists before saving
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create a safe filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const safeFileName = `JD-${uniqueSuffix}${path.extname(file.originalname)}`;
        
        // Store full path in request object
        req.uploadedFilePath = path.join(uploadDir, safeFileName);
        
        // Log file details for debugging
        console.log('Saving file:', {
            originalName: file.originalname,
            savedAs: safeFileName,
            fullPath: req.uploadedFilePath
        });
        
        cb(null, safeFileName);
    }
});

// File filter with improved error messages
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type: ${file.mimetype}. Only PDF and DOC/DOCX files are allowed.`));
    }
};

// Create multer instance with configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Allow only 1 file per request
    }
});

export default upload;