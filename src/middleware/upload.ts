import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(__dirname, "..", "..", "public", "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/\s+/g, '-').toLowerCase();
        cb(null, `${base}-${Date.now()}${ext}`);
    }
});

export const upload = multer({ storage });