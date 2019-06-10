const express = require('express');
var bodyparser = require('body-parser');
var router = express.Router();
var mysqlConnection = require('./mysqlConnection');

router.use(bodyparser.json());

// GET all skills
router.get('/', (req, res) => {
	mysqlConnection.query('SELECT * FROM skills', (err, rows, fields) => {
		if (!err){
			res.send(rows)
		}else {
			res.send(err)
		}
	});
});

// GET one skills
router.get('/:id', (req, res) => {
	mysqlConnection.query('SELECT * FROM skills WHERE skill_id = ' + [req.params.id], (err, rows, fields) => {
		if (!err){
			res.send(rows)
		}else {
			res.send(err)
		}
	});
});




module.exports = router