/**
 * Created with JetBrains WebStorm.
 * User: riegel
 * Date: 10.07.13
 * Time: 14:08
 * To change this template use File | Settings | File Templates.
 */

exports.init = function(app, callback) {

  var controllerPackage = require('./controller/package'),
    controllerUser = require('./controller/user'),
    controllerCompany = require('./controller/company');


  app.get('/user/:email', controllerUser.get);
  app.put('/user', controllerUser.put);
  app.del('/user/:email', controllerUser.del);

  app.get('/:language/package/:name', controllerPackage.get);
  app.put('/:language/package', controllerPackage.put);
  app.del('/:language/package/:name', controllerPackage.del);

  callback();

};