const express = require("express");

const controller  = require('../controllers/tickets');
const { route } = require("./ticket");

console.log('Get tickets:', controller)

const router = express.Router();


router.post("/", controller.createdTicket)

module.exports = router;