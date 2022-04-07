const express = require("express");

const controller  = require('../controllers/screen');
const { route } = require("./screens");

console.log('create screen:', controller)

const router = express.Router();

router.post("/", controller.createScreen)

module.exports = router;