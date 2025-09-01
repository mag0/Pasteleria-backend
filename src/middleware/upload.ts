import multer from 'multer';

const storage = multer.memoryStorage(); // guarda en memoria para subir a Cloudinary
export const upload = multer({ storage });
