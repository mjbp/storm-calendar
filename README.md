# Storm Calendar

[![Build Status](https://travis-ci.org/mjbp/storm-calendar.svg?branch=master)](https://travis-ci.org/mjbp/storm-calendar)
[![codecov.io](http://codecov.io/github/mjbp/storm-calendar/coverage.svg?branch=master)](http://codecov.io/github/mjbp/storm-calendar?branch=master)
[![npm version](https://badge.fury.io/js/storm-calendar.svg)](https://badge.fury.io/js/storm-calendar)

Small module to display a navigable monthly calendar view across a range of dates


## Example
[https://mjbp.github.io/storm-calendar](https://mjbp.github.io/storm-calendar)


## Usage
HTML
```
<div class="js-calendar" data-start-date="2017-11-30" data-end-date="2018-01-01"></div>
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

The es5 version depends upon Object.assign, element.classList so all evergreen browsers are supported out of the box, ie9+ is supported with polyfills. ie8+ will work with even more polyfills for Array functions and eventListeners.

## Dependencies
None

## License
MIT
