var express = require('express');
var router = express.Router();
var mysql = require('mysql');

function sqlConnect() {
	return mysql.createConnection({
		multipleStatements: true,
		host: 'localhost',
		user: 'root',
		password: 'password',
		database: 'PACIFIC'
	});
}

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('thankyou');
});

module.exports = router;
