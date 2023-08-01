const express = require('express');
const multer = require('multer');

const documentsController = require('../../controllers/application/documents');

const extractImage = require('../../middlewares/extract-image');

const router = express.Router();


router.get("/:category", documentsController.getDocuments);



module.exports = router;