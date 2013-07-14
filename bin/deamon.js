/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 09.07.13
 * Time: 22:49
 *
 */

var App = require('../lib/app'),
  os = require('os'),
  log = require('../lib/log').init(module, "Daemon"),
  cluster = require('cluster');

if (cluster.isMaster) {

  for (var i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }

  cluster.on('death', function(worker) {
    log.warn('worker ' + worker.pid + ' died');
  });
} else {

  App.init(function(err) {
    if (err) {
      log.error(err);
    }

    log.info("Initialization done.");
  });

}
