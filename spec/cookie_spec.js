describe('Cookie', function() {
  global.document = {};
  var Cookie = require('../cookie.js');

  describe('Cookie.get', function() {
    it('reads simple cookie', function() {
      document.cookie = 'ab=1; aa=2; ba=3; a=4';
      expect(Cookie.get('ab')).toBe('1');
      expect(Cookie.get('aa')).toBe('2');
      expect(Cookie.get('ba')).toBe('3');
      expect(Cookie.get('a')).toBe('4');
    });

    it('reads cookie with decodeURIComponent encoder by default', function() {
      var key = 'test#%@-)Тест';
      var value = 'test#%@-)Тест';
      document.cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value);
      expect(Cookie.get(key)).toBe(value);
    });

    it('reads cookies with custom converter', function() {
      document.cookie = 'a=' + encodeURIComponent(JSON.stringify({test: true}));
      var value = Cookie.get('a', JSON.parse);
      expect(value.test).toBe(true);
    });
  });

  describe('Cookie.fetch', function() {
    it('reads simple cookie', function() {
      document.cookie = 'a=1';
      expect(Cookie.fetch('a', '10')).toBe('1');
      expect(Cookie.fetch('b', '10')).toBe('10');
    });

    it('supports converter option', function() {
      document.cookie = 'a=abc';
      expect(
        Cookie.fetch('a', '10', function(value) { return value.toUpperCase(); })
      ).toBe('ABC');
    });
  });

  describe('Cookie.contains', function() {
    it('check simple cookie', function() {
      document.cookie = 'a=1';
      expect(Cookie.contains('a')).toBe(true);
      expect(Cookie.contains('b')).toBe(false);
    });
  });

  describe('Cookie.set', function() {
    it('set simple cookie', function() {
      Cookie.set('a', '1');
      expect(document.cookie).toBe('a=1');
    });

    it('set cookie with options', function() {
      Cookie.set('a', '1', {
        domain: 'example.com', path: '/example/path', expires: 'EXAMPLE_EXPIRE', secure: true
      });

      expect(document.cookie).toBe(
        'a=1; domain=example.com; path=/example/path; expires=EXAMPLE_EXPIRE; secure'
      );
    });

    it('set cookie with expire as Date', function() {
      Cookie.set('a', '1', { expires: new Date(Date.UTC(2015, 1, 1)) });
      expect(document.cookie).toBe('a=1; expires=Sun, 01 Feb 2015 00:00:00 GMT');
    });

    it('set cookie with expire as number of seconds', function() {
      Cookie.set('a', '1', { expires: 3600 });
      expect(document.cookie).toBe(
        'a=1; expires=' + new Date(new Date().getTime() + 3600 * 1000).toUTCString()
      );
    });

    it('set permanent cookie expire', function() {
      Cookie.set('a', '1', { expires: Infinity });
      expect(document.cookie).toBe('a=1; expires=Fri, 31 Dec 9999 23:59:59 GMT');
    });

    it('sanitize key and value with encodeURIComponent', function() {
      var key = 'test#%@-)Тест';
      var value = 'test#%@-)Тест';
      Cookie.set(key, value);
      expect(document.cookie).toBe(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    });
  });

  describe('Cookie.expire', function() {
    it('expire cookie', function() {
      document.cookie = 'a=1';
      expires = new Date();
      Cookie.expire('a');
      expect(document.cookie).toBe('a=; expires=Thu, 01 Jan 1970 00:00:00 GMT');
    });

    it('expire cookie with options', function() {
      document.cookie = 'a=1';
      expires = new Date();
      Cookie.expire('a', { path: '/', domain: 'example.com' });
      expect(document.cookie).toBe(
        'a=; domain=example.com; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      );
    });
  });

  describe('Cookie.raw option', function() {
    beforeAll(function() {
      Cookie.raw = true;
    });

    afterAll(function() {
      Cookie.raw = false;
    });

    it('reads cookie without encoding', function() {
      var key = 'test#%@-)Тест';
      var value = 'test#%@-)Тест';
      document.cookie =  key + '=' + value;
      expect(Cookie.get(key)).toBe(value);
    });

    it('set cookie without encoding', function() {
      var key = 'test#%@-)Тест';
      var value = 'test#%@-)Тест';
      Cookie.set(key, value);
      expect(document.cookie).toBe(key + '=' + value);
    });

    it('do block without encoding', function() {
      var key = 'test#%@-)Тест';
      var value = 'test#%@-)Тест';
      Cookie.raw = false;
      Cookie.withoutEncode(function() {
        Cookie.set(key, value);
      })
      expect(document.cookie).toBe(key + '=' + value);
      expect(Cookie.raw).toBe(false);
    });
  });
});
