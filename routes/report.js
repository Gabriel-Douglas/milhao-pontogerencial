const { json } = require('body-parser');
var express = require('express');
const { DateTime } = require('mssql');
var router = express.Router();
const xlsx = require('xlsx');
const banco = require('../dbase.js');
const fs = require('fs');
const { dirname } = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('report');
});

router.get('/totalfuncionario',function(req,res){
    
    var strSql = "WITH RELATORIO AS ( " +
                 "  SELECT F.MATRICULA, F.MATRICULA_IPONTO, F.NOME, F.CDC, F.DEPARTAMENTO, F.CARGO, F.APONTADOR, ROUND(SUM(M.TOTAL)/60,2) AS TOTAL " +
                 "  FROM VIEW_MARCACOES_BRL M LEFT JOIN VIEW_CADASTRO_FUNCIONARIOS F ON M.MATRICULA_FUNC = F.MATRICULA " +
                 "  WHERE M.DATA BETWEEN '2022-01-21' AND '2022-02-22' " +
                 "  GROUP BY F.MATRICULA, F.MATRICULA_IPONTO, F.NOME, F.CDC, F.DEPARTAMENTO, F.CARGO, F.APONTADOR " +
                 ") " +
                 "SELECT * " +
                 "FROM RELATORIO  " +
                 "ORDER BY TOTAL DESC "

    console.log(strSql);

    banco.Consultar(strSql,function(dados){
      try {

        var wb = xlsx.utils.book_new();
        var ws = xlsx.utils.json_to_sheet(dados);

        xlsx.utils.book_append_sheet(wb,ws,"TOTAL POR FUNCIONARIO");
        xlsx.writeFile(wb,"/downloads/Total por Funcionário.xlsx")

        const file = __dirname + 'downloads/Total por Funcionário.xlsx';
        res.download(file,'Relatorio.xlsx');

      } catch (error) {
        console.log('deu pau.....')
        console.log(error);
        return res.send(error)
      }
    })

  //})

})

module.exports = router;
