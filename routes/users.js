const { json } = require('body-parser');
const passport = require('passport');
var express = require('express');
var router = express.Router();

const banco = require('../dbase');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var teste = new banco;
  teste.Consultar('SELECT * FROM USUARIOS',res);
});

router.post('/',
    passport.authenticate('local', { 
        successRedirect: '/', 
        failureRedirect: '/login?fail=true' 
    })
);

module.exports = router;
