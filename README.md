# Storm Calendar

<!-- [![Build Status](https://travis-ci.org/mjbp/storm-component-boilerplate.svg?branch=master)](https://travis-ci.org/mjbp/storm-component-boilerplate)
[![codecov.io](http://codecov.io/github/mjbp/storm-component-boilerplate/coverage.svg?branch=master)](http://codecov.io/github/mjbp/storm-component-boilerplate?branch=master)
[![npm version](https://badge.fury.io/js/storm-component-boilerplate.svg)](https://badge.fury.io/js/storm-component-boilerplate) -->



## Example
<!-- [https://mjbp.github.io/storm-component-boilerplate](https://mjbp.github.io/storm-component-boilerplate) -->


## Usage
HTML
```
<div class="js-calendar" data-start-date="2017-11-30"></div>
```

JS
```
npm i -S storm-calendar
```
either using es6 import
```
import Calendar from 'storm-calendar';

Calendar.init('.js-calendar');
```
asynchronous browser loading (use the .standalone version in the /dist folder) using the global name (Storm + capitalised package name)
```
import Load from 'storm-load';

Load('{{path}}/storm-calendar.standalone.js')
    .then(() => {
        StormCalendar.init('.js-calendar');
    });
```


## Tests
```
npm run test
```

## Browser support
This is module has both es6 and es5 distributions. The es6 version should be used in a workflow that transpiles.

The es5 version depends upon Object.assign, element.classList, and Promises so all evergreen browsers are supported out of the box, ie9+ is supported with polyfills. ie8+ will work with even more polyfills for Array functions and eventListeners.

## Dependencies
None

## License
MIT
