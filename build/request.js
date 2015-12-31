// Generated by CoffeeScript 1.10.0
(function() {
  var Cookie, Form, QueryString, Request, Url;

  Form = require('formidable');

  Url = require('url');

  Cookie = require('cookie');

  QueryString = require('querystring');

  Request = (function() {
    var mergeParams, options;

    options = {};

    mergeParams = function(source, target) {
      var k, results, v;
      results = [];
      for (k in target) {
        v = target[k];
        results.push(source[k] = v);
      }
      return results;
    };

    function Request(req, opt, cb) {
      var form, host, matched, parts;
      this.req = req;
      parts = Url.parse(this.req.url, true);
      options = opt;
      this.method = this.req.method.toUpperCase();
      this.uri = parts.href;
      this.path = parts.pathname != null ? parts.pathname : '/';
      this.port = this.req.socket.remotePort;
      this.agent = this.header('user-agent', '');
      this.httpVersion = this.req.httpVersion;
      host = this.header('host', '');
      matched = host.match(/^\s*([_0-9a-z-\.]+)/);
      this.host = matched ? matched[1] : null;
      this.$cookies = Cookie.parse(this.header('cookie', ''));
      this.$params = parts.query;
      this.$files = {};
      this.$ip = null;
      if (this.method === 'POST') {
        form = new Form.IncomingForm;
        form.parse(this.req, (function(_this) {
          return function(err, fields, files) {
            if (err != null) {
              return cb(_this);
            }
            mergeParams(_this.$params, fields);
            _this.$files = files;
            return cb(_this);
          };
        })(this));
      } else {
        cb(this);
      }
    }

    Request.prototype.ip = function() {
      var defaults, i, key, len, val;
      defaults = ['x-real-ip', 'x-forwarded-for', 'client-ip'];
      if (this.$ip == null) {
        if (options.ipHeader != null) {
          this.$ip = this.header(options.ipHeader, this.req.socket.remoteAddress);
        } else {
          for (i = 0, len = defaults.length; i < len; i++) {
            key = defaults[i];
            val = this.header(key);
            if (val != null) {
              this.$ip = val;
              break;
            }
          }
          this.$ip = this.req.socket.remoteAddress;
        }
      }
      return this.$ip;
    };

    Request.prototype.header = function(key, val) {
      if (val == null) {
        val = void 0;
      }
      key = key.toLowerCase();
      if (this.req.headers[key]) {
        return this.req.headers[key];
      } else {
        return val;
      }
    };

    Request.prototype.cookie = function(key, val) {
      if (val == null) {
        val = void 0;
      }
      if (this.$cookies[key] != null) {
        return this.$cookies[key];
      } else {
        return val;
      }
    };

    Request.prototype.is = function(query) {
      var k, required, v, val;
      required = QueryString.parse(query);
      for (k in required) {
        v = required[k];
        if (v.length > 0) {
          if (v !== this.get(k)) {
            return false;
          }
        } else {
          val = this.get(k);
          if (val === void 0 || val.length === 0) {
            return false;
          }
        }
      }
      return true;
    };

    Request.prototype.set = function(key, val) {
      if (val == null) {
        val = null;
      }
      if (val === null && key instanceof Object) {
        return mergeParams(this.$params, key);
      } else {
        return this.$params[key] = val;
      }
    };

    Request.prototype.get = function(key, defaults) {
      if (defaults == null) {
        defaults = void 0;
      }
      if (this.$params[key] != null) {
        return this.$params[key];
      } else {
        return defaults;
      }
    };

    Request.prototype.file = function(key) {
      if (this.$files[key] != null) {
        return this.$files[key];
      } else {
        return void 0;
      }
    };

    return Request;

  })();

  module.exports = Request;

}).call(this);
