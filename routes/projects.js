var express = require('express');
var router = express.Router();
var mysqlConnection = require('./mysqlConnection');

router.get('/', (req, res)=>{
	mysqlConnection.query('SELECT * FROM projects', (err, rows, fields) => {
		if (!err){
			res.send(rows);
		}else {
			res.send(err);
		}
	});
});

module.exports = router;