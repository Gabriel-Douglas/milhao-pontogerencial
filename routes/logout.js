const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', function (req, res){
    req.session.destroy(function (err) {
        try {
            console.log('LOGOUT')
            req.logout();
            res.redirect('/');
        } catch (error) {
            console.log('LOGOUT FALHOU...: ',error)
        }
    });

  });

module.exports = router;
