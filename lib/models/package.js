/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 10.07.13
 * Time: 22:10
 *
 */

var db    = require('../database');
var Model = require('moodle');

var Package = new Model('Package');

Package.storage('mongodb')
  .connect(
  function() {
    // Return your mongo instance with selected collection
    return db.connection.collection('packages');
  }
);

/**
 * Define attributes
 */
Package.attr('_id', 'ObjectId');

Package.attr('language', 'String')
  .default('py')
  .required();

Package.attr('name', 'String')
  .required();

Package.attr('version', 'String')
  .required();

Package.attr('copyright', 'String')
  .required();

Package.attr('owner', 'ObjectId')
  .required();

Package.attr('engines', 'Object')
  .default({})
  .required();

Package.attr('licence', 'String')
  .default(null)
  .required();

Package.attr('public', 'Bool')
  .default(true)
  .required();

Package.attr('dependencies', 'Object')
  .default({})
  .required();

Package.attr('contributors', 'Object')
  .default({})
  .required();

Package.attr('binaries', 'Object')
  .default({})
  .required();

Package.attr('prefer_global', 'Bool')
  .default(false)
  .required();

Package.attr('last_release', 'Date')
  .required();

Package.attr('versions', 'Object')
  .default({})
  .required();

Package.attr('status', 'Bool')
  .default(true)
  .required();

module.exports = Package;