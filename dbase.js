var sql = require("mssql");

   // config for your database
   var config = {
      user: 'admComex',
      password: 'Scem7078',
      server: 'localhost', 
      database: 'pontogerencial',
      synchronize: true,
      trustServerCertificate: true,
   };  

   module.exports = {

      Consultar: function(sqlString, consulta){

         try {
            sql.connect(config,function(){
               var request = new sql.Request();
   
               request.query(sqlString, function (err, result) {
                  
                  if (err) {
                     console.log(err);
                     return consulta(err);
                  }
                  
                  return consulta(result.recordset);
                  //return consulta = result.recordset;

                  });
               })

   
         } catch (error) {
            console.log('ERRO AO CONECTAR NO BANCO...: ', error)
         }
   
      },

      Inserir: function(sqlString, consulta){

         try {
            sql.connect(config,function(){
               var request = new sql.Request();
   
               request.query(sqlString, function (err, result) {
                  
                  if (err) {
                     console.log(err);
                     return consulta('INSERT - FAIL');
                  }
                  
                  return consulta('INSERT - SUCESS');

                  });
               })

   
         } catch (error) {
            console.log('ERRO AO CONECTAR NO BANCO...: ', error)
         }
   
      },

      Update: function(sqlString, consulta){

         try {
            sql.connect(config,function(){
               var request = new sql.Request();
   
               request.query(sqlString, function (err, result) {
                  
                  if (err) {
                     console.log(err);
                     return consulta('UPDATE - FAIL');
                  }
                  
                  return consulta('UPDATE - SUCESS');

                  });
               })

   
         } catch (error) {
            console.log('ERRO AO CONECTAR NO BANCO...: ', error)
         }
   
      },

      Delete: function(sqlString, consulta){

         try {
            sql.connect(config,function(){
               var request = new sql.Request();
   
               request.query(sqlString, function (err, result) {
                  
                  if (err) {
                     console.log(err);
                     return consulta('DELETE - FAIL');
                  }
                  
                  return consulta('DELETE - SUCESS');

                  });
               })

   
         } catch (error) {
            console.log('ERRO AO CONECTAR NO BANCO...: ', error)
         }
   
      }

}



