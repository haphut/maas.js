# maas.js

A JavaScript library for the browser to interact with [maas-server](https://github.com/okffi/maas-server).

Written in ES6, compiled with traceur and browserify.


## Features

- A Promise-based interface to communicate with maas-server.
- By request, another Promise-based interface to communicate with maas-server at a slightly lower level.
- Journey ID generation.
- Appendable array database that synchronizes stored data from memory into LocalStorage every t seconds or every n stored objects.


## Installation

```sh
npm install -g gulp
npm install lodash-cli
./build_lodash.sh
npm install
```

The two extra steps for lodash create a custom, minified build.
The downside of this approach is that the lodash functions used in the code must be diligently updated in `build_lodash.sh`, by hand.


## Use

Browserify for inclusion in the browser.
```sh
gulp
```

Lint source code.
```sh
gulp lint
```

Run tests. Currently there are only a few tests! Shame on me.
```sh
gulp test
```

Build ES6 into ES5.
```sh
gulp build
```
