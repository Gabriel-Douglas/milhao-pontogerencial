var express = require('express');
var router = express.Router();
const banco = require('../dbase.js');
const loadData = require('../loadData.js');

/* GET home page. */

router.get('/', function(req, res, next) {

  var UserAdm = false
  if (req.user.ADMINISTRADOR) UserAdm = true

  var condicao = " WHERE CPF_APONTADOR = '" + req.user.CPF + "' "
  if(UserAdm) condicao = ""


  const Relatorios = new Promise((resolve, reject) => {

    banco.Consultar("SELECT A.ID, R.NOME, R.FUNCAO, R.GRUPO, A.USUARIO, R.STATUS " +
                    "FROM ACESSO_RELATORIOS A LEFT JOIN RELATORIOS R ON A.ID_RELATORIO = R.ID " +
                    "WHERE A.USUARIO = '" + req.user.CPF + "'", function(rels){
      try {
          resolve(rels);
      } catch (error) {
          reject(error)
      }
      
    })
  });

  const Cargos = new Promise((resolve, reject) => {

    banco.Consultar("SELECT DISTINCT CARGO FROM VIEW_CADASTRO_FUNCIONARIOS " + condicao + " ORDER BY CARGO",  function(bdCargos){
      try {
          resolve(bdCargos);
      } catch (error) {
          reject(error)
      }
      
    })
  });

  const Departamentos = new Promise((resolve, reject) => {

    banco.Consultar("SELECT DISTINCT DEPARTAMENTO FROM VIEW_CADASTRO_FUNCIONARIOS " + condicao + " ORDER BY DEPARTAMENTO", function(bdDepartamentos){
      try {
          resolve(bdDepartamentos);
      } catch (error) {
          reject(error)
      }
      
    })
  });


  const Gerentes = new Promise((resolve, reject) => {

    
    if(!UserAdm){
      var stringConsulta = "SELECT DISTINCT CPF_APONTADOR, APONTADOR FROM VIEW_CADASTRO_FUNCIONARIOS WHERE CPF_APONTADOR = '" + req.user.CPF + "' ORDER BY APONTADOR"
    } else{
      var stringConsulta = "SELECT DISTINCT CPF_APONTADOR, APONTADOR FROM VIEW_CADASTRO_FUNCIONARIOS ORDER BY APONTADOR"
    }

    banco.Consultar(stringConsulta, function(bdGerentes){
      try {
          resolve(bdGerentes);
      } catch (error) {
          reject(error)
      }
      
    })
  });


  Promise.all([Relatorios, Cargos, Departamentos, Gerentes])
  .then((values) => {
  
    res.render('dashboard', {usuario: req.user.NOME,
                             relatorios: values[0],
                             cargos: values[1],
                             departamentos: values[2],
                             gerentes: values[3],
                             adm: req.user.ADMINISTRADOR
                            });
   });

});

router.get('/graficoHorasDia/:dataInicial/:dataFinal/:gerente', function(req, res, next) {

  var UserAdm = false
  if (req.user.ADMINISTRADOR) UserAdm = true

  loadData.AcumuladoHorasDia(req.params.dataInicial,req.params.dataFinal,req.params.gerente,req.user.CPF,UserAdm)
    .then(result => {
      try {
        res.json(result)
      } catch (error) {
        res.send(error)
      }

    })

});

router.get('/graficoHorasDepartamento/:dataInicial/:dataFinal/:gerente', function(req, res, next) {

  var UserAdm = false
  if (req.user.ADMINISTRADOR) UserAdm = true

  loadData.HorasDepartamento(req.params.dataInicial,req.params.dataFinal,req.params.gerente,UserAdm)
    .then(result => {
      try {
        res.json(result)
      } catch (error) {
        res.send(error)
      }

    })

});

router.get('/graficoHorasFuncionario/:dataInicial/:dataFinal/:gerente', function(req, res, next) {

  var UserAdm = false
  if (req.user.ADMINISTRADOR) UserAdm = true

  loadData.HorasFuncionario(req.params.dataInicial,req.params.dataFinal,req.params.gerente,UserAdm)
    .then(result => {
      try {
        res.json(result)
      } catch (error) {
        res.send(error)
      }

    })

});

