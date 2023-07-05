const multer = require('multer');
const router = require("express").Router();


// configure storage 
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files');
    },
    filename: function (req, file, cb) {
        let filesplits = file.originalname.split(".")

        cb(null, filesplits[0] + '_' + Date.now()+"."+filesplits[1]);
    }
});

// upload limit 
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }
});

// upload route 
router.post("/", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        const url = `http://localhost:4000/${file.filename}`;

        return res.status(200).json({
            message: "file uploaded successfully",
            status: "success",
            fileUrl: url
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: "error"
        })
    }
})

module.exports = router;