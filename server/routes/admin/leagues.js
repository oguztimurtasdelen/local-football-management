const express = require('express');
const multer = require('multer');

const leaguesController = require('../../controllers/admin/leagues');

const checkAuth = require('../../middlewares/check-auth');
const extractImage = require('../../middlewares/extract-image');

const router = express.Router();


router.get("/:seasonid", checkAuth, leaguesController.getLeagues);

router.post("", checkAuth, leaguesController.createLeague);

router.put("/:id", checkAuth, leaguesController.updateLeague);

router.delete("/:id", checkAuth, leaguesController.deleteLeague);


module.exports = router;
