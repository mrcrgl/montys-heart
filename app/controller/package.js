/**
 * Created with JetBrains WebStorm.
 * User: riegel
 * Date: 10.07.13
 * Time: 14:08
 * To change this template use File | Settings | File Templates.
 */

var User = require('../../lib/models/user'),
  Package = require('../../lib/models/package'),
  log = require('../../lib/log').init(module, "PackageController"),
  async = require('async'),
  regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  regexUsername = /^[a-zA-Z0-9._-]+$/,
  regexPassword = /^.{8,}$/;

exports.get = function(req, res, next) {

};

exports.put = function(req, res, next) {

};

exports.del = function(req, res, next) {

};
