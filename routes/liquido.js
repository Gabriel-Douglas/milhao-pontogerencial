var express = require('express');
var router = express.Router();
const banco = require('../dbase.js');
const loadData = require('../loadData.js');

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
              
            loadData.diasUteisMilhao(req.params.dtInicial, req.params.dtFinal).then(dias => {

              // var DataInicial = new Date(req.params.dtInicial.split("-")[0],req.params.dtInicial.split("-")[1]-1,req.params.dtInicial.split("-")[2]);
              // var DataFinal = new Date(req.params.dtFinal.split("-")[0],req.params.dtFinal.split("-")[1]-1,req.params.dtFinal.split("-")[2]);

              var DataInicial = new Date(req.params.dtInicial.split("-")[0],req.params.dtInicial.split("-")[1],1);
              var DataFinal = new Date(req.params.dtFinal.split("-")[0],req.params.dtFinal.split("-")[1],0);
              
              // var TempoInutil = DataFinal.getTime() - DataInicial.getTime();
              var DiasInuteis = DataFinal.getDate() - dias[0].diasDSR;

              console.log('DATA INICIAL...: ' + DataInicial.toLocaleDateString() + "  |  DATA FINAL...: " + DataFinal.toLocaleDateString());
              console.log('DIAS INUTEIS.......: ' + DiasInuteis);

              res.render('liquido', {
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
            res.render('liquido', {
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
