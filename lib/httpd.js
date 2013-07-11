/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 09.07.13
 * Time: 22:43
 *
 */

var cluster = require('cluster'),
  os = require('os'),
  restify = require('restify'),
  router = require('../app/router'),
  middleware = require('./middleware'),
  log = require('./log').init(module, "HTTPd");


exports.init = function(callback) {
  if (cluster.isMaster) {

    for (var i = 0; i < os.cpus().length; i++) {
      cluster.fork();
    }

    cluster.on('death', function(worker) {
      log.warn('worker ' + worker.pid + ' died');
    });
  } else {

    var server = restify.createServer();

    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.authorizationParser());
    //server.use(restify.dateParser());
    server.use(restify.queryParser({ mapParams : true }));
    //server.use(restify.urlEncodedBodyParser());
    server.use(restify.bodyParser({ mapParams : true }));
    /*server.use(restify.throttle({
      burst : 100,
      rate : 50,
      ip : true
    }));*/
    server.use(middleware.auth());

    router.init(server, function() {
      server.listen(9080, function() {
        log.info('Listening on: %s', server.url);
        callback();
      });
    });

  }
};