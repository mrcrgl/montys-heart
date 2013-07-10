/**
 * Created with JetBrains WebStorm.
 * User: riegel
 * Date: 10.07.13
 * Time: 14:25
 * To change this template use File | Settings | File Templates.
 */

exports.auth = function() {
  var auth = require('./auth');

  return auth.middleware;
};