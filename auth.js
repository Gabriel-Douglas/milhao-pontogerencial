const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const banco = require('./dbase.js');

//GERAR HASH DA SENHA
// const senha = bcrypt.hashSync('354879');
// console.log('SENHA:... ',senha);

module.exports = function (passport) {

    function findUser(username,user){
        try {
            banco.Consultar("SELECT * FROM USUARIOS WHERE CPF = '" + username + "' AND ATIVO = 1",function(users){
                users = users.find(user => user.CPF === username);
                return user(users);
            });
            
        } catch (error) {
            console.log(error)
        }
    }


    function findUserById(id,user) {
        try {
            banco.Consultar("SELECT * FROM USUARIOS WHERE ID = '" + id + "' AND ATIVO = 1",function(users){
                users = users.find(user => user.ID === id);
                return user(users);
            });
            
        } catch (error) {
            console.log(error)
        }
    }

    passport.serializeUser((user, done) => {
        done(null, user.ID);
    });;


    passport.deserializeUser((id, done) => {
        try {
            findUserById(id, function(user){
                return done(null, user);
            });
            
        } catch (err) {
                return done(err, null);
        }
    });


    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        (username, password, done) => {
            try {

                findUser(username,function (user){
                    // usuário inexistente
                    if (!user) { return done(null, false) }

                    // comparando as senhas
                    //const isValid = bcrypt.compareSync(password, user.SENHA);
                    
                    var isValid = false;


                    if(password.toString() === user.SENHA){
                        isValid = true;
                    } 

                    if (!isValid) return done(null, false)
                    return done(null, user)
                });

            } catch (err) {
                done(err, false);
            }
        }
    ));
}