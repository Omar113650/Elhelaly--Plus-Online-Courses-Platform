import multer from "multer";


const fileFilter = function (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const allowedTypes = ["video/mp4", "video/mkv", "video/avi"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed"));
  }
};

// التخزين في الرام
const storage = multer.memoryStorage();

const uploadVideo = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

export default uploadVideo;
