const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const banco = require('./dbase.js');
const loadData = require('./loadData.js');
const xlsx = require('xlsx');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const reportRouter = require('./routes/report');
const chequeRouter = require('./routes/cheque');
const liquidoRouter = require('./routes/liquido');
const registrationRouter = require('./routes/registration');
const dashboardRouter = require('./routes/dashboard');
const beneficiosRouter = require('./routes/beneficios');

const app = express();

function authenticationMiddleware(req, res, next) {
  if (req.isAuthenticated()) return next();
    res.redirect('/login?fail=true');
}

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./auth')(passport);

app.use(session({  
  secret: '123', //configure um segredo seu aqui,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/login', loginRouter);
app.use('/users', authenticationMiddleware, usersRouter);
app.use('/', authenticationMiddleware,  indexRouter);
app.use('/logout', authenticationMiddleware,  logoutRouter);
app.use('/report', authenticationMiddleware,  reportRouter);
app.use('/liquido', authenticationMiddleware,  liquidoRouter);
app.use('/cheque', authenticationMiddleware,  chequeRouter);
app.use('/registration', authenticationMiddleware,  registrationRouter);
app.use('/dashboard', authenticationMiddleware,  dashboardRouter);
app.use('/beneficios', authenticationMiddleware,  beneficiosRouter);

app.get('/permissao',authenticationMiddleware, function (req, res){
  res.send(req.user.ADMINISTRADOR);
});

//JSON PARA RESGATAR OS FUNCIONÁRIOS
app.get('/funcionarios',authenticationMiddleware, function (req, res){

    //VERIFICAR NÍVEL DE ACESSO DO USUÁRIOS
     banco.Consultar("SELECT U.CPF_USUARIO, U.ID_NIVEL, A.NIVEL FROM NIVEL_USUARIO U INNER JOIN NIVEIS_ACESSO A ON U.ID_NIVEL = A.ID WHERE CPF_USUARIO = '" + req.user.CPF + "'",function(nivel){

      try {

        if(nivel[0].NIVEL === 'FULL'){
          loadData.loadFuncionarios(req.user.CPF,1,function(funcionarios){
            try {
              res.json(funcionarios)
            } catch (error) {
              res.send(error);
            }
          })
        }else{
          loadData.loadFuncionarios(req.user.CPF,0,function(funcionarios){
            try {
              res.json(funcionarios)
            } catch (error) {
              res.send(error);
            }
          })
        }

      } catch (error) {
        res.send(error);
      }

    });
});

//JSON PARA RESGATAR AS MARCACOES
app.get('/marcacoes/:matricula/:dtInicial/:dtFinal',authenticationMiddleware, function (req, res){
  loadData.loadMarcacoes(req.params.matricula,req.params.dtInicial,req.params.dtFinal,function(pontos){
    try {
      res.json(pontos);
    } catch (error) {
      res.send(error);
    }
  })
});

//JSON PARA RESGATAR AS MARCACOES DE TODOS FUNCIONÁRIOS
app.get('/relatorioAssinatura/:dtInicial/:dtFinal',authenticationMiddleware, function (req, res){

  banco.Consultar("SELECT U.CPF_USUARIO, U.ID_NIVEL, A.NIVEL FROM NIVEL_USUARIO U INNER JOIN NIVEIS_ACESSO A ON U.ID_NIVEL = A.ID WHERE CPF_USUARIO = '" + req.user.CPF + "'",function(nivel){

    try {

      if(nivel[0].NIVEL === 'FULL'){
        loadData.loadMarcacoesFuncionarios(req.user.CPF,
                                    req.params.dtInicial,
                                    req.params.dtFinal,
                                    true,
                                    function(pontos){
          try {
            res.render('report', {
              marcacoes: pontos
          });

          } catch (error) {
            res.send(error);
          }
        })
      }else{
        loadData.loadMarcacoesFuncionarios(req.user.CPF,
                                    req.params.dtInicial,
                                    req.params.dtFinal,
                                    false,
                                    function(pontos){
          try {
            res.render('report', {
              marcacoes: pontos
          });

          } catch (error) {
            res.send(error);
          }
        })
      }

      
    } catch (error) {
      res.send(error);
    }

  })

});

//JSON PARA RESGATAR AS MARCACOES DE UM FUNCIONÁRIOS
app.get('/relatorioAssinaturaInd/:matricula/:dtInicial/:dtFinal',authenticationMiddleware, function (req, res){

  loadData.loadMarcacoesFuncionariosInd(req.params.matricula,
                                        req.params.dtInicial,
                                        req.params.dtFinal,
                                        function(pontos){
    try {
      res.render('report', {
        marcacoes: pontos
    });

    } catch (error) {
      res.send(error);
    }
  })

});

app.get('/cargos',authenticationMiddleware, function (req, res){

  banco.Consultar("SELECT * FROM CARGOS ORDER BY NOME",function(cargos){
    try {
      res.json(cargos);
    } catch (error) {
      res.send(error)
    }
  })

});

app.get('/departamentos',authenticationMiddleware, function (req, res){

  banco.Consultar("SELECT * FROM DEPARTAMENTOS ORDER BY NOME",function(departamentos){
    try {
      res.json(departamentos);
    } catch (error) {
      res.send(error)
    }
  })

});

app.get('/usuarios',authenticationMiddleware, function (req, res){

  banco.Consultar("SELECT * FROM USUARIOS ORDER BY NOME",function(usuarios){
    try {
      res.json(usuarios);
    } catch (error) {
      res.send(error)
    }
  })

});


//JSON PARA INSERIR AS MARCACOES
app.post('/lancarMarcacao',authenticationMiddleware, function (req, res){

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;

  loadData.lancarMarcacao(req.body.matricula,
                              req.body.dia,
                              req.body.entrada1,
                              req.body.saida1,
                              req.body.entrada2,
                              req.body.saida2,
                              req.body.vt,
                              req.body.motivo,
                              dateTime,
                              req.user.CPF,
                              dateTime,
                              req.user.CPF,
                            function(resultPost){  
      try {
        res.send(resultPost)
      } catch (error) {
        res.send('ERRO!...:' + error);
      }

  })
});

app.post('/inserirFuncionario',authenticationMiddleware, function (req, res){

  loadData.inserirFuncionario(req.body.matricula,
                              req.body.nome,
                              req.body.cargo,
                              req.body.departamento,
                              req.body.cdc,
                              req.body.apontador,
                              req.body.salario,
                              req.body.status,
                              req.body.periculosidade,
                              req.body.insalubridade,
                              function(resultPost){  
      try {
        res.send(resultPost)
      } catch (error) {
        res.send('ERRO!...:' + error);
      }
  })
});

app.post('/editarFuncionario',authenticationMiddleware, function (req, res){

  loadData.editarFuncionario(req.body.matricula,
                              req.body.nome,
                              req.body.cargo,
                              req.body.departamento,
                              req.body.cdc,
                              req.body.apontador,
                              req.body.salario,
                              req.body.status,
                              req.body.periculosidade,
                              req.body.insalubridade,
                              function(resultPost){  
      try {
        res.send(resultPost)
      } catch (error) {
        res.send('ERRO!...:' + error);
      }
  })
});

app.post('/excluirFuncionario',authenticationMiddleware, function (req, res){

  loadData.excluirFuncionario(req.body.matricula,function(resultPost){  
      try {
        res.send(resultPost)
      } catch (error) {
        res.send('ERRO!...:' + error);
      }
  })

});

app.post('/excluirMarcacao',authenticationMiddleware, function (req, res){

  loadData.excluirMarcacao(req.body.matricula,
                           req.body.dia,
                         function(resultPost){  
      try {
        res.send(resultPost)
      } catch (error) {
        res.send('ERRO!...:' + error);
      }

  })
});

app.post('/desbloquearMarcacao',authenticationMiddleware, function (req, res){

  loadData.desbloquearMarcacao(req.body.matricula,
                               req.body.dia,
                               function(resultPost){  
      try {
        res.send(resultPost)
      } catch (error) {
        res.send('ERRO!...:' + error);
      }

  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
