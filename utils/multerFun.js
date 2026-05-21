import multer from 'multer';
import AppError from './appError.js';

const multerWrapper = () => {
  const multerStorage = multer.memoryStorage();
  
  const multerFilter = (req, file, cb) => {
    if (
      file.mimetype.startsWith("application") ||
      file.mimetype.startsWith("image") ||
      file.mimetype.startsWith("video") ||
      file.mimetype.startsWith("audio")
    ) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          "Unsupported file type! Please upload only images, videos, audios, or application files.",
          400
        ),
        false
      );
    }
  };

  return multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { 
      fileSize: 50 * 1024 * 1024, // 50 MB limit (increased from 5 MB)
      files: 10, // Maximum 10 files
      fieldSize: 10 * 1024 * 1024, // 10 MB for field values
      fieldNameSize: 100, // Maximum field name size
      fields: 20 // Maximum number of non-file fields
    }
  });
};

export default multerWrapper;
