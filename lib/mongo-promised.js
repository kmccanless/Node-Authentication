var     mongo = require('mongodb').MongoClient
    ,   Q = require('q');

var connect = Q.denodeify(mongo.connect), users;


exports.connect = function(url){
    var deferred = Q.defer();
    connect(url).done(
        function (database) {
            users = database.collection("users");
            deferred.resolve();
        },
        function(err) {
            deferred.reject(err);
        }
    )
    return deferred.promise;
};
exports.collection = function (name) {
    mongo.collection(name);
}

exports.insert = function (doc,options) {
   var deferred = Q.defer();
    users.insert(doc,options,function(err,objects){
        if(err) deferred.reject();
        deferred.resolve(objects);
    })
    return deferred.promise;
};
exports.findOne = function (query) {
    var deferred = Q.defer();
    users.findOne(query,function(err,obj) {
        if (err) deferred.reject();
        deferred.resolve(obj);
    });
    return deferred.promise;
}

//exports.update = Q.denodeify(mongo.update);



