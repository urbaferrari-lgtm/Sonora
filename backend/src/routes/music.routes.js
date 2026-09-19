const  express = require('express');
const musicController = require("../controllers/music.controller")
const multer = require("multer");
const authMiddleware = require("../middlewares/auth.middleware")

const upload = multer({
    storage:multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith('audio/')) return callback(null, true);
        return callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'music'));
    },
})

const router= express.Router();
router.post("/upload",authMiddleware.authArtist,upload.single("music"), musicController.createMusic)

router.post("/album",authMiddleware.authArtist,  musicController.createAlbum)

router.get("/",authMiddleware.authUser,musicController.getAllMusics)

router.get("/album", authMiddleware.authUser, musicController.getAllAlbum)

router.get("/album/:albumId", authMiddleware.authUser,musicController.getAlbumById)

module.exports= router