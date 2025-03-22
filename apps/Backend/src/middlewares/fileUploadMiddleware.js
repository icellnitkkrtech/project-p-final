import apiResponse from '../utils/apiResponse.js';

export const handleFileUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json(
                new apiResponse(400, null, 'File size too large. Maximum size is 5MB')
            );
        }
        return res.status(400).json(
            new apiResponse(400, null, err.message)
        );
    }
    
    if (err) {
        return res.status(400).json(
            new apiResponse(400, null, err.message)
        );
    }
    
    next();
};