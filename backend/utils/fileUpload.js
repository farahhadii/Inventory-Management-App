const multer = require("multer");
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" || 
        file.mimetype === "image/webp"
    ) {
        cb(null, true); 
    } else {
        cb(new Error("Unsupported file format"), false); 
    }
}

const upload = multer({ storage, fileFilter });

const fileSizeFormatter = (bytes, decimal) => {
    if (bytes === 0) {
        return "0 Bytes";
    }
    const dm = decimal || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return (
        parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
    );
};

module.exports = { upload, fileSizeFormatter };
