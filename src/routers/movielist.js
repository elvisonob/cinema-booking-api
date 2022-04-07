const express = require("express");

const controller  = require('../controllers/movielists');
const { route } = require("./customer");

console.log('Get movies:', controller)

const router = express.Router();

router.get("/", controller.getAllMovies);
router.post("/", controller.createMovie)
router.get('/:id', controller.singularMovie)

module.exports = router;