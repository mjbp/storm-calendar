(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _component = require('./libs/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {
    _component2.default.init('.js-calendar');
}];

if ('addEventListener' in window) window.addEventListener('DOMContentLoaded', function () {
    onDOMContentLoadedTasks.forEach(function (fn) {
        return fn();
    });
});

},{"./libs/component":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defaults = require('./lib/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _componentPrototype = require('./lib/component-prototype');

var _componentPrototype2 = _interopRequireDefault(_componentPrototype);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var init = function init(sel, opts) {
	var els = [].slice.call(document.querySelectorAll(sel));
	//let els = Array.from(document.querySelectorAll(sel));

	if (!els.length) return console.warn('Calendar not initialised, no augmentable elements found');

	return els.map(function (el) {
		return Object.assign(Object.create(_componentPrototype2.default), {
			node: el,
			startDate: el.getAttribute('data-start-date') ? new Date(el.getAttribute('data-start-date')) : false,
			endDate: el.getAttribute('data-end-date') ? new Date(el.getAttribute('data-end-date')) : false,
			settings: Object.assign({}, _defaults2.default, opts)
		}).init();
	});
};

exports.default = { init: init };

},{"./lib/component-prototype":3,"./lib/defaults":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _utils = require('./utils');

var _monthModel = require('./month-model');

var _monthModel2 = _interopRequireDefault(_monthModel);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = {
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

		console.log((0, _utils.diffDays)(this.startDate, this.endDate));

		var totalDays = (0, _utils.diffDays)(this.startDate, this.endDate),
		    utilityDate = new Date(this.startDate.getTime());

		for (var i = 1; i <= totalDays;) {

			console.log((0, _monthModel2.default)(this.startDate.getFullYear(), this.startDate.getMonth()));
		}return this;
	}
};

},{"./month-model":5,"./utils":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	callback: null
};

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (year, month) {
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

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var diffDays = exports.diffDays = function diffDays(a, b) {
	var MS_PER_DAY = 1000 * 60 * 60 * 24;
	// Discard the time and time-zone information.
	var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()),
	    utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

	return Math.floor((utc2 - utc1) / MS_PER_DAY);
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL21vbnRoLW1vZGVsLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ25DO3dCQUFBLEFBQVMsS0FBVCxBQUFjLEFBQ2pCO0FBRkQsQUFBZ0MsQ0FBQTs7QUFJaEMsSUFBRyxzQkFBSCxBQUF5QixlQUFRLEFBQU8saUJBQVAsQUFBd0Isb0JBQW9CLFlBQU0sQUFBRTs0QkFBQSxBQUF3QixRQUFRLFVBQUEsQUFBQyxJQUFEO2VBQUEsQUFBUTtBQUF4QyxBQUFnRDtBQUFwRyxDQUFBOzs7Ozs7Ozs7QUNOakM7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNLE9BQU8sU0FBUCxBQUFPLEtBQUEsQUFBQyxLQUFELEFBQU0sTUFBUyxBQUMzQjtLQUFJLE1BQU0sR0FBQSxBQUFHLE1BQUgsQUFBUyxLQUFLLFNBQUEsQUFBUyxpQkFBakMsQUFBVSxBQUFjLEFBQTBCLEFBQy9DO0FBRUg7O0tBQUcsQ0FBQyxJQUFKLEFBQVEsUUFBUSxPQUFPLFFBQUEsQUFBUSxLQUFmLEFBQU8sQUFBYSxBQUVwQzs7WUFBTyxBQUFJLElBQUksVUFBQSxBQUFDLElBQU8sQUFDdEI7Z0JBQU8sQUFBTyxPQUFPLE9BQUEsQUFBTyw0QkFBckI7U0FBaUQsQUFDakQsQUFDTjtjQUFXLEdBQUEsQUFBRyxhQUFILEFBQWdCLHFCQUFx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QTBCLEFBQUUsWUFBWSxFQURoRCxBQUNRLEFBQXdDLEFBQUUsQUFFaEQ7O1FBQU8sS0FBQSxBQUFLLE1BQU0sQ0FBQyxPQUFELEFBQVEsUUFBMUIsQUFBTyxBQUEyQixBQUNwQztBQVBNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBDYWxlbmRhciBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuICAgIENhbGVuZGFyLmluaXQoJy5qcy1jYWxlbmRhcicpO1xufV07XG4gICAgXG5pZignYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaCgoZm4pID0+IGZuKCkpOyB9KTsiLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcbiAgICAvL2xldCBlbHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSk7XG5cblx0aWYoIWVscy5sZW5ndGgpIHJldHVybiBjb25zb2xlLndhcm4oJ0NhbGVuZGFyIG5vdCBpbml0aWFsaXNlZCwgbm8gYXVnbWVudGFibGUgZWxlbWVudHMgZm91bmQnKTtcbiAgICBcblx0cmV0dXJuIGVscy5tYXAoKGVsKSA9PiB7XG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0XHRub2RlOiBlbCxcblx0XHRcdHN0YXJ0RGF0ZTogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN0YXJ0LWRhdGUnKSA/IG5ldyBEYXRlKGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zdGFydC1kYXRlJykpIDogZmFsc2UsXG5cdFx0XHRlbmREYXRlOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZW5kLWRhdGUnKSA/IG5ldyBEYXRlKGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1lbmQtZGF0ZScpKSA6IGZhbHNlLFxuXHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRzKVxuXHRcdH0pLmluaXQoKTtcblx0fSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJpbXBvcnQgeyBkaWZmRGF5cyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IG1vbnRoTW9kZWwgZnJvbSAnLi9tb250aC1tb2RlbCc7XG5cbmV4cG9ydCBkZWZhdWx0e1xuXHRpbml0KCkge1xuXHRcdC8qXG5cdFx0XHRtb250aFZpZXdzID0gW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bW9kZWw6IG1vbnRoTW9kZWwoX0RBWV8uZ2V0RnVsbFllYXIoKSwgX0RBWV9nZXRNb250aCgpKSxcblx0XHRcdFx0XHRtb250aFRpdGxlOiAnJyxcblx0XHRcdFx0XHR5ZWFyVGl0bGU6ICcnLFxuXHRcdFx0XHRcdGFjdGl2ZTogW3gsIHgsIHhdXG5cdFx0XHRcdH1cblx0XHRcdF07XG5cblxuXHRcdCovXG5cblx0XHRjb25zb2xlLmxvZyhkaWZmRGF5cyh0aGlzLnN0YXJ0RGF0ZSwgdGhpcy5lbmREYXRlKSk7XG5cblx0XHRsZXQgdG90YWxEYXlzID0gZGlmZkRheXModGhpcy5zdGFydERhdGUsIHRoaXMuZW5kRGF0ZSksXG5cdFx0XHR1dGlsaXR5RGF0ZSA9IG5ldyBEYXRlKHRoaXMuc3RhcnREYXRlLmdldFRpbWUoKSk7XG5cdFx0XG5cdFx0Zm9yIChsZXQgaSA9IDE7IGkgPD0gdG90YWxEYXlzOyApXG5cblxuXHRcdGNvbnNvbGUubG9nKG1vbnRoTW9kZWwodGhpcy5zdGFydERhdGUuZ2V0RnVsbFllYXIoKSwgdGhpcy5zdGFydERhdGUuZ2V0TW9udGgoKSkpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuXHRjYWxsYmFjazogbnVsbFxufTsiLCJleHBvcnQgZGVmYXVsdCAoeWVhciwgbW9udGgpID0+IHtcbiAgICBsZXQgdGhlTW9udGggPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCArIDEsIDApLFxuICAgICAgICB0b3RhbERheXMgPSB0aGVNb250aC5nZXREYXRlKCksXG4gICAgICAgIGVuZERheSA9IHRoZU1vbnRoLmdldERheSgpLFxuICAgICAgICBzdGFydERheSxcbiAgICAgICAgcHJldk1vbnRoU3RhcnREYXkgPSBmYWxzZSxcbiAgICAgICAgcHJldk1vbnRoID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDApLFxuICAgICAgICBwcmV2TW9udGhFbmREYXkgPSBwcmV2TW9udGguZ2V0RGF0ZSgpLFxuICAgICAgICBvdXRwdXQgPSBbXTtcblxuICAgIHRoZU1vbnRoLnNldERhdGUoMSk7XG4gICAgc3RhcnREYXkgPSB0aGVNb250aC5nZXREYXkoKTtcbiAgICBcbiAgICBpZihzdGFydERheSAhPT0gMSkge1xuICAgICAgICBpZihzdGFydERheSA9PT0gMCkgcHJldk1vbnRoU3RhcnREYXkgPSBwcmV2TW9udGguZ2V0RGF0ZSgpIC0gNTtcbiAgICAgICAgZWxzZSBwcmV2TW9udGhTdGFydERheSA9IHByZXZNb250aC5nZXREYXRlKCkgLSAoc3RhcnREYXkgLSAyKTtcbiAgICB9XG5cbiAgICBpZihwcmV2TW9udGhTdGFydERheSl7XG4gICAgICAgIHdoaWxlKHByZXZNb250aFN0YXJ0RGF5IDw9IHByZXZNb250aEVuZERheSl7XG4gICAgICAgICAgICBvdXRwdXQucHVzaChwcmV2TW9udGhTdGFydERheSk7XG4gICAgICAgICAgICBwcmV2TW9udGhTdGFydERheSsrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvcihsZXQgaSA9IDE7IGkgPD0gdG90YWxEYXlzOyBpKyspIG91dHB1dC5wdXNoKGkpO1xuXG4gICAgaWYoZW5kRGF5ICE9PSAwKSBmb3IobGV0IGkgPSAxOyBpIDw9ICg3IC0gZW5kRGF5KTsgaSsrKSBvdXRwdXQucHVzaChpKTtcblxuICAgIHJldHVybiBvdXRwdXQ7XG59OyIsImV4cG9ydCBjb25zdCBkaWZmRGF5cyA9IChhLCBiKSA9PiB7XG5cdGNvbnN0IE1TX1BFUl9EQVkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuXHQvLyBEaXNjYXJkIHRoZSB0aW1lIGFuZCB0aW1lLXpvbmUgaW5mb3JtYXRpb24uXG5cdGxldCB1dGMxID0gRGF0ZS5VVEMoYS5nZXRGdWxsWWVhcigpLCBhLmdldE1vbnRoKCksIGEuZ2V0RGF0ZSgpKSxcblx0XHR1dGMyID0gRGF0ZS5VVEMoYi5nZXRGdWxsWWVhcigpLCBiLmdldE1vbnRoKCksIGIuZ2V0RGF0ZSgpKTtcblxuICBcdHJldHVybiBNYXRoLmZsb29yKCh1dGMyIC0gdXRjMSkgLyBNU19QRVJfREFZKTtcbn07Il19
