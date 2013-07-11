/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 09.07.13
 * Time: 22:49
 *
 */

var App = require('../lib/app'),
  log = require('../lib/log').init(module, "Daemon");

App.init(function(err) {
  if (err) {
    log.error(err);
  }

  log.info("Initialization done.");
});