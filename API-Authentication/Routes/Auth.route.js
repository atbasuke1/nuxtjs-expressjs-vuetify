const express = require('express')
const router = express.Router()
const AuthController = require('../Controllers/Auth.Controller')
const uploadController = require('../Controllers/upload')
var objectId = require('mongodb').ObjectID;
const dbConfig = require("../config/db");
const MongoClient = require("mongodb").MongoClient;
const url = dbConfig.url;
const mongoClient = new MongoClient(url);
require('dotenv/config');
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/logout', AuthController.logout)
router.post('/upload', uploadController.uploadFiles);
router.get('/photos', uploadController.getListFiles);
router.get("/photos/:name", uploadController.download);

router.delete('/photos/:id',uploadController.deleteOne);

router.delete('/many/:id', async (req, res) => {
  console.log("da vao delete many");
  const listIds = req.params.id;
  const test = listIds.split(',')
  console.log("manyid", test);
  mongoClient.connect();
  const images = mongoClient.db("Nuxt").collection("photos.files")
  try {
    await Promise.all(test.map(id => images.deleteOne({ _id: objectId(id) })))
    res.status(200).send({ message: " deleted successfully." })
  } catch (err) {
    res.status(500).send({ message: err })
  }
})
  module.exports = router;
