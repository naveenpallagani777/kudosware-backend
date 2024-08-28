const express = require('express');
const Authentication = require('../Controllers/Authentication');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let router = express.Router();

router.post('/api/signup', upload.single('resume'), Authentication.SignUp);
router.post('/api/login', Authentication.Login);

module.exports = router;
