var express = require('express');
const { DateTime } = require('mssql');
var router = express.Router();
const banco = require('../dbase.js');

router.get('/', function(req, res, next) {

    if (!req.user.ADMINISTRADOR){
      res.render('acessoNegado');
    } 

    const Relatorios = new Promise((resolve, reject) => {

      var sqlRelatorios = "SELECT A.ID, R.NOME, R.FUNCAO, R.GRUPO, A.USUARIO, R.STATUS " +
                          "FROM ACESSO_RELATORIOS A LEFT JOIN RELATORIOS R ON A.ID_RELATORIO = R.ID " +
                          "WHERE A.USUARIO = '" + req.user.CPF + "'"
      banco.Consultar(sqlRelatorios,function(rels){
        try {
          resolve(rels)
        } catch (error) {
          reject(error)
        }
      })
      
    });

    const Periculosidade = new Promise((resolve, reject) => {

      var sqlPericulosidade = "SELECT * FROM PERICULOSIDADE WHERE STATUS = 1"
      banco.Consultar(sqlPericulosidade,function(periculosidade){
        try {
          resolve(periculosidade)
        } catch (error) {
          resolve(error)
        }
      })

    });

    const Insalubriade = new Promise((resolve, reject) => {

      var sqlInsalubriade = "SELECT * FROM INSALUBRIDADE WHERE STATUS = 1"
      banco.Consultar(sqlInsalubriade,function(insalubridade){
        try {
          resolve(insalubridade)
        } catch (error) {
          reject(error)
        }
      })

    });

    const ValeTransporte = new Promise((resolve, reject) => {

      var sqlValeTransporte = "SELECT * FROM VALE_TRANSPORTE WHERE STATUS = 1"
      banco.Consultar(sqlValeTransporte,function(valetransporte){
        try {
          resolve(valetransporte)
        } catch (error) {
          reject(error)
        }
      })

    });

    Promise.all([Relatorios, Periculosidade,Insalubriade,ValeTransporte])
    .then((values) => {
    
      dadosPagina = {usuario: req.user.NOME,
                     relatorios: values[0],
                     peri: values[1][0],
                     insa: values[2][0],
                     vt: values[3][0],
                     adm: req.user.ADMINISTRADOR,
                     periculosidade: req.query.periculosidade,
                     insalubridade: req.query.insalubridade,
                     vale_transporte: req.query.vale_transporte}


      return res.render('beneficios',dadosPagina);
    });


  router.post('/SalvarPericulosidade', function(req, res) {

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    var sql= "UPDATE PERICULOSIDADE SET STATUS = 0"
    banco.Consultar(sql,function(update){
      try {
        console.log('Periculosidades Bloqueadas')
      } catch (error) {
        reject(error)
      }
    })

    sql= "INSERT INTO PERICULOSIDADE(PERCENTUAL, STATUS, DATA_CRIACAO, AUTOR_CRIACAO, DATA_MODIFICACAO, AUTOR_MODIFICACAO) " +
              "VALUES ("+ req.body.PercPericulosidade +",1,'"+ dateTime +"','"+ req.user.CPF +"','"+ dateTime +"','"+ req.user.CPF +"')"
    banco.Consultar(sql,function(update){
      try {
        return res.redirect('/beneficios?periculosidade=200')
      } catch (error) {
        return res.redirect('/beneficios?periculosidade=500')
      }
    })  

  });

  router.post('/SalvarInsalubridade', function(req, res) {

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    var sql= "UPDATE INSALUBRIDADE SET STATUS = 0"
    banco.Consultar(sql,function(update){
      try {
        console.log('.....................................BLOQUEANDO TODAS AS INSALUBRIDADES')

        sqll = "SET DATEFORMAT ymd INSERT INTO INSALUBRIDADE " +
               "VALUES ("+ req.body.PercInsalubridade +","+ req.body.SalarioMinimo +",1,'"+ dateTime +"','"+ req.user.CPF +"','"+ dateTime +"','"+ req.user.CPF +"')"
        
        console.log('INSERINDO A NOVA INSALUBRIDADE................: ' + sqll)
               banco.Consultar(sqll,function(insertInsalubridade){
          try {
            console.log('.....................................INSALUBRIDADE INSERIDA COM SUCESSO')
            return res.redirect('/beneficios?insalubridade=200')
          } catch (error) {
            return res.redirect('/beneficios?insalubridade=500')
          }
        }) 

      } catch (error) {
        return res.send(error)
      }
    })

  });

  router.post('/SalvarValeTransporte', function(req, res) {

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    var sql= "UPDATE VALE_TRANSPORTE SET STATUS = 0"
    banco.Consultar(sql,function(update){
      try {
        console.log('.....................................BLOQUEANDO TODAS OS VALE_TRANSPORTE')

        sqll = "SET DATEFORMAT ymd INSERT INTO VALE_TRANSPORTE " +
               "VALUES ("+ req.body.ValorVT +",1,'"+ dateTime +"','"+ req.user.CPF +"','"+ dateTime +"','"+ req.user.CPF +"')"
        
        console.log('INSERINDO A NOVA VALE_TRANSPORTE................: ' + sqll)
               banco.Consultar(sqll,function(insertVale){
          try {
            console.log('.....................................VALE_TRANSPORTE INSERIDA COM SUCESSO')
            return res.redirect('/beneficios?vale_transporte=200')
          } catch (error) {
            return res.redirect('/beneficios?vale_transporte=500')
          }
        }) 

      } catch (error) {
        return res.send(error)
      }
    })

  });

});

module.exports = router;
