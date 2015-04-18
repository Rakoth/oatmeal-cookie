(function(definition) {
  if (typeof module != 'undefined') {
    module.exports = definition();
  } else if (typeof define == 'function' && typeof define.amd == 'object') {
    define(definition);
  } else {
    this.Cookie = definition(this.Cookie);
  }
}(function(ConflictedObject) {
  // NOTE: fastest working solution from http://jsperf.com/cookie-parsing
  function lawnchair(name, cookieString) {
    name += '=';
    var cookies = cookieString.split(';');
    var cookie;

    for (var i = 0; i < cookies.length; i++) {
      cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length);
      }
    }
  }

  function parseExpires(value) {
    switch (true) {
      case (Infinity === value):
        return 'Fri, 31 Dec 9999 23:59:59 GMT';
      case (typeof value === 'number' || value instanceof Number):
        return new Date(new Date().getTime() + value * 1000).toUTCString();
      case (typeof value === 'string' || value instanceof String):
        return value;
      case ('toUTCString' in value && !isNaN(value.getTime())):
        return value.toUTCString();
    }
  }

  function buildCookieString(name, value, options) {
    var result = name + '=' + value;
    result += options.domain ? '; domain=' + options.domain : '';
    result += options.path ? '; path=' + options.path : '';
    result += options.expires ? '; expires=' + parseExpires(options.expires) : '';
    result += options.secure ? '; secure' : '';
    return result;
  }

  function raw(value) { return value; }

  return {
    raw: false,
    _encoder: function(value) {
      return this.raw ? value : encodeURIComponent(value);
    },
    _decoder: function(value) {
      return this.raw ? value : decodeURIComponent(value);
    },
    get: function(name, converter) {
      converter = converter || raw;
      var value = lawnchair(this._encoder(name), document.cookie);
      if (value !== undefined) {
        return converter(this._decoder(value));
      }
    },
    fetch: function(name, defaultValue, converter) {
      var result = this.get(name, converter);
      return result === undefined ? defaultValue : result;
    },
    contains: function(name) {
      return !!this.get(name, function(_value){ return true; });
    },
    set: function(name, value, options) {
      document.cookie = buildCookieString(
        this._encoder(name), this._encoder(value), options || {}
      );
    },
    expire: function(name, options) {
      options = options || {};
      this.set(name, '', {
        expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
        path: options.path,
        domain: options.domain
      });
    },
    withoutEncode: function(block) {
      var prevRaw = this.raw;
      this.raw = true;
      try {
        return block();
      } finally {
        this.raw = prevRaw;
      }
    },
    noConflict: function() {
      window.Cookie = ConflictedObject;
      return this;
    }
  };
}));
