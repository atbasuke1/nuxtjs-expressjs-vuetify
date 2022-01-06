const express = require('express')
const router = express.Router()
const AuthController = require('../Controllers/Auth.Controller')
const UploadController = require('../Controllers/Upload.Controller')
require('dotenv/config');
const cors = require('cors')
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/logout', AuthController.logout)
router.post('/upload', UploadController.uploadFiles);
router.get('/photos', UploadController.getListFiles);
router.get("/photos/:name", UploadController.download);
router.delete('/photos/:id', UploadController.deleteOne);
router.delete('/many/:id', UploadController.deleteMany);
module.exports = router;