router.get('/graficoHorasCargo/:dataInicial/:dataFinal/:gerente', function(req, res, next) {

  var UserAdm = false
  if (req.user.ADMINISTRADOR) UserAdm = true

  loadData.HorasCargo(req.params.dataInicial,req.params.dataFinal,req.params.gerente,UserAdm)
    .then(result => {
      try {
        res.json(result)
      } catch (error) {
        res.send(error)
      }

    })

});

router.get('/cards/:dataInicial/:dataFinal/:gerente', function(req, res, next) {

  var UserAdm = false
  if (req.user.ADMINISTRADOR) UserAdm = true

  var condicao = " AND F.CPF_APONTADOR = '" + req.params.gerente + "' "
  if(req.params.gerente == 'todos' && UserAdm) condicao = ""


  const HoraExtra = new Promise((resolve, reject) => {
    banco.Consultar("SELECT SUM(M.TOTAL) AS TOTAL_HORAS " +
                    "FROM VIEW_MARCACOES_BRL M LEFT JOIN FUNCIONARIOS F ON M.MATRICULA_FUNC = F.MATRICULA " +
                    "WHERE DATA >= '" + req.params.dataInicial + "' AND DATA <= '" + req.params.dataFinal + "'" + condicao, 
    function(hrx){
      try {
          resolve(hrx);
      } catch (error) {
          reject(error)
      }
    })

  });

  const ValorHoraExtra = new Promise((resolve, reject) => {
    banco.Consultar("SELECT SUM(M.BRL_HEX1 + M.BRL_HEX2 + M.BRL_HEXN1 + M.BRL_HEXN2) AS VLR_HORAS " +
                    "FROM VIEW_MARCACOES_BRL M LEFT JOIN FUNCIONARIOS F ON M.MATRICULA_FUNC = F.MATRICULA " +
                    "WHERE DATA >= '" + req.params.dataInicial + "' AND DATA <= '" + req.params.dataFinal + "'" + condicao, 
    function(hrx){
      try {
          resolve(hrx);
      } catch (error) {
          reject(error)
      }
    })
  });

  
  const DiasRestantes = new Promise((resolve, reject) => {

    banco.Consultar("SELECT dbo.FN_DIASUTEISMILHAO('" + req.params.dataInicial + "','" + req.params.dataFinal + "') AS DIAS_PONTO",function(dias){
      try {

          var DataInicial = new Date();
          var DataFinal = new Date(req.params.dataFinal.split("-")[0],req.params.dataFinal.split("-")[1]-1,req.params.dataFinal.split("-")[2]);
          
          var TempoInutil = DataFinal.getTime() - DataInicial.getTime();

          var DiasRestantes = Math.round(TempoInutil/(1000*60*60*24)) + 1
          if(DataInicial > DataFinal) DiasRestantes = 0

          resolve(DiasRestantes);
      } catch (error) {
          reject(error)
      }
      
    })
  });

  Promise.all([HoraExtra, ValorHoraExtra, DiasRestantes])
          .then((values) => {
          
            cardsValues = {horas: values[0][0].TOTAL_HORAS,
                           valor: values[1][0].VLR_HORAS,
                           dias: values[2]}

            console.log(cardsValues);

            return res.json(cardsValues);
  });


});

router.get('/ranking/:dataInicial/:dataFinal/:gerente', function(req, res, next) {

  var UserAdm = false
  if (req.user.ADMINISTRADOR) UserAdm = true

  var condicao = " AND F.CPF_APONTADOR = '" + req.params.gerente + "' "
  if(req.params.gerente == 'todos' && UserAdm) condicao = ""

  banco.Consultar("SELECT TOP 10 ROW_NUMBER() OVER(ORDER BY SUM(M.TOTAL) DESC) AS #, F.NOME, F.CARGO, F.CDC, F.DEPARTAMENTO, ROUND(SUM(M.TOTAL)/60,1) AS TOTAL " +
                  "FROM VIEW_MARCACOES_BRL M LEFT JOIN VIEW_CADASTRO_FUNCIONARIOS F ON M.MATRICULA_FUNC = F.MATRICULA " +
                  "WHERE DATA >= '" + req.params.dataInicial + "' AND DATA <= '" + req.params.dataFinal + "'" + condicao +
                  "GROUP BY F.NOME, F.CARGO, F.CDC, F.DEPARTAMENTO", function(ranking){
    try {
      res.send(ranking);
    } catch (error) {
      console.log(error);
    }
  })

});



