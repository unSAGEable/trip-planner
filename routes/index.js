var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
	var results = {};
	models.Hotel.find().exec()
	.then(function(hotels) {
		results['hotels'] = hotels;
		return models.Restaurant.find().exec()
	})
	.then(function(restaurants) {
		results['restaurants'] = restaurants;
		return models.ThingToDo.find().exec()
	})
	.then(function(things) {
		results['things'] = things;
		console.log(results);
 	 	res.render('index', { results: results });
	})
});

module.exports = router;
