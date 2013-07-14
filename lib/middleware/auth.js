/**
 * Created with JetBrains WebStorm.
 * User: riegel
 * Date: 10.07.13
 * Time: 14:22
 * To change this template use File | Settings | File Templates.
 */

var User = require('../../lib/models/user'),
  log = require('../../lib/log').init(module, "AuthMiddleware"),
  crypto = require('crypto');
  //async = require('async');

exports.middleware = function(req, res, next) {

  req.user = new User();

  if (!req.authorization.hasOwnProperty('basic')
    || !req.authorization.basic.hasOwnProperty('username')
    || !req.authorization.basic.hasOwnProperty('password')
    || null === req.authorization.basic.username
    || null === req.authorization.basic.password) {

    req.user = new User();
    return next();
  }

  var username = req.authorization.basic.username,
    password_hash = crypto.createHash('md5')
    .update(req.authorization.basic.password)
    .digest("hex");

  log.info(req.authorization);

  User.find({username: username, password: password_hash}, function(err, users) {
    if (err) {
      log.error(err);
      res.send(500, {code:"InternalError",message:err});
      return;
    }

    if (users.length < 1) {
      res.send(401, {code:"AuthenticationError",message:"Invalid login credentials."});
      return;
    }

    if (users.length > 1) {
      res.send(500, {code:"InternalError",message:"Blocked due security reasons. Multiple matched users."});
      return;
    }

    req.user = users[0];
    return next();
  });

};