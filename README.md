# Oatmeal Cookie

A lightweight cookie manager for browser.

## Why another cookie manager?

* No runtime dependencies
* Customizable cookies sanitizer (encodeURIComponent by default)
* Flexible api (see Usage)
* Bower and npm packages

## Usage

```js
var Cookie = require('oatmeal-cookie/cookie.js');

// Read
Cookie.get('key'); // get cookie by key
Cookie.get('key', JSON.parse); // parse json cookie
Cookie.fetch('key', 'defaultValue'); // will return 'defaultValue' if no such cookie
Cookie.fetch('key', 'defaultValue', JSON.parse); // parse json if cookie present
Cookie.contains('key'); // true or false

// Write
Cookie.set('key', 'value');
Cookie.set('key', 'value', {
  domain: 'example.com', // default to current domain
  path: '/', // default to current path
  expires: new Date(2020, 1, 1), // default to session cookie
  secure: true // default to false
});
Cookie.set('key', 'value', { expires: Infinity }); // permanent
Cookie.set('key', 'value', { expires: 600 }); // 10 minutes
Cookie.set('key', 'value', { expires: 'Sat, 18 Apr 2015 00:00:00 GMT' }); // valid date string
Cookie.set('key', 'value', { expires: new Date(2015, 3, 18) }); // date object

// Expire
Cookie.expire('key');
Cookie.expire('key', { domain: 'example.com', path: '/' });

// Change cookie escaping functions
Cookie.raw = true;
Cookie.get('key', unescape);

// Or for one operation only
Cookie.withoutEncode(function() {
  return Cookie.get('key', unescape);
});
```

## Development

```bash
npm install
npm test
```

## Contributing

Pull-requests are welcome.
