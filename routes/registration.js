var express = require('express');
var router = express.Router();
const banco = require('../dbase.js');

/* GET home page. */
router.get('/', function(req, res, next) {

    if (!req.user.ADMINISTRADOR){
      res.render('acessoNegado');
    } 

    banco.Consultar("SELECT F.MATRICULA, F.NOME, F.ID_CARGO, C.NOME AS CARGO, F.ID_CDC, F.ID_DEPARTAMENTO, D.NOME AS DEPARTAMENTO, F.SALARIO, F.CPF_APONTADOR, U.NOME AS APONTADOR, F.PERICULOSIDADE, F.INSALUBRIDADE, IIF(F.STATUS = 1,'ATIVO','BLOQUEADO') AS STATUS " + 
                    "FROM FUNCIONARIOS F LEFT JOIN CARGOS C ON F.ID_CARGO = C.ID LEFT JOIN DEPARTAMENTOS D ON F.ID_DEPARTAMENTO = D.ID LEFT JOIN USUARIOS U ON F.CPF_APONTADOR = U.CPF",
                    function(funcs){

                      try {
                        banco.Consultar("SELECT A.ID, R.NOME, R.FUNCAO, R.GRUPO, A.USUARIO, R.STATUS " +
                                        "FROM ACESSO_RELATORIOS A LEFT JOIN RELATORIOS R ON A.ID_RELATORIO = R.ID " +
                                        "WHERE A.USUARIO = '" + req.user.CPF + "'", function(rels){
                          try {
                                res.render('registration', {usuario: req.user.NOME,
                                                            relatorios: rels,
                                                            funcionarios: funcs,
                                                            adm: req.user.ADMINISTRADOR
                                });

                          } catch (error) {
                            console.log(error);
                          }
                        })
                      } catch (error) {
                        res.send("error")
                      }
    })
});

// router.post('/',
//     passport.authenticate('local', { 
//         successRedirect: '/', 
//         failureRedirect: '/login?fail=true' 
//     })
// );

module.exports = router;
