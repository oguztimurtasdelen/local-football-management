const express = require('express');
const multer = require('multer');

const staffizmiraskfController = require('../../controllers/application/staffizmiraskf');

const extractTeamLogo = require('../../middlewares/extract-team-logo');

const router = express.Router();


router.get("", staffizmiraskfController.getStaffList);

module.exports = router;