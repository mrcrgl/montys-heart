/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 09.07.13
 * Time: 22:49
 *
 */

var httpd = require('./httpd'),
  database = require('./database'),
  async = require('async');

exports.init = function(callback) {

  async.series([
    function(cb) {
      database.init(cb);
    },
    function(cb) {
      httpd.init(cb);
    }
  ],
  function(err) {
    callback(err);
  });

};