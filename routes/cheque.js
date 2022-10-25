var express = require('express');
var router = express.Router();
const banco = require('../dbase.js');
const loadData = require('../loadData.js');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('cheque');
// });

//JSON PARA RESGATAR AS MARCACOES DE TODOS FUNCIONÁRIOS
router.get('/:dtInicial/:dtFinal', function (req, res){

  banco.Consultar("SELECT U.CPF_USUARIO, U.ID_NIVEL, A.NIVEL FROM NIVEL_USUARIO U INNER JOIN NIVEIS_ACESSO A ON U.ID_NIVEL = A.ID WHERE CPF_USUARIO = '" + req.user.CPF + "'",function(nivel){
  
    try {
      if(nivel[0].NIVEL === 'FULL'){
        loadData.loadMarcacoesFuncionarios(req.user.CPF,
                                          req.params.dtInicial,
                                          req.params.dtFinal,
                                          true,
                                          function(pontos){
          try {

            var d = new Date(req.params.dtFinal);
            var anoC = d.getFullYear();
            var mesC = d.getMonth();
            
            var d2 = new Date (anoC, mesC+1, 0);

            var ParamDataInicial = req.params.dtFinal.split("-")[0] + '-' + req.params.dtFinal.split("-")[1] + '-01'
            var ParamDataFinal = req.params.dtFinal.split("-")[0] + '-' + req.params.dtFinal.split("-")[1] + '-' + d2.getDate().toString()

            console.log('DATA INICIAL...: ' + ParamDataInicial + "  |  DATA FINAL...: " + ParamDataFinal);
              
            loadData.diasUteisMilhao(ParamDataInicial.toString(), ParamDataFinal.toString()).then(dias => {

              var DataInicial = new Date(req.params.dtInicial.split("-")[0],req.params.dtInicial.split("-")[1],1);
              var DataFinal = new Date(req.params.dtFinal.split("-")[0],req.params.dtFinal.split("-")[1],0);
              var DiasInuteis = DataFinal.getDate() - dias[0].diasDSR;

              console.log('DATA INICIAL...: ' + DataInicial.toLocaleDateString() + "  |  DATA FINAL...: " + DataFinal.toLocaleDateString());
              console.log('DIAS ÚTEIS.......: ' + dias[0].diasDSR);
              console.log('DIAS INUTEIS.......: ' + DiasInuteis);

              res.render('cheque', {
                marcacoes: pontos,
                diasUteis: dias[0].diasDSR,
                diasInuteis: DiasInuteis
              });
            })

          } catch (error) {
            res.send(error);
          }
        })
      } else{
        loadData.loadMarcacoesFuncionarios(req.user.CPF,
                                          req.params.dtInicial,
                                          req.params.dtFinal,
                                          false,
                                          function(pontos){
          try {
            res.render('cheque', {
              marcacoes: pontos
          });

          } catch (error) {
            res.send(error);
          }
        })
      }
    } catch (error) {
      re.send(error);
    }
    
  });

});

// router.post('/',
//     passport.authenticate('local', { 
//         successRedirect: '/', 
//         failureRedirect: '/login?fail=true' 
//     })
// );

module.exports = router;
