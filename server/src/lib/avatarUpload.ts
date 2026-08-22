import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

export const UPLOADS_DIR = path.join(__dirname, '../../data/uploads');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (_req, file, cb) => {
    const ext = EXTENSION_BY_MIME[file.mimetype] ?? path.extname(file.originalname);
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

export const avatarUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!(file.mimetype in EXTENSION_BY_MIME)) {
      cb(new Error('Only PNG, JPEG, GIF, or WEBP images are allowed'));
      return;
    }
    cb(null, true);
  },
});
