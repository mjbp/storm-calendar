/**
 * @name storm-calendar: 
 * @version 0.1.0: Thu, 23 Nov 2017 10:56:16 GMT
 * @author stormid
 * @license MIT
 */
(function(root, factory) {
   var mod = {
       exports: {}
   };
   if (typeof exports !== 'undefined'){
       mod.exports = exports
       factory(mod.exports)
       module.exports = mod.exports.default
   } else {
       factory(mod.exports);
       root.gulpWrapUmd = mod.exports.default
   }

}(this, function(exports) {
   'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var defaults = {
	callback: null
};

var diffDays = function diffDays(a, b) {
	var MS_PER_DAY = 1000 * 60 * 60 * 24;
	// Discard the time and time-zone information.
	var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()),
	    utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

	return Math.floor((utc2 - utc1) / MS_PER_DAY);
};

var monthModel = function monthModel(year, month) {
	var theMonth = new Date(year, month + 1, 0),
	    totalDays = theMonth.getDate(),
	    endDay = theMonth.getDay(),
	    startDay = void 0,
	    prevMonthStartDay = false,
	    prevMonth = new Date(year, month, 0),
	    prevMonthEndDay = prevMonth.getDate(),
	    output = [];

	theMonth.setDate(1);
	startDay = theMonth.getDay();

	if (startDay !== 1) {
		if (startDay === 0) prevMonthStartDay = prevMonth.getDate() - 5;else prevMonthStartDay = prevMonth.getDate() - (startDay - 2);
	}

	if (prevMonthStartDay) {
		while (prevMonthStartDay <= prevMonthEndDay) {
			output.push(prevMonthStartDay);
			prevMonthStartDay++;
		}
	}
	for (var i = 1; i <= totalDays; i++) {
		output.push(i);
	}if (endDay !== 0) for (var _i = 1; _i <= 7 - endDay; _i++) {
		output.push(_i);
	}return output;
};

var componentPrototype = {
	init: function init() {
		/*
  	monthViews = [
  		{
  			model: monthModel(_DAY_.getFullYear(), _DAY_getMonth()),
  			monthTitle: '',
  			yearTitle: '',
  			active: [x, x, x]
  		}
  	];
  		*/

		console.log(diffDays(this.startDate, this.endDate));

		var totalDays = diffDays(this.startDate, this.endDate);

		for (var i = 1; i <= totalDays;) {

			console.log(monthModel(this.startDate.getFullYear(), this.startDate.getMonth()));
		}return this;
	}
};

var init = function init(sel, opts) {
	var els = [].slice.call(document.querySelectorAll(sel));
	//let els = Array.from(document.querySelectorAll(sel));

	if (!els.length) return console.warn('Calendar not initialised, no augmentable elements found');

	return els.map(function (el) {
		return Object.assign(Object.create(componentPrototype), {
			node: el,
			startDate: el.getAttribute('data-start-date') ? new Date(el.getAttribute('data-start-date')) : false,
			endDate: el.getAttribute('data-end-date') ? new Date(el.getAttribute('data-end-date')) : false,
			settings: Object.assign({}, defaults, opts)
		}).init();
	});
};

var index = { init: init };

exports.default = index;;
}));
