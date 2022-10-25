const { Promise } = require('mssql');
//const { resolve } = require('path/posix');
const banco = require('./dbase.js');

module.exports = {
    loadFuncionarios: function(responsavel,master,funcionarios){
        
        //PROCUCURAR FUNCIONÁRIOS COM O CPF DO RESPONSÁVEL

        if(master === 1){
            banco.Consultar("SELECT MATRICULA, NOME FROM FUNCIONARIOS WHERE STATUS = 1 ORDER BY NOME ASC",function(result){
                try {
                    return funcionarios(result);
                } catch (error) {
                    console.log(error)
                }
            })
        }else{
            banco.Consultar("SELECT MATRICULA, NOME FROM FUNCIONARIOS WHERE CPF_APONTADOR = '" + responsavel + "' AND STATUS = 1 ORDER BY NOME ASC",function(result){
                try {
                    return funcionarios(result);
                } catch (error) {
                    console.log(error)
                }
            })
        }
    },

    loadMarcacoes: function(matricula,dtInicial,dtFinal,marcacoes){
        //PROCUCURAR MARCACOES DO FUNCIONARIOS
        banco.Consultar("SELECT * FROM MARCACOES WHERE MATRICULA_FUNC = '" + matricula + "' AND DATA >='" + dtInicial + "' AND DATA <= '" + dtFinal + "'",function(result){
            try {
                return marcacoes(result);
            } catch (error) {
                console.log(error)
            }
        })
    },

    loadMarcacoesFuncionarios: function(cpfGerente,dtInicial,dtFinal,master,marcacoes){
        //PROCUCURAR MARCACOES DO FUNCIONARIOS

        var strWhere = "";

        if(master){
            strWhere = "WHERE M.DATA >= '" + dtInicial + "' AND M.DATA <= '" + dtFinal + "' "
        }else{
            strWhere = "WHERE M.DATA >= '" + dtInicial + "' AND M.DATA <= '" + dtFinal + "' AND F.CPF_APONTADOR = '" + cpfGerente + "' "
        }

        sql = 
            "DECLARE @PERC_PERI DECIMAL(18,2) " +
            "DECLARE @VLR_INSA DECIMAL(18,2) " +
            "DECLARE @VLR_VT DECIMAL(18,2) " +
            
            "SET @PERC_PERI = (SELECT PERCENTUAL FROM PERICULOSIDADE WHERE STATUS = 1) " +
            "SET @VLR_INSA = (SELECT VALOR_INSALUBRIDADE FROM INSALUBRIDADE WHERE STATUS = 1) " + 
            "SET @VLR_VT = (SELECT VALOR_VT FROM VALE_TRANSPORTE WHERE STATUS = 1); " + 

            "WITH HORAEXTRA AS ( " +
            "SELECT MATRICULA_FUNC, CAST(SUM(HEX1) AS int) AS HEX1, " +
            "                        CAST(SUM(HEX2) AS int) AS HEX2, " +
            "                        CAST(SUM(HEXN1) AS int) AS HEXN1, " +
            "                        CAST(SUM(HEXN2) AS int) AS HEXN2  " +
            "FROM MARCACOES M LEFT JOIN FUNCIONARIOS F ON M.MATRICULA_FUNC = F.MATRICULA " + strWhere + "GROUP BY MATRICULA_FUNC) " + 

            "SELECT ROW_NUMBER() OVER(PARTITION BY M.MATRICULA_FUNC ORDER BY M.MATRICULA_FUNC, M.DATA ASC) -1 AS LINHA, " +
                            "M.ID, M.MATRICULA_FUNC, F.NOME, C.NOME AS CARGO, D.NOME AS DEPARTAMENTO, M.DATA, M.ENTRADA1, M.SAIDA1, M.ENTRADA2, M.SAIDA2, "+
                            "M.VT, IIF(M.VT = 1, @VLR_VT,0) AS VALOR_VT, " +
                            "M.OBSERVACAO, M.HEX1, M.HEX2, M.HEXN1, M.HEXN2, U.NOME AS APONTADOR, " +
                            
                            "REPLICATE('0',3-LEN(CAST(H.HEX1/60 AS varchar(3)))) + CAST(H.HEX1/60 AS varchar(3)) + ':' +  " +
                            "REPLICATE('0',2-LEN(CAST(H.HEX1%60 AS varchar(2)))) + CAST(H.HEX1%60 AS varchar(2)) AS HREX1, " +
                            
                            "REPLICATE('0',3-LEN(CAST(H.HEX2/60 AS varchar(3)))) + CAST(H.HEX2/60 AS varchar(3)) + ':' +  " +
                            "REPLICATE('0',2-LEN(CAST(H.HEX2%60 AS varchar(2)))) + CAST(H.HEX2%60 AS varchar(2)) AS HREX2, " +
                            
                            "REPLICATE('0',3-LEN(CAST(H.HEXN1/60 AS varchar(3)))) + CAST(H.HEXN1/60 AS varchar(3)) + ':' +  " +
                            "REPLICATE('0',2-LEN(CAST(H.HEXN1%60 AS varchar(2)))) + CAST(H.HEXN1%60 AS varchar(2)) AS HREXN1, " +
                            
                            "REPLICATE('0',3-LEN(CAST(H.HEXN2/60 AS varchar(3)))) + CAST(H.HEXN2/60 AS varchar(3)) + ':' +  " +
                            "REPLICATE('0',2-LEN(CAST(H.HEXN2%60 AS varchar(2)))) + CAST(H.HEXN2%60 AS varchar(2)) AS HREXN2, F.SALARIO, " +
                            
                            "IIF(F.PERICULOSIDADE = 1,((@PERC_PERI/100) * F.SALARIO),0) AS VLR_PERICULOSIDADE, " +
                            "IIF(F.INSALUBRIDADE = 1,@VLR_INSA,0) AS VLR_INSALUBRIDADE, " +
                            "F.SALARIO + IIF(F.PERICULOSIDADE = 1,((@PERC_PERI/100) * F.SALARIO),0) + IIF(F.INSALUBRIDADE = 1,@VLR_INSA,0) AS SALARIO_TOTAL " +
                            
                            "FROM MARCACOES M LEFT JOIN FUNCIONARIOS F ON M.MATRICULA_FUNC = F.MATRICULA " +
                                            "LEFT JOIN USUARIOS U ON F.CPF_APONTADOR = U.CPF " +
                                            "LEFT JOIN CARGOS C ON F.ID_CARGO = C.ID " +
                                            "LEFT JOIN DEPARTAMENTOS D ON F.ID_DEPARTAMENTO = D.ID " +
                                            "LEFT JOIN HORAEXTRA H ON M.MATRICULA_FUNC = H.MATRICULA_FUNC " + strWhere + "ORDER BY F.NOME, M.DATA ASC"

        //console.log(sql)
        banco.Consultar(sql,function(result){
            try {
                return marcacoes(result);
            } catch (error) {
                console.log(error)
            }
        })
    },

    loadMarcacoesFuncionariosInd: function(matricula,dtInicial,dtFinal,marcacoes){
        //PROCUCURAR MARCACOES DO FUNCIONARIOS
        banco.Consultar(
        "WITH HORAEXTRA AS ( " +
        "SELECT MATRICULA_FUNC, CAST(SUM(HEX1) AS int) AS HEX1, " +
        "                        CAST(SUM(HEX2) AS int) AS HEX2, " +
        "                        CAST(SUM(HEXN1) AS int) AS HEXN1, " +
        "                        CAST(SUM(HEXN2) AS int) AS HEXN2  " +
        "FROM MARCACOES M LEFT JOIN FUNCIONARIOS F ON M.MATRICULA_FUNC = F.MATRICULA " +
        "WHERE M.MATRICULA_FUNC = '" + matricula + "' AND M.DATA >= '" + dtInicial + "' AND M.DATA <= '" + dtFinal + "' " +
        "GROUP BY MATRICULA_FUNC) " +

        "SELECT ROW_NUMBER() OVER(PARTITION BY M.MATRICULA_FUNC ORDER BY M.MATRICULA_FUNC, M.DATA ASC) -1 AS LINHA, " +
                        "M.ID, M.MATRICULA_FUNC, F.NOME, C.NOME AS CARGO, D.NOME AS DEPARTAMENTO, M.DATA, M.ENTRADA1, M.SAIDA1, M.ENTRADA2, M.SAIDA2, M.OBSERVACAO, M.HEX1, M.HEX2, M.HEXN1, M.HEXN2, U.NOME AS APONTADOR, " +
                        
                        "REPLICATE('0',3-LEN(CAST(H.HEX1/60 AS varchar(3)))) + CAST(H.HEX1/60 AS varchar(3)) + ':' +  " +
                        "REPLICATE('0',2-LEN(CAST(H.HEX1%60 AS varchar(2)))) + CAST(H.HEX1%60 AS varchar(2)) AS HREX1, " +
                        
                        "REPLICATE('0',3-LEN(CAST(H.HEX2/60 AS varchar(3)))) + CAST(H.HEX2/60 AS varchar(3)) + ':' +  " +
                        "REPLICATE('0',2-LEN(CAST(H.HEX2%60 AS varchar(2)))) + CAST(H.HEX2%60 AS varchar(2)) AS HREX2, " +
                        
                        "REPLICATE('0',3-LEN(CAST(H.HEXN1/60 AS varchar(3)))) + CAST(H.HEXN1/60 AS varchar(3)) + ':' +  " +
                        "REPLICATE('0',2-LEN(CAST(H.HEXN1%60 AS varchar(2)))) + CAST(H.HEXN1%60 AS varchar(2)) AS HREXN1, " +
                        
                        "REPLICATE('0',3-LEN(CAST(H.HEXN2/60 AS varchar(3)))) + CAST(H.HEXN2/60 AS varchar(3)) + ':' +  " +
                        "REPLICATE('0',2-LEN(CAST(H.HEXN2%60 AS varchar(2)))) + CAST(H.HEXN2%60 AS varchar(2)) AS HREXN2 " +
                        
                        "FROM MARCACOES M LEFT JOIN FUNCIONARIOS F ON M.MATRICULA_FUNC = F.MATRICULA " +
                                        "LEFT JOIN USUARIOS U ON F.CPF_APONTADOR = U.CPF " +
                                        "LEFT JOIN CARGOS C ON F.ID_CARGO = C.ID " +
                                        "LEFT JOIN DEPARTAMENTOS D ON F.ID_DEPARTAMENTO = D.ID " +
                                        "LEFT JOIN HORAEXTRA H ON M.MATRICULA_FUNC = H.MATRICULA_FUNC " +
                        "WHERE M.MATRICULA_FUNC = '" + matricula + "' AND M.DATA >= '" + dtInicial + "' AND M.DATA <= '" + dtFinal + "' " +
                        "ORDER BY M.MATRICULA_FUNC, M.DATA ASC",
                        function(result){
            try {

                return marcacoes(result);
            } catch (error) {
                console.log(error)
            }
        })
    },

    lancarMarcacao: function(matricula,dia,entrada1,saida1,entrada2,saida2,vt,motivo,dataCriacao,autorCriacao,dataModificacao,autorModificacao,statusInsert){
        //PASSA VAZIO PARA NULL
        if (entrada1 === '') {
            entrada1 = 'null';
            var UpdateEntrada1 = 'ENTRADA1 = null';
        }else{
            entrada1 = "'" + entrada1 + "'"
            var UpdateEntrada1 = 'ENTRADA1 = ' + entrada1
        }

        if (saida1 === '') {
            saida1 = 'null';
            var UpdateSaida1 = 'SAIDA1 = null'
        }else{
            saida1 = "'" + saida1 + "'"
            var UpdateSaida1 = 'SAIDA1 = ' + saida1
        }

        if (entrada2 === '') {
            entrada2 = 'null'
            var UpdateEntrada2 = 'ENTRADA2 = null'
        }else{
            entrada2 = "'" + entrada2 + "'"
            var UpdateEntrada2 = 'ENTRADA2 = ' + entrada2
        }

        if (saida2 === '') {
            saida2 = 'null';
            var UpdateSaida2 = 'SAIDA2 = null'
        }else{
            saida2 = "'" + saida2 + "'"
            var UpdateSaida2 = 'SAIDA2 = ' + saida2
        }
        
        //VERIFICA SE A MARCACAO JÁ EXISTE
        banco.Consultar("SELECT * FROM MARCACOES WHERE MATRICULA_FUNC = '" + matricula + "' AND DATA ='" + dia + "'",function(result){
            try {
                if(Object.keys(result).length > 0){ //EXISTE UMA MARCAÇÃO PARA O DIA
                    //VERIFICAR O STATUS DA MARCAÇÃO
                    if(result[0].STATUS != 0){
                        return statusInsert('BLOQUEADO');
                    }

                    banco.Update("UPDATE MARCACOES SET " + UpdateEntrada1 + "," + UpdateSaida1 + "," + UpdateEntrada2 + "," + UpdateSaida2 + ", VT = " + vt + ", OBSERVACAO = '" + motivo + "', DATA_MODIFICACAO = '" + dataModificacao + "', AUTOR_MODIFICACAO = '" + autorModificacao + "' WHERE MATRICULA_FUNC = '" + matricula + "' AND DATA = '" + dia + "'",function(insert){
                        return statusInsert(insert);                        
                    })
                    
                }else{ //NÃO EXISTE MARCAÇÃO PARA O DIA
                    banco.Inserir("INSERT INTO MARCACOES(MATRICULA_FUNC,DATA,ENTRADA1,SAIDA1,ENTRADA2,SAIDA2,VT,OBSERVACAO,STATUS,DATA_CRIACAO,AUTOR_CRIACAO,DATA_MODIFICACAO,AUTOR_MODIFICACAO) VALUES('" + matricula + "','" + dia + "'," + entrada1 + "," + saida1 + "," + entrada2 + "," + saida2 + "," + vt + ",'" + motivo + "',0,'" + dataCriacao + "','" + autorCriacao + "','" + dataModificacao + "','" + autorModificacao + "') ",function(insert){
                        return statusInsert(insert);                        
                    })
                }

                //return status(Object.keys(result).length.toString());
            } catch (error) {
                console.log(error)
            }
        })
    },

    excluirMarcacao: function(matricula,dia,statusExclusao){

        try {
            banco.Consultar("SELECT * FROM MARCACOES WHERE MATRICULA_FUNC = '" + matricula + "' AND DATA = '" + dia + "'",function(marcacoes){
                try {
                    if(Object.keys(marcacoes).length < 0){
                        return statusExclusao('DELETE - FAIL');
                    }else{
                        banco.Delete("DELETE FROM MARCACOES WHERE DATA = '" + dia + "' AND MATRICULA_FUNC = '" + matricula + "'",function(result){
                            try {
                                return statusExclusao(result)
                            } catch (error) {
                                console.log(error);
                                return statusExclusao('DELETE - FAIL');
                            }
                        })
                    }
                } catch (error) {
                    console.log(error);
                    return statusExclusao('DELETE - FAIL');
                }
            })

        } catch (error) {
            console.log(error)
        }

    },

    desbloquearMarcacao: function(matricula,dia,statusUpdate){

        try {
            banco.Update("UPDATE MARCACOES SET STATUS = 0 WHERE DATA = '" + dia + "' AND MATRICULA_FUNC = '" + matricula + "'",function(result){
                try {
                    return statusUpdate(result)
                } catch (error) {
                    console.log(error)
                }
            })
        } catch (error) {
            console.log(error)
        }

    },

    inserirFuncionario: function(matricula,nome,cargo,departamento,cdc,gerente,salario,status,periculosidade,insalubridade,statusInsert){
        
        //VERIFICA SE A MARCACAO JÁ EXISTE
        banco.Consultar("SELECT * FROM FUNCIONARIOS WHERE MATRICULA = '" + matricula + "'",function(result){
            try {
                console.log(result)
                if(Object.keys(result).length > 0){ //EXISTE UM FUNCIONÁRIO COM A MATRICULA
                        return statusInsert('DUPLICADO');                    
                }else{ //NÃO EXISTE FUNCIONARIO COM ESSA MATRICULA
                    banco.Inserir("INSERT INTO FUNCIONARIOS VALUES('" + matricula + "','" + nome + "'," + cargo + "," + cdc + "," + departamento + "," + salario + ",'" + gerente + "'," + status + "," + periculosidade + "," + insalubridade  + ",'000000') ",function(insert){
                        return statusInsert(insert);                        
                    })
                }

            } catch (error) {
                console.log(error)
            }
        })
    },

    editarFuncionario: function(matricula,nome,cargo,departamento,cdc,gerente,salario,status,periculosidade,insalubridade,statusUpdate){
        
        //VERIFICA SE O FUNCIONÁRIO EXISTE
        banco.Consultar("SELECT * FROM FUNCIONARIOS WHERE MATRICULA = '" + matricula + "'",function(result){
            try {
                console.log(result)
                if(Object.keys(result).length < 0){ 
                        return statusUpdate('NO DATA');                    
                }else{ //NÃO EXISTE FUNCIONARIO COM ESSA MATRICULA
                    banco.Update("UPDATE FUNCIONARIOS SET MATRICULA = '" + matricula + "', NOME = '" + nome + "', ID_CARGO = " + cargo + ", ID_CDC = " + cdc + ", ID_DEPARTAMENTO = " + departamento + ", SALARIO = " + salario + ", CPF_APONTADOR = '" + gerente + "', STATUS =" + status + ", PERICULOSIDADE =" + periculosidade + ", INSALUBRIDADE =" + insalubridade + " WHERE MATRICULA = '"  + matricula + "'",function(update){
                        try {
                            return statusUpdate(update);    
                        } catch (error) {
                            console.log(error);
                            return statusUpdate(update);    
                        }                    
                    })
                }

            } catch (error) {
                console.log(error)
            }
        })
    },

    excluirFuncionario: function(matricula,statusDelete){
        
        //VERIFICA SE O FUNCIONÁRIO EXISTE
        banco.Consultar("SELECT * FROM FUNCIONARIOS WHERE MATRICULA = '" + matricula + "'",function(result){
            try {
                console.log(result)
                if(Object.keys(result).length < 0){
                        return statusUpdate('NO DATA');                    
                }else{ //NÃO EXISTE FUNCIONARIO COM ESSA MATRICULA
                    banco.Delete("DELETE FUNCIONARIOS WHERE MATRICULA = '" + matricula + "'",function(DelFunc){
                        try {
                            return statusDelete(DelFunc);    
                        } catch (error) {
                            console.log(error);
                            return statusDelete(DelFunc);    
                        }                    
                    })
                }

            } catch (error) {
                console.log(error)
            }
        })
    },

    diasUteisMilhao: function(dtInicial,dtFinal){
        return new Promise((resolve, reject) => {
            banco.Consultar("SELECT dbo.FN_DIASUTEISMILHAO('" + dtInicial + "','" + dtFinal + "') AS diasDSR",function(dias){
                try {
                    resolve(dias);
                } catch (error) {
                    reject(error)
                }
            })
        }) 
    },
    
    AcumuladoHorasDia: function(dataInicial,dataFinal,gerente,usuario,adm){
        return new Promise((resolve,reject) => {

            var condicao = "' AND F.CPF_APONTADOR = '" + gerente + "' "
            if(gerente == 'todos' && adm) condicao = "' "
  
            banco.Consultar("SELECT M.DATA, ROUND((SUM(m.TOTAL)/60),1) [TOTAL_HORAS] " + 
                            "FROM VIEW_MARCACOES_BRL M LEFT JOIN VIEW_CADASTRO_FUNCIONARIOS F ON M.MATRICULA_FUNC = F.MATRICULA " + 
                            "WHERE M.DATA BETWEEN '" + dataInicial + "' AND '" + dataFinal + condicao + 
                            "GROUP BY M.DATA " + 
                            "ORDER BY M.DATA ASC", 
            function(acumulado){
                try {
                    resolve(acumulado);
                } catch (error) {
                    reject(error)
                }
            })
        })
    },

    HorasDepartamento: function(dataInicial,dataFinal,gerente,adm){
        return new Promise((resolve,reject) => {

            var condicao = "' AND F.CPF_APONTADOR = '" + gerente + "' "
            if(gerente == 'todos' && adm) condicao = "' "

            banco.Consultar("SELECT F.DEPARTAMENTO, ROUND((SUM(m.TOTAL)/60),1) [TOTAL_HORAS] " + 
                            "FROM VIEW_MARCACOES_BRL M LEFT JOIN VIEW_CADASTRO_FUNCIONARIOS F ON M.MATRICULA_FUNC = F.MATRICULA " + 
                            "WHERE M.DATA BETWEEN '" + dataInicial + "' AND '" + dataFinal + condicao + " GROUP BY F.DEPARTAMENTO " + 
                            "ORDER BY F.DEPARTAMENTO ASC", 
            function(acumulado){
                try {
                    resolve(acumulado);
                } catch (error) {
                    reject(error)
                }
            })
        })
    },

    HorasFuncionario: function(dataInicial,dataFinal,gerente,adm){
        return new Promise((resolve,reject) => {

            var condicao = "' AND F.CPF_APONTADOR = '" + gerente + "' "
            if(gerente == 'todos' && adm) condicao = "' "

            banco.Consultar("SELECT F.NOME, ROUND((SUM(m.TOTAL)/60),1) [TOTAL_HORAS] " + 
                            "FROM VIEW_MARCACOES_BRL M LEFT JOIN VIEW_CADASTRO_FUNCIONARIOS F ON M.MATRICULA_FUNC = F.MATRICULA " + 
                            "WHERE M.DATA BETWEEN '" + dataInicial + "' AND '" + dataFinal + condicao + " GROUP BY F.NOME " + 
                            "ORDER BY F.NOME ASC", 
            function(acumulado){
                try {
                    resolve(acumulado);
                } catch (error) {
                    reject(error)
                }
            })
        })
    },

    HorasCargo: function(dataInicial,dataFinal,gerente,adm){
        return new Promise((resolve,reject) => {

            var condicao = "' AND F.CPF_APONTADOR = '" + gerente + "' "
            if(gerente == 'todos' && adm) condicao = "' "

            banco.Consultar("SELECT F.CARGO, ROUND((SUM(m.TOTAL)/60),1) [TOTAL_HORAS] " + 
                            "FROM VIEW_MARCACOES_BRL M LEFT JOIN VIEW_CADASTRO_FUNCIONARIOS F ON M.MATRICULA_FUNC = F.MATRICULA " + 
                            "WHERE M.DATA BETWEEN '" + dataInicial + "' AND '" + dataFinal + condicao + " GROUP BY F.CARGO " + 
                            "ORDER BY F.CARGO ASC", 
            function(acumulado){
                try {
                    resolve(acumulado);
                } catch (error) {
                    reject(error)
                }
            })
        })
    },


    RelatoriosUsuario: function(usuario){
        return new Promise((resolve,reject) => {
        banco.Consultar("SELECT A.ID, R.NOME, R.FUNCAO, R.GRUPO, A.USUARIO, R.STATUS " +
                        "FROM ACESSO_RELATORIOS A LEFT JOIN RELATORIOS R ON A.ID_RELATORIO = R.ID " +
                        "WHERE A.USUARIO = '" + usuario + "'", 
                        function(rels){
                            try {
                                resolve(rels);
                            } catch (error) {
                                reject(error)
                            }
                    })
                })
    }
    

}