var db = require('./mongo-promised.js')
    , user = require('./user.js')
    , bcrypt = require('bcrypt')
    , Q = require('q')
    , AuthenticationError = require('./errors.js');


module.exports = AuthManager;

function AuthManager() {
    var self = this;
    db.connect('mongodb://127.0.0.1:27017/CNUG').done(
        function () {
            self.isConnected = true;
        },
        function () {
            self.isConnected = false;
        }
    )
    var users;
};

AuthManager.prototype.isConnected = false;

AuthManager.prototype.addUser = function (user) {
    var self = this;
    var deferred = Q.defer();
    self.hashPassword(user).done(function (user) {
        db.insert(user, {w: 1, safe: true}).done(function (objects) {
            deferred.resolve(objects);
        }, function (err) {
            deferred.reject(err);
        });
    });
    return deferred.promise;
};

AuthManager.prototype.authenticateUser = function (user) {
    var deferred = Q.defer();
    var reqUser = user;
    db.findOne({name: reqUser.name}).done(function (dbUser) {
        if (dbUser) {
            bcrypt.compare(reqUser.password, dbUser.password, function (err, res) {
                if (err) {
                    deferred.reject(err);
                } else {
                    if (res) {
                        deferred.resolve();
                    } else {
                        deferred.reject(new AuthenticationError("Bad Login"));
                    }
                }
            });
        } else {
            deferred.reject(new AuthenticationError("Bad Login"));
        }
    });

    return deferred.promise;
};

AuthManager.prototype.generateSalt = function (length) {
    var deferred = Q.defer();
    bcrypt.genSalt(length, function (err, salt) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(salt);
        }

    });
    return deferred.promise;
};
AuthManager.prototype.hashPassword = function (user) {
    var self = this, deferred = Q.defer();
    ;
    self.generateSalt(12).done(function (salt) {
        user.salt = salt;
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                deferred.reject(err);
            } else {
                user.password = hash;
                deferred.resolve(user);
            }
        })
    });
    return deferred.promise;
};

