/**
 * Created with JetBrains WebStorm.
 * User: riegel
 * Date: 10.07.13
 * Time: 14:55
 * To change this template use File | Settings | File Templates.
 */

var MongoClient = require('mongodb').MongoClient,
  log = require('./log').init(module, "DB");

var hosts = [
  "db01:27017",
  "db02:27017",
  "db02:27017"
];

var url = "mongodb://" + hosts.join(',') + "/monty";

var connect = function(callback) {
  if (exports.connection) {
    return callback(null, connection);
  }

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;

    exports.connection = db;
    return callback(null, exports.connection);
  });
};

exports.connection = null;

exports.init = function(callback) {

  try {
    connect(function(err, db) {
      log.info("Database initialized.");
      callback(null, db);
    });
  } catch(e) {
    log.error(e);
    callback(e);
  }

};



