/**
 * @author: Marc Riegel <mail@marclab.de>
 * Date: 09.07.13
 * Time: 22:43
 *
 */

var cluster = require('cluster'),
  restify = require('restify');


exports.init = function(callback) {
  if (cluster.isMaster) {

    for (var i = 0; i < 8; i++) {
      cluster.fork();
    }

    cluster.on('death', function(worker) {
      console.log('worker ' + worker.pid + ' died');
    });
  } else {

    var server = restify.createServer();

    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    server.get('/event',function handle(req, res, next){
      res.end("hello world\n");
    });
    server.listen(9080, function() {
      callback();
      console.log('listening: %s', server.url);
    });
  }
};