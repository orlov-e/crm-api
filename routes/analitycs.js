const express = require("express");
const router = express.Router();
const controller = require("../controllers/analitycs")

router.get("/overview", controller.overview)
router.get("/analytics", controller.analitycs)


module.exports = router;