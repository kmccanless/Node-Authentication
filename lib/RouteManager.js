var AuthManager = require('./AuthManager.js')
    , User = require('./user.js')
    , AuthenticationError = require('./errors.js');


var authman = new AuthManager();

module.exports = function (app) {

    function authenticate (req,res,next) {
        if (req.session.user == null) {
            res.redirect('/login');
        } else {
            next ();
        }
    };
    app.get('/login', function(req,res) {
        res.render('login', {title: 'Login'});
    });
    app.get('/register', function(req,res) {
        res.render('register', {title: 'Register'});
    });
    app.get('/secured', authenticate, function(req,res){
        res.render('secured');
    });
    app.get('/500', function(req,res){
        res.render('500', {title: 'Server Error'});
    });
    app.post('/register', function(req,res) {
        var user = new User(req.body.user);
        if(authman.isConnected) {
            authman.addUser(user).done ( function () {
                req.session.user = user;
                res.redirect('/secured');
            });
        } else {
            res.redirect('/500');
        }

    });
    app.post('/login', function(req,res,next) {
        var user = new User(req.body.user);
        if(authman.isConnected) {
            authman.authenticateUser(user).done ( function () {
                req.session.user = user;
                res.redirect('/secured');
            },function(err) {
               if(err instanceof AuthenticationError) {
                   res.locals.authenticationError = err.message;
                   res.render('login', {title : "Login"})
               } else {
                   res.redirect('/500');
               }
            })
        } else {
            res.redirect('/500');
        }

    });
}