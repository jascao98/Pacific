var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', {msg: "Thank you for visiting Pacific. You're purchase has been processed."});
});

module.exports = router;