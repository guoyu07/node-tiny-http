// Generated by CoffeeScript 1.10.0
(function() {
  var Fs, Mime, register, result,
    slice = [].slice;

  Fs = require('fs');

  Mime = require('mime');

  result = {};

  register = function(name, fn) {
    return result[name] = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return function(request, response) {
        return fn.apply({
          request: request,
          response: response
        }, args);
      };
    };
  };

  register('file', function(file) {
    return Fs.access(file, Fs.R_OK, (function(_this) {
      return function(err) {
        var mime;
        if (err != null) {
          return _this.response.status(200).content('File not found.');
        }
        mime = Mime.lookup(file);
        return _this.response.content(function() {
          var stream;
          stream = Fs.createReadStream(file);
          return stream.pipe(this.res);
        });
      };
    })(this));
  });

  register('blank', function() {
    return this.response.content('');
  });

  register('redirect', function(url, permanently) {
    if (permanently == null) {
      permanently = false;
    }
    return this.response.status(permanently ? 301 : 302).header('location', url);
  });

  register('back', function() {
    var url;
    url = this.request.header('referer', '/');
    return this.response.status(302).header('location', url);
  });

  register('notFound', function() {
    return this.response.status(404).content('File not found.');
  });

  register('json', function(data) {
    return this.response.header('content-type', 'application/json; charset=utf-8').content(JSON.stringify(data));
  });

  register('content', function(content, type) {
    if (type == null) {
      type = 'text/html';
    }
    return this.response.header('content-type', type + '; charset=utf-8').content(content);
  });

  module.exports = {
    result: result,
    register: register
  };

}).call(this);
