import multer from 'multer';
import createHttpError from 'http-errors';

const storage = multer.memoryStorage(); // Зберігає файл у пам'яті як Buffer

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Перевірка типу файлу: дозволяємо тільки зображення
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Дозволити завантаження
    } else {
      cb(
        createHttpError(
          400,
          'File type not supported. Only images are allowed.',
        ),
        false,
      ); // Відхилити завантаження
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // Обмеження розміру файлу до 5MB
  },
});

export default upload;
