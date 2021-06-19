const express = require('express');
const multer = require('multer');

const Home = require('./models');
const uploadMiddleware = require('../../middleware/uploadImage');

const router = express.Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    Home.Banner.find((err, data) => {
        if (err) {
            res.send(err.message);
        } else {
            res.json({
                success: true,
                data: data
            });
        }
    });
});


router.post('/uploadPics', upload.single("profile"), uploadMiddleware.uploadBannerImage, (req, res) => {
    let obj = {
        userId: req.params.id,
        profilePics: req.file.originalname
    }
    let model = new Home.Banner(obj);
    model.save((err, banner) => {
        if (err) {
            res.send(err);
        } else {
            res.json('Banner upload successfully');
        }
    });
});

module.exports = router;