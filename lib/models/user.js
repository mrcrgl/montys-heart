/**
 * Created with JetBrains WebStorm.
 * User: riegel
 * Date: 10.07.13
 * Time: 15:10
 * To change this template use File | Settings | File Templates.
 */

var db    = require('../database');
var Model = require('moodle');

var User = new Model('User');

User.storage('mongodb')
  .connect(
  function() {
    // Return your mongo instance with selected collection
    return db.connection.collection('users');
  }
);

/**
 * Define attributes
 */
User.attr('_id', 'ObjectId');

User.attr('username', 'String')
  .required();

User.attr('password', 'String')
  .required();

User.attr('email', 'String')
  .required();

User.attr('last_login', 'Date')
  .default(null);

User.attr('status', 'Bool')
  .default(true)
  .required();

module.exports = User;