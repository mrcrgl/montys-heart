/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 14.07.13
 * Time: 15:41
 *
 */

var db    = require('../database');
var Model = require('moodle');

var Revision = new Model('Revision');

Revision.storage('mongodb')
  .connect(
  function() {
    // Return your mongo instance with selected collection
    return db.connection.collection('revisions');
  }
);

/**
 * Define attributes
 */
Revision.attr('_id', 'ObjectId');

Revision.attr('package_name', 'String')
  .required();

Revision.attr('package_version', 'String')
  .required();

Revision.attr('is_latest', 'Bool')
  .default(true)
  .required();

Revision.attr('data', 'String')
  .required();

Revision.attr('filename', 'String')
  .required();

Revision.attr('checksum', 'String')
  .required();

module.exports = Revision;