const mysql = require('mysql');

var mysqlConnection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Seattle-123',
	database: 'companyDB',
	multipleStatements: true
});

mysqlConnection.connect(err => {
	if (!err) {
		console.log('DB connection succedded!');
	}else {
		console.log('DB connect FAIL ', JSON.stringify(err));
	}
});

module.exports = mysqlConnection;