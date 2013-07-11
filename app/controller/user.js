/**
 * Created with JetBrains WebStorm.
 * User: riegel
 * Date: 10.07.13
 * Time: 14:08
 * To change this template use File | Settings | File Templates.
 */

var User = require('../../lib/models/user'),
  log = require('../../lib/log').init(module, "UserController"),
  crypto = require('crypto'),
  async = require('async'),
  regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  regexUsername = /^[a-zA-Z0-9._-]+$/,
  regexPassword = /^.{8,}$/;


var checkEmail = function(params, callback) {
  if (params.hasOwnProperty('email')
    && regexEmail.exec(params.email)) {

    callback(null, params.email);

  } else {
    callback("ErrorInvalidEmail");
  }
};

var checkUsername = function(params, callback) {
  if (params.hasOwnProperty('username')
    && regexUsername.exec(params.username)) {

    callback(null, params.username);

  } else {
    callback("ErrorInvalidUsername");
  }
};

var checkPassword = function(params, callback) {
  if (params.hasOwnProperty('password')
    && regexPassword.exec(params.password)) {

    callback(
      null,
      crypto.createHash('md5').update(params.password).digest("hex")
    );

  } else {
    callback("ErrorInvalidPassword");
  }
};

exports.get = function(req, res, next) {

  checkEmail(req.params, function(err, email) {
    if (err) {
      res.send(400, {"code":"UserError","message":err});
      return next();
    }
    User.findOne({email:email}, function(err, user) {
      if (err) {
        res.send(500);
        return next();
      }

      if (!user.isValid()) {
        res.send(404);
        return next();
      }

      var userObject = user.toJSON();
      delete userObject._id;
      delete userObject.password;

      res.send(200, userObject);
      return next();

    });
  });

};

exports.put = function(req, res, next) {

  var username, password, email, errors = [];

  async.parallel({
    email: function(cb) {
      checkEmail(req.params, function(err, value) {
        cb(err, value);
      });
    },
    password: function(cb) {
      checkPassword(req.params, function(err, value) {
        cb(err, value);
      });
    },
    username: function(cb) {
      checkUsername(req.params, function(err, value) {
        cb(err, value);
      });
    }
  },
  function(err, values) {
    if (err) {
      res.send(400, {"code":"UserError", "message": err});
      return next();
    }

    User.findOne({email:values.email}, function(err, result) {
      if (result.isValid()) {
        log.error(err);
        res.send(500, {"code":"DuplicateEntryError","message": "Email address already in use."});
        return next();
      }

      var user = new User();

      user.set(values);

      user.save(function(err) {
        if (err) {
          log.error(err);
          res.send(500, {"code":"InternalError","message":err});
          return next();
        }

        log.info("Created user: '%s'", email);
        res.send(200);
        return next();
      });
    });

  });

};

exports.del = function(req, res, next) {
  res.send(204);
  return next();
};