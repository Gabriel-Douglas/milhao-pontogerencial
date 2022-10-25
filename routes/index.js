var express = require('express');
var router = express.Router();
const banco = require('../dbase.js');

/* GET home page. */
router.get('/', function(req, res, next) {

    banco.Consultar("SELECT A.ID, R.NOME, R.FUNCAO, R.GRUPO, A.USUARIO, R.STATUS " +
                    "FROM ACESSO_RELATORIOS A LEFT JOIN RELATORIOS R ON A.ID_RELATORIO = R.ID " +
                    "WHERE A.USUARIO = '" + req.user.CPF + "'", function(rels){
      try {
            res.render('index', {usuario: req.user.NOME,
                                 relatorios: rels,
                                 adm: req.user.ADMINISTRADOR
            });

      } catch (error) {
        console.log(error);
      }
    })
});

router.get('/manutencao', function(req, res, next) {
    res.render('manutencao')
});

module.exports = router;