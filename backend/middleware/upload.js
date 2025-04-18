const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../resume/");

if (!fs.existsSync(uploadDir)) 
{
    fs.mkdirSync(uploadDir, { recursive: true });
}

const formatDate = (timestamp) => 
{
    return new Date(timestamp).toString().slice(0, 24).replace(/:/g, "-");
};

const storage = multer.diskStorage(
{
    destination: (req, file, cb) => 
    {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => 
    {
        const timestamp = Date.now();
        const formattedDate = formatDate(timestamp); 
        const originalName = file.originalname.replace(/\s+/g, "_");
        const uniqueName = `${originalName}_${formattedDate}`;

        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => 
{
    if (file.mimetype === "application/pdf") 
    {
        cb(null, true);
    } 
    else 
    {
        cb(new Error("Only PDF files are allowed"), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 5* 1024*1024 }});

module.exports = upload;