///----FILTROS----//////----FILTROS----//////----FILTROS----//////----FILTROS----//////----FILTROS----//////----FILTROS----//////----FILTROS----///
///----FILTROS----//////----FILTROS----//////----FILTROS----//////----FILTROS----//////----FILTROS----//////----FILTROS----//////----FILTROS----///
///----FILTROS----//////----FILTROS----//////----FILTROS----//////----FILTROS----//////----FILTROS----//////----FILTROS----//////----FILTROS----///

router.get('/cargosdepartamento/:departamento',function(req,res,next){

  var UserAdm = false
  if (req.user.ADMINISTRADOR) UserAdm = true

  var sqlString = "SELECT DISTINCT CARGO FROM VIEW_CADASTRO_FUNCIONARIOS WHERE DEPARTAMENTO = '" + req.params.departamento + "' AND CPF_APONTADOR = '" + req.user.CPF + "'"
  if(UserAdm) sqlString = "SELECT DISTINCT CARGO FROM VIEW_CADASTRO_FUNCIONARIOS WHERE DEPARTAMENTO = '" + req.params.departamento + "'"
  if(req.params.departamento === 'TODOS') sqlString = "SELECT DISTINCT CARGO FROM VIEW_CADASTRO_FUNCIONARIOS WHERE CPF_APONTADOR = '" + req.user.CPF + "'"
  if(req.params.departamento === 'TODOS' && UserAdm) sqlString = "SELECT DISTINCT CARGO FROM VIEW_CADASTRO_FUNCIONARIOS"

  sqlString = "SELECT 'TODOS' AS CARGO UNION ALL " + sqlString

  banco.Consultar(sqlString, function(cargos){
    try {
      res.send(cargos)
    } catch (error) {
      console.log(error)
      res.send(error)
    }
  });

});

router.get('/gerentedepartamento/:departamento',function(req,res,next){

  var UserAdm = false
  if (req.user.ADMINISTRADOR) UserAdm = true

  var sqlString = "SELECT DISTINCT APONTADOR FROM VIEW_CADASTRO_FUNCIONARIOS WHERE DEPARTAMENTO = '" + req.params.departamento + "' AND CPF_APONTADOR = '" + req.user.CPF + "'"
  if(UserAdm) sqlString = "SELECT DISTINCT APONTADOR FROM VIEW_CADASTRO_FUNCIONARIOS WHERE DEPARTAMENTO = '" + req.params.departamento + "'"
  if(req.params.departamento === 'TODOS') sqlString = "SELECT DISTINCT APONTADOR FROM VIEW_CADASTRO_FUNCIONARIOS WHERE CPF_APONTADOR = '" + req.user.CPF + "'"
  if(req.params.departamento === 'TODOS' && UserAdm) sqlString = "SELECT DISTINCT APONTADOR FROM VIEW_CADASTRO_FUNCIONARIOS"

  if(UserAdm) sqlString = "SELECT 'TODOS' AS APONTADOR UNION ALL " + sqlString

  banco.Consultar(sqlString, function(gerente){
    try {
      res.send(gerente)
    } catch (error) {
      console.log(error)
      res.send(error)
    }
  });

});

router.get('/departamentogerente/:gerente',function(req,res,next){

  var UserAdm = false
  if (req.user.ADMINISTRADOR) UserAdm = true

  var sqlString = "SELECT DISTINCT DEPARTAMENTO FROM VIEW_CADASTRO_FUNCIONARIOS WHERE APONTADOR = '" + req.params.gerente + "' AND CPF_APONTADOR = '" + req.user.CPF + "'"
  if(UserAdm) sqlString =  "SELECT DISTINCT DEPARTAMENTO FROM VIEW_CADASTRO_FUNCIONARIOS WHERE APONTADOR = '" + req.params.gerente + "'"
  if(req.params.gerente === 'TODOS') sqlString = "SELECT DISTINCT DEPARTAMENTO FROM VIEW_CADASTRO_FUNCIONARIOS WHERE CPF_APONTADOR = '" + req.user.CPF + "'"
  if(req.params.gerente === 'TODOS' && UserAdm) sqlString = "SELECT DISTINCT DEPARTAMENTO FROM VIEW_CADASTRO_FUNCIONARIOS"

  sqlString = "SELECT 'TODOS' AS DEPARTAMENTO UNION ALL " + sqlString

  banco.Consultar(sqlString, function(departamento){
    try {
      res.send(departamento)
    } catch (error) {
      console.log(error)
      res.send(error)
    }
  });

});


module.exports = router;
