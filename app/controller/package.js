/**
 * Created with JetBrains WebStorm.
 * User: riegel
 * Date: 10.07.13
 * Time: 14:08
 * To change this template use File | Settings | File Templates.
 */

var User = require('../../lib/models/user'),
  Package = require('../../lib/models/package'),
  Revision = require('../../lib/models/revision'),
  log = require('../../lib/log').init(module, "PackageController"),
  async = require('async'),
  fs = require('fs'),
  crypto = require('crypto'),
  regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  regexAscii = /^[a-zA-Z0-9._-]+$/,
  regexSemver = /^v{0,1}([0-9]+\.{0,1}){1,3}(\-([a-z0-9]+\.{0,1})+){0,1}(\+(build\.{0,1}){0,1}([a-z0-9]+\.{0,1}){0,}){0,1}$/;

var validators = {
  language: function (params, cb) {
    if (params.hasOwnProperty('language')
      && ['py'].indexOf(params.language) !== -1) {

      return cb(null, params.language);
    }
    return cb("ErrorInvalidLanguage");
  },
  name: function (params, cb) {
    if (params.hasOwnProperty('name')) {
      return cb(null, params.name.toLowerCase());
    }
    return cb("ErrorInvalidName");
  },
  copyright: function (params, cb) {
    if (params.hasOwnProperty('copyright')) {
      return cb(null, params.copyright);
    }
    return cb(null, "");
  },
  owner: function (params, cb) {
    if (params.hasOwnProperty('owner')) {
      return cb(null, params.owner);
    }
    return cb("ErrorInvalidOwner");
  },
  engines: function (params, cb) {
    if (params.hasOwnProperty('engines')
      && 'object' === typeof params.engines) {
      return cb(null, params.engines);
    }
    return cb(null, {});
  },
  licence: function (params, cb) {
    if (params.hasOwnProperty('licence')
      && regexAscii.exec(params.licence)) {
      return cb(null, params.licence);
    }
    return cb(null, "");
  },
  public: function (params, cb) {
    if (params.hasOwnProperty('public')
      && (true === params.public
      || false === params.public)) {
      return cb(null, params.public);
    }
    return cb(null, true);
  },
  dependencies: function (params, cb) {
    if (params.hasOwnProperty('dependencies')
      && 'object' === typeof params.dependencies) {
      return cb(null, params.dependencies);
    }
    return cb(null, {});
  },
  contributors: function (params, cb) {
    if (params.hasOwnProperty('contributors')
      && 'object' === typeof params.contributors) {
      return cb(null, params.contributors);
    }
    return cb(null, {});
  },
  binaries: function (params, cb) {
    if (params.hasOwnProperty('binaries')
      && 'object' === typeof params.binaries) {
      return cb(null, params.binaries);
    }
    return cb(null, {});
  },
  prefer_global: function (params, cb) {
    if (params.hasOwnProperty('prefer_global')
      && (true === params.prefer_global
      || false === params.prefer_global)) {
      return cb(null, params.prefer_global);
    }
    return cb(null, false);
  },
  version: function (params, cb) {
    if (params.hasOwnProperty('version')
      && regexSemver.exec(params.version)) {
      return cb(null, (params.version.charAt(0) === 'v') ? params.version.substr(1) : params.version);
    }
    return cb("ErrorInvalidVersion");
  },
  data: function(params, cb) {

    var parts = params.data.split('::'),
      filename = parts[0],
      checksum = parts[1],
      b64Data = parts[2],
      filePath = '/tmp/' + filename;



    var buf = new Buffer(b64Data, 'base64');

    fs.writeFile(filePath, buf, function(err) {
      if (err) {
        log.error(err);
        return;
      }

      var md5sum = crypto.createHash('md5');
      var s = fs.ReadStream(filePath);
      s.on('data', function(d) {
        md5sum.update(d);
      });

      s.on('end', function() {

        fs.unlink(filePath);

        var gotChecksum = md5sum.digest('hex');

        if (gotChecksum == checksum) {
          return cb(null, {filename:filename,checksum:checksum,content:b64Data});
        }
        cb("ErrorDataChecksumMismatch");
      });
    });

  }
};

exports.get = function (req, res, next) {

};

exports.putVerify = function (req, res, next) {
  var user = req.user;

  if (!user.isValid()) {
    res.send(401, {code:"AuthenticationError",message:"Login required."});
    return next();
  }

  async.parallel({
    language: function(cb) { validators.language(req.params, cb) },
    name: function(cb) { validators.name(req.params, cb) },
    copyright: function(cb) { validators.copyright(req.params, cb) },
    owner: function(cb) { validators.owner(req.params, cb) },
    engines: function(cb) { validators.engines(req.params, cb) },
    licence: function(cb) { validators.licence(req.params, cb) },
    public: function(cb) { validators.public(req.params, cb) },
    dependencies: function(cb) { validators.dependencies(req.params, cb) },
    contributors: function(cb) { validators.contributors(req.params, cb) },
    binaries: function(cb) { validators.binaries(req.params, cb) },
    prefer_global: function(cb) { validators.prefer_global(req.params, cb) },
    version: function(cb) { validators.version(req.params, cb) }
  }, function (err, values) {

    if (err) {
      res.send(400, {"code": "UserError", "message": err});
      return next();
    }

    Package.findOne({name: values.name}, function (err, pckg) {
      if (err) {
        log.error(err);
        res.send(500, {"code": "InternalError", "message": err});
        return next();
      }

      if (pckg.isValid()) {
        // Update/New Version

        // TODO: Check version, must be greater than current

        if (pckg.user_id() !== user._id()) {
          res.send(409, {"code": "DuplicateEntryError", "message": "Package named '" + values.name + "' already exists."});
          return next();
        }

      }

      //values.user_id = user._id();

      res.send(200, {code: "OK"});
      return next();
    });


  });

};

exports.put = function (req, res, next) {

  var user = req.user;

  if (!user.isValid()) {
    res.send(401, {code:"AuthenticationError",message:"Login required."});
    return next();
  }

  async.parallel({
    language: function(cb) { validators.language(req.params, cb) },
    name: function(cb) { validators.name(req.params, cb) },
    copyright: function(cb) { validators.copyright(req.params, cb) },
    owner: function(cb) { validators.owner(req.params, cb) },
    engines: function(cb) { validators.engines(req.params, cb) },
    licence: function(cb) { validators.licence(req.params, cb) },
    public: function(cb) { validators.public(req.params, cb) },
    dependencies: function(cb) { validators.dependencies(req.params, cb) },
    contributors: function(cb) { validators.contributors(req.params, cb) },
    binaries: function(cb) { validators.binaries(req.params, cb) },
    prefer_global: function(cb) { validators.prefer_global(req.params, cb) },
    version: function(cb) { validators.version(req.params, cb) },
    data: function(cb) { validators.data(req.params, cb) }
  }, function (err, values) {

    if (err) {
      res.send(400, {"code": "UserError", "message": err});
      return next();
    }

    Package.findOne({name: values.name}, function (err, pckg) {
      if (err) {
        log.error(err);
        res.send(500, {"code": "InternalError", "message": err});
        return next();
      }

      if (pckg.isValid()) {
        // Update/New Version

        // TODO: Check version, must be greater than current

        if (pckg.user_id() !== user._id()) {
          res.send(409, {"code": "DuplicateEntryError", "message": "Package named '" + values.name + "' already exists."});
          return next();
        }

      }

      // TODO: Save file to local repo and store download url

      //values.user_id = user._id();

      res.send(200, {code: "OK"});
      return next();
    });


  });


};

exports.del = function (req, res, next) {

};

