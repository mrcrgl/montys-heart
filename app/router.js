/**
 * Created with JetBrains WebStorm.
 * User: riegel
 * Date: 10.07.13
 * Time: 14:08
 * To change this template use File | Settings | File Templates.
 */

exports.init = function(app, callback) {

  var controllerProject = require('./controller/project'),
    controllerUser = require('./controller/user'),
    controllerCompany = require('./controller/company');


  app.get('/user/:email', controllerUser.get);
  app.put('/user', controllerUser.put);
  app.del('/user/:email', controllerUser.del);

  callback();

};