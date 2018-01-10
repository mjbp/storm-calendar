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
			endDate: el.getAttribute('data-end-date') ? new Date(el.getAttribute('data-end-date')) : new Date(el.getAttribute('data-start-date')),
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

var _templates = require('./templates');

var TRIGGER_EVENTS = ['click', 'keydown'],
    TRIGGER_KEYCODES = [13, 32];

exports.default = {
	init: function init() {
		var _this = this;

		var totalDays = (0, _utils.diffDays)(this.startDate, this.endDate),
		    eventDateObjects = [];

		//normalise hour for timestamp comparison
		this.startDate.setHours(0, 0, 0, 0);
		this.endDate.setHours(0, 0, 0, 0);

		for (var i = 0; i <= totalDays; i++) {
			eventDateObjects.push((0, _utils.addDays)(this.startDate, i));
		} //Array.apply(null, new Array(totalDays + 1)).map((item, i) => addDays(this.startDate, i));s

		this.data = eventDateObjects.reduce(function (acc, curr) {
			var existingMonthIndex = acc.monthViews.length ? acc.monthViews.reduce((0, _utils.monthViewExists)(curr), -1) : false;
			if (!acc.monthViews.length || existingMonthIndex === -1) acc.monthViews.push((0, _utils.monthViewFactory)(curr, { min: _this.startDate.getTime(), max: _this.endDate.getTime() }));
			return acc;
		}, { monthViews: [] });

		console.log(this.data);
		eventDateObjects = [];
		this.renderView(0);

		return this;
	},
	renderView: function renderView(i) {
		this.node.innerHTML = (0, _templates.calendar)(this.data.monthViews[i]);
		this.manageButtons(i);
	},
	manageButtons: function manageButtons(i) {
		var _this2 = this;

		var backButton = this.node.querySelector('.js-calendar__back'),
		    nextButton = this.node.querySelector('.js-calendar__next'),
		    enableButton = function enableButton(btn, value) {
			TRIGGER_EVENTS.forEach(function (ev) {
				btn.addEventListener(ev, function (e) {
					if (!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode)) return;
					_this2.renderView.call(_this2, value);
				});
			});
		};

		//urgh...
		if (i === 0) {
			backButton.setAttribute('disabled', 'disabled');
			enableButton(nextButton, i + 1);
		}
		if (i === this.data.monthViews.length - 1) {
			nextButton.setAttribute('disabled', 'disabled');
			enableButton(backButton, i - 1);
		}
		if (i !== 0 && i !== this.data.monthViews.length - 1) {
			enableButton(nextButton, i + 1);
			enableButton(backButton, i - 1);
		}
	}
};

},{"./templates":5,"./utils":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	zeropad: true //to do - pass through to monthModel
};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var calendar = exports.calendar = function calendar(props) {
    return '<div class="calendar-container">\n                                    <div class="calendar-date">\n                                        <button class="calendar-back js-calendar__back" type="button"><svg class="sdp-btn__icon" width="19" height="19" viewBox="0 0 1000 1000"><path d="M336.2 274.5l-210.1 210h805.4c13 0 23 10 23 23s-10 23-23 23H126.1l210.1 210.1c11 11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7l-249.1-249c-11-11-11-21 0-32l249.1-249.1c21-21.1 53 10.9 32 32z"></path></svg></button>\n                                        <button class="calendar-next js-calendar__next" type="button"><svg class="sdp-btn__icon" width="19" height="19" viewBox="0 0 1000 1000"><path d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z"></path></svg></button>\n                                        <div class="calendar-month-label">' + props.monthTitle + ' ' + props.yearTitle + '</div>\n                                        <table class="calendar-days">\n                                            <thead class="calendar-days-head">\n                                                <tr class="calendar-days-row">\n                                                    <th class="calendar-day-head">Mo</th>\n                                                    <th class="calendar-day-head">Tu</th>\n                                                    <th class="calendar-day-head">We</th>\n                                                    <th class="calendar-day-head">Th</th>\n                                                    <th class="calendar-day-head">Fr</th>\n                                                    <th class="calendar-day-head">Sa</th>\n                                                    <th class="calendar-day-head">Su</th>\n                                                </tr>\n                                            </thead>\n                                            <tbody class="calendar-days-body">\n                                                ' + props.model.map(weeks(props.active)).join('') + '\n                                            </tbody>\n                                        </table>\n                                    </div>\n                                </div>';
};

var day = function day(activeDays, props) {
    return '<td class="calendar-day' + (props.nextMonth ? ' calendar-day-next-month' : '') + (props.previousMonth ? ' calendar-day-prev-month' : '') + (props.active && !props.previousMonth && !props.nextMonth ? ' calendar-day-selected' : ' calendar-day-disabled') + '">' + props.number + '</td>';
};

var weeks = function weeks(activeDays) {
    return function (props, i, arr) {
        if (i === 0) return '<tr class="calendar-days-row">' + day(activeDays, props);else if (i === arr.length - 1) return day(activeDays, props) + '</tr>';else if ((i + 1) % 7 === 0) return day(activeDays, props) + '</tr><tr class="calendar-days-row">';else return day(activeDays, props);
    };
};

},{}],6:[function(require,module,exports){
'use strict';

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
/*
or...
Math.round(Math.abs((a.getTime() - b.getTime())/(24*60*60*1000)));
*/

var zeropad = exports.zeropad = function zeropad(n) {
    return ('0' + n).slice(-2);
};

var stripZeroPad = exports.stripZeroPad = function stripZeroPad(n) {
    return +n[0] === 0 ? n[1] : n;
};

var addDays = exports.addDays = function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

var monthNames = exports.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var monthModel = function monthModel(year, month, _ref) {
    var min = _ref.min,
        max = _ref.max;

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
            output.push({
                number: zeropad(prevMonthStartDay),
                previousMonth: true
            });
            prevMonthStartDay++;
        }
    }
    for (var i = 1; i <= totalDays; i++) {
        var tmpTimestamp = new Date(year, month, i).getTime();
        output.push({ number: zeropad(i), active: tmpTimestamp >= min && tmpTimestamp <= max });
    }

    if (endDay !== 0) for (var _i = 1; _i <= 7 - endDay; _i++) {
        output.push({ number: zeropad(_i), nextMonth: true });
    }return output;
};

var monthViewFactory = exports.monthViewFactory = function monthViewFactory(day, limits) {
    return {
        model: monthModel(day.getFullYear(), day.getMonth(), limits),
        monthTitle: monthNames[day.getMonth()],
        yearTitle: day.getFullYear()
    };
};

var monthViewExists = exports.monthViewExists = function monthViewExists(day) {
    return function (idx, monthView, i) {
        if (monthView.monthTitle === monthNames[day.getMonth()] && monthView.yearTitle === day.getFullYear()) idx = i;
        return idx;
    };
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3RlbXBsYXRlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7Ozs7O0FBRUEsSUFBTSwyQkFBMkIsWUFBTSxBQUNuQzt3QkFBQSxBQUFTLEtBQVQsQUFBYyxBQUNqQjtBQUZELEFBQWdDLENBQUE7O0FBSWhDLElBQUcsc0JBQUgsQUFBeUIsZUFBUSxBQUFPLGlCQUFQLEFBQXdCLG9CQUFvQixZQUFNLEFBQUU7NEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtlQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7QUFBcEcsQ0FBQTs7Ozs7Ozs7O0FDTmpDOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsS0FBRCxBQUFNLE1BQVMsQUFDM0I7S0FBSSxNQUFNLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsaUJBQWpDLEFBQVUsQUFBYyxBQUEwQixBQUMvQztBQUVIOztLQUFHLENBQUMsSUFBSixBQUFRLFFBQVEsT0FBTyxRQUFBLEFBQVEsS0FBZixBQUFPLEFBQWEsQUFFcEM7O1lBQU8sQUFBSSxJQUFJLFVBQUEsQUFBQyxJQUFPLEFBQ3RCO2dCQUFPLEFBQU8sT0FBTyxPQUFBLEFBQU8sNEJBQXJCO1NBQWlELEFBQ2pELEFBQ047Y0FBVyxHQUFBLEFBQUcsYUFBSCxBQUFnQixxQkFBcUIs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QUFBTSxXQUFOLEFBQWlCLEdBQU0sQUFDNUQ7WUFBRyxVQUFBLEFBQVUsZUFBZSxXQUFXLElBQXBDLEFBQXlCLEFBQVcsQUFBSSxlQUFlLFVBQUEsQUFBVSxjQUFjLElBQWxGLEFBQWtGLEFBQUksZUFBZSxNQUFBLEFBQU0sQUFDM0c7ZUFBQSxBQUFPLEFBQ1A7QUFIOEI7QUFBeEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IENhbGVuZGFyIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG4gICAgQ2FsZW5kYXIuaW5pdCgnLmpzLWNhbGVuZGFyJyk7XG59XTtcbiAgICBcbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0pOyIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuXG5jb25zdCBpbml0ID0gKHNlbCwgb3B0cykgPT4ge1xuXHRsZXQgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuICAgIC8vbGV0IGVscyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcblxuXHRpZighZWxzLmxlbmd0aCkgcmV0dXJuIGNvbnNvbGUud2FybignQ2FsZW5kYXIgbm90IGluaXRpYWxpc2VkLCBubyBhdWdtZW50YWJsZSBlbGVtZW50cyBmb3VuZCcpO1xuICAgIFxuXHRyZXR1cm4gZWxzLm1hcCgoZWwpID0+IHtcblx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdG5vZGU6IGVsLFxuXHRcdFx0c3RhcnREYXRlOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhcnQtZGF0ZScpID8gbmV3IERhdGUoZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN0YXJ0LWRhdGUnKSkgOiBmYWxzZSxcblx0XHRcdGVuZERhdGU6IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1lbmQtZGF0ZScpID8gbmV3IERhdGUoZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWVuZC1kYXRlJykpIDogbmV3IERhdGUoZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN0YXJ0LWRhdGUnKSksXG5cdFx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpXG5cdFx0fSkuaW5pdCgpO1xuXHR9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsImltcG9ydCB7IGRpZmZEYXlzLCBhZGREYXlzLCBtb250aE5hbWVzLCBtb250aFZpZXdGYWN0b3J5LCBtb250aFZpZXdFeGlzdHMsIGFjdGl2YXRlRGF0ZXMgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IGNhbGVuZGFyIH0gZnJvbSAnLi90ZW1wbGF0ZXMnO1xuXG5jb25zdCBUUklHR0VSX0VWRU5UUyA9IFsnY2xpY2snLCAna2V5ZG93biddLFxuXHQgIFRSSUdHRVJfS0VZQ09ERVMgPSBbMTMsIDMyXTtcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRpbml0KCkge1xuXHRcdGxldCB0b3RhbERheXMgPSBkaWZmRGF5cyh0aGlzLnN0YXJ0RGF0ZSwgdGhpcy5lbmREYXRlKSxcblx0XHRcdGV2ZW50RGF0ZU9iamVjdHMgPSBbXTtcblx0XHRcblx0XHQvL25vcm1hbGlzZSBob3VyIGZvciB0aW1lc3RhbXAgY29tcGFyaXNvblxuXHRcdHRoaXMuc3RhcnREYXRlLnNldEhvdXJzKDAsMCwwLDApO1xuXHRcdHRoaXMuZW5kRGF0ZS5zZXRIb3VycygwLDAsMCwwKTtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDw9IHRvdGFsRGF5czsgaSsrKSBldmVudERhdGVPYmplY3RzLnB1c2goYWRkRGF5cyh0aGlzLnN0YXJ0RGF0ZSwgaSkpO1xuXHRcdC8vQXJyYXkuYXBwbHkobnVsbCwgbmV3IEFycmF5KHRvdGFsRGF5cyArIDEpKS5tYXAoKGl0ZW0sIGkpID0+IGFkZERheXModGhpcy5zdGFydERhdGUsIGkpKTtzXG5cblx0XHR0aGlzLmRhdGEgPSBldmVudERhdGVPYmplY3RzLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiB7XG5cdFx0XHRcdGxldCBleGlzdGluZ01vbnRoSW5kZXggPSBhY2MubW9udGhWaWV3cy5sZW5ndGggPyBhY2MubW9udGhWaWV3cy5yZWR1Y2UobW9udGhWaWV3RXhpc3RzKGN1cnIpLCAtMSkgOiBmYWxzZTtcblx0XHRcdFx0aWYoIWFjYy5tb250aFZpZXdzLmxlbmd0aCB8fCBleGlzdGluZ01vbnRoSW5kZXggPT09IC0xKSBhY2MubW9udGhWaWV3cy5wdXNoKG1vbnRoVmlld0ZhY3RvcnkoY3Vyciwge21pbjogdGhpcy5zdGFydERhdGUuZ2V0VGltZSgpLCBtYXg6IHRoaXMuZW5kRGF0ZS5nZXRUaW1lKCl9KSk7XG5cdFx0XHRcdHJldHVybiBhY2M7XG5cdFx0XHR9LCB7IG1vbnRoVmlld3M6IFtdfSk7XG5cdFx0XHRcblx0XHRjb25zb2xlLmxvZyh0aGlzLmRhdGEpO1xuXHRcdGV2ZW50RGF0ZU9iamVjdHMgPSBbXTtcblx0XHR0aGlzLnJlbmRlclZpZXcoMCk7XG5cdFx0XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdHJlbmRlclZpZXcoaSl7XG5cdFx0dGhpcy5ub2RlLmlubmVySFRNTCA9IGNhbGVuZGFyKHRoaXMuZGF0YS5tb250aFZpZXdzW2ldKTtcblx0XHR0aGlzLm1hbmFnZUJ1dHRvbnMoaSk7XG5cdH0sXG5cdG1hbmFnZUJ1dHRvbnMoaSkge1xuXHRcdGxldCBiYWNrQnV0dG9uID0gdGhpcy5ub2RlLnF1ZXJ5U2VsZWN0b3IoJy5qcy1jYWxlbmRhcl9fYmFjaycpLFxuXHRcdFx0bmV4dEJ1dHRvbiA9IHRoaXMubm9kZS5xdWVyeVNlbGVjdG9yKCcuanMtY2FsZW5kYXJfX25leHQnKSxcblx0XHRcdGVuYWJsZUJ1dHRvbiA9IChidG4sIHZhbHVlKSA9PiB7XG5cdFx0XHRcdFRSSUdHRVJfRVZFTlRTLmZvckVhY2goZXYgPT4ge1xuXHRcdFx0XHRcdGJ0bi5hZGRFdmVudExpc3RlbmVyKGV2LCBlID0+IHtcblx0XHRcdFx0XHRcdGlmKCEhZS5rZXlDb2RlICYmICF+VFJJR0dFUl9LRVlDT0RFUy5pbmRleE9mKGUua2V5Q29kZSkpIHJldHVybjtcblx0XHRcdFx0XHRcdHRoaXMucmVuZGVyVmlldy5jYWxsKHRoaXMsIHZhbHVlKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXG5cdFx0Ly91cmdoLi4uXG5cdFx0aWYoaSA9PT0gMCkge1xuXHRcdFx0YmFja0J1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG5cdFx0XHRlbmFibGVCdXR0b24obmV4dEJ1dHRvbiwgaSArIDEpO1xuXHRcdH1cblx0XHRpZihpID09PSB0aGlzLmRhdGEubW9udGhWaWV3cy5sZW5ndGggLSAxKSB7XG5cdFx0XHRuZXh0QnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcblx0XHRcdGVuYWJsZUJ1dHRvbihiYWNrQnV0dG9uLCBpIC0gMSk7XG5cdFx0fVxuXHRcdGlmKGkgIT09IDAgJiYgaSAhPT0gdGhpcy5kYXRhLm1vbnRoVmlld3MubGVuZ3RoIC0gMSkge1xuXHRcdFx0ZW5hYmxlQnV0dG9uKG5leHRCdXR0b24sIGkgKyAxKTtcblx0XHRcdGVuYWJsZUJ1dHRvbihiYWNrQnV0dG9uLCBpIC0gMSk7XG5cdFx0fVxuXHR9XG59OyIsImV4cG9ydCBkZWZhdWx0IHtcblx0emVyb3BhZDogdHJ1ZSwvL3RvIGRvIC0gcGFzcyB0aHJvdWdoIHRvIG1vbnRoTW9kZWxcbn07IiwiZXhwb3J0IGNvbnN0IGNhbGVuZGFyID0gcHJvcHMgPT4gYDxkaXYgY2xhc3M9XCJjYWxlbmRhci1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYWxlbmRhci1kYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNhbGVuZGFyLWJhY2sganMtY2FsZW5kYXJfX2JhY2tcIiB0eXBlPVwiYnV0dG9uXCI+PHN2ZyBjbGFzcz1cInNkcC1idG5fX2ljb25cIiB3aWR0aD1cIjE5XCIgaGVpZ2h0PVwiMTlcIiB2aWV3Qm94PVwiMCAwIDEwMDAgMTAwMFwiPjxwYXRoIGQ9XCJNMzM2LjIgMjc0LjVsLTIxMC4xIDIxMGg4MDUuNGMxMyAwIDIzIDEwIDIzIDIzcy0xMCAyMy0yMyAyM0gxMjYuMWwyMTAuMSAyMTAuMWMxMSAxMSAxMSAyMSAwIDMyLTUgNS0xMCA3LTE2IDdzLTExLTItMTYtN2wtMjQ5LjEtMjQ5Yy0xMS0xMS0xMS0yMSAwLTMybDI0OS4xLTI0OS4xYzIxLTIxLjEgNTMgMTAuOSAzMiAzMnpcIj48L3BhdGg+PC9zdmc+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNhbGVuZGFyLW5leHQganMtY2FsZW5kYXJfX25leHRcIiB0eXBlPVwiYnV0dG9uXCI+PHN2ZyBjbGFzcz1cInNkcC1idG5fX2ljb25cIiB3aWR0aD1cIjE5XCIgaGVpZ2h0PVwiMTlcIiB2aWV3Qm94PVwiMCAwIDEwMDAgMTAwMFwiPjxwYXRoIGQ9XCJNNjk0LjQgMjQyLjRsMjQ5LjEgMjQ5LjFjMTEgMTEgMTEgMjEgMCAzMkw2OTQuNCA3NzIuN2MtNSA1LTEwIDctMTYgN3MtMTEtMi0xNi03Yy0xMS0xMS0xMS0yMSAwLTMybDIxMC4xLTIxMC4xSDY3LjFjLTEzIDAtMjMtMTAtMjMtMjNzMTAtMjMgMjMtMjNoODA1LjRMNjYyLjQgMjc0LjVjLTIxLTIxLjEgMTEtNTMuMSAzMi0zMi4xelwiPjwvcGF0aD48L3N2Zz48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsZW5kYXItbW9udGgtbGFiZWxcIj4ke3Byb3BzLm1vbnRoVGl0bGV9ICR7cHJvcHMueWVhclRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cImNhbGVuZGFyLWRheXNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoZWFkIGNsYXNzPVwiY2FsZW5kYXItZGF5cy1oZWFkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIgY2xhc3M9XCJjYWxlbmRhci1kYXlzLXJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cImNhbGVuZGFyLWRheS1oZWFkXCI+TW88L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cImNhbGVuZGFyLWRheS1oZWFkXCI+VHU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cImNhbGVuZGFyLWRheS1oZWFkXCI+V2U8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cImNhbGVuZGFyLWRheS1oZWFkXCI+VGg8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cImNhbGVuZGFyLWRheS1oZWFkXCI+RnI8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cImNhbGVuZGFyLWRheS1oZWFkXCI+U2E8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cImNhbGVuZGFyLWRheS1oZWFkXCI+U3U8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5IGNsYXNzPVwiY2FsZW5kYXItZGF5cy1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3Byb3BzLm1vZGVsLm1hcCh3ZWVrcyhwcm9wcy5hY3RpdmUpKS5qb2luKCcnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7XG5cbmNvbnN0IGRheSA9IChhY3RpdmVEYXlzLCBwcm9wcykgPT4gYDx0ZCBjbGFzcz1cImNhbGVuZGFyLWRheSR7cHJvcHMubmV4dE1vbnRoID8gJyBjYWxlbmRhci1kYXktbmV4dC1tb250aCcgOiAnJ30ke3Byb3BzLnByZXZpb3VzTW9udGggPyAnIGNhbGVuZGFyLWRheS1wcmV2LW1vbnRoJyA6ICcnfSR7cHJvcHMuYWN0aXZlICYmICFwcm9wcy5wcmV2aW91c01vbnRoICYmICFwcm9wcy5uZXh0TW9udGggPyAnIGNhbGVuZGFyLWRheS1zZWxlY3RlZCcgOiAnIGNhbGVuZGFyLWRheS1kaXNhYmxlZCd9XCI+JHtwcm9wcy5udW1iZXJ9PC90ZD5gO1xuXG5jb25zdCB3ZWVrcyA9IGFjdGl2ZURheXMgPT4gKHByb3BzLCBpLCBhcnIpID0+IHtcbiAgICBpZihpID09PSAwKSByZXR1cm4gYDx0ciBjbGFzcz1cImNhbGVuZGFyLWRheXMtcm93XCI+JHtkYXkoYWN0aXZlRGF5cywgcHJvcHMpfWA7XG4gICAgZWxzZSBpZiAoaSA9PT0gYXJyLmxlbmd0aCAtIDEpIHJldHVybiBgJHtkYXkoYWN0aXZlRGF5cywgcHJvcHMpfTwvdHI+YDtcbiAgICBlbHNlIGlmKChpKzEpICUgNyA9PT0gMCkgcmV0dXJuIGAke2RheShhY3RpdmVEYXlzLCBwcm9wcyl9PC90cj48dHIgY2xhc3M9XCJjYWxlbmRhci1kYXlzLXJvd1wiPmA7XG4gICAgZWxzZSByZXR1cm4gZGF5KGFjdGl2ZURheXMsIHByb3BzKTtcbn07IiwiZXhwb3J0IGNvbnN0IGRpZmZEYXlzID0gKGEsIGIpID0+IHtcblx0Y29uc3QgTVNfUEVSX0RBWSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG5cdC8vIERpc2NhcmQgdGhlIHRpbWUgYW5kIHRpbWUtem9uZSBpbmZvcm1hdGlvbi5cblx0bGV0IHV0YzEgPSBEYXRlLlVUQyhhLmdldEZ1bGxZZWFyKCksIGEuZ2V0TW9udGgoKSwgYS5nZXREYXRlKCkpLFxuXHRcdHV0YzIgPSBEYXRlLlVUQyhiLmdldEZ1bGxZZWFyKCksIGIuZ2V0TW9udGgoKSwgYi5nZXREYXRlKCkpO1xuXG4gIFx0cmV0dXJuIE1hdGguZmxvb3IoKHV0YzIgLSB1dGMxKSAvIE1TX1BFUl9EQVkpO1xufTtcbi8qXG5vci4uLlxuTWF0aC5yb3VuZChNYXRoLmFicygoYS5nZXRUaW1lKCkgLSBiLmdldFRpbWUoKSkvKDI0KjYwKjYwKjEwMDApKSk7XG4qL1xuXG5leHBvcnQgY29uc3QgemVyb3BhZCA9IG4gPT4gYDAke259YC5zbGljZSgtMik7XG5cbmV4cG9ydCBjb25zdCBzdHJpcFplcm9QYWQgPSBuID0+ICtuWzBdID09PSAwID8gblsxXSA6IG47XG5cbmV4cG9ydCBjb25zdCBhZGREYXlzID0gKGRhdGUsIGRheXMpID0+IHtcblx0bGV0IHJlc3VsdCA9IG5ldyBEYXRlKGRhdGUpO1xuXHRyZXN1bHQuc2V0RGF0ZShyZXN1bHQuZ2V0RGF0ZSgpICsgZGF5cyk7XG5cdHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgY29uc3QgbW9udGhOYW1lcyA9IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlciddO1xuXG5jb25zdCBtb250aE1vZGVsID0gKHllYXIsIG1vbnRoLCB7IG1pbiwgbWF4IH0pID0+IHtcbiAgICBsZXQgdGhlTW9udGggPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCArIDEsIDApLFxuICAgICAgICB0b3RhbERheXMgPSB0aGVNb250aC5nZXREYXRlKCksXG4gICAgICAgIGVuZERheSA9IHRoZU1vbnRoLmdldERheSgpLFxuICAgICAgICBzdGFydERheSxcbiAgICAgICAgcHJldk1vbnRoU3RhcnREYXkgPSBmYWxzZSxcbiAgICAgICAgcHJldk1vbnRoID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDApLFxuICAgICAgICBwcmV2TW9udGhFbmREYXkgPSBwcmV2TW9udGguZ2V0RGF0ZSgpLFxuICAgICAgICBvdXRwdXQgPSBbXTtcblxuICAgIHRoZU1vbnRoLnNldERhdGUoMSk7XG4gICAgc3RhcnREYXkgPSB0aGVNb250aC5nZXREYXkoKTtcbiAgICBcbiAgICBpZihzdGFydERheSAhPT0gMSkge1xuICAgICAgICBpZihzdGFydERheSA9PT0gMCkgcHJldk1vbnRoU3RhcnREYXkgPSBwcmV2TW9udGguZ2V0RGF0ZSgpIC0gNTtcbiAgICAgICAgZWxzZSBwcmV2TW9udGhTdGFydERheSA9IHByZXZNb250aC5nZXREYXRlKCkgLSAoc3RhcnREYXkgLSAyKTtcbiAgICB9XG5cbiAgICBpZihwcmV2TW9udGhTdGFydERheSl7XG4gICAgICAgIHdoaWxlKHByZXZNb250aFN0YXJ0RGF5IDw9IHByZXZNb250aEVuZERheSl7XG4gICAgICAgICAgICBvdXRwdXQucHVzaCh7XG4gICAgICAgICAgICAgICAgbnVtYmVyOiB6ZXJvcGFkKHByZXZNb250aFN0YXJ0RGF5KSxcblx0XHRcdFx0cHJldmlvdXNNb250aDogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcHJldk1vbnRoU3RhcnREYXkrKztcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IobGV0IGkgPSAxOyBpIDw9IHRvdGFsRGF5czsgaSsrKSB7XG4gICAgICAgIGxldCB0bXBUaW1lc3RhbXAgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgaSkuZ2V0VGltZSgpO1xuICAgICAgICBvdXRwdXQucHVzaCh7IG51bWJlcjogemVyb3BhZChpKSwgYWN0aXZlOiB0bXBUaW1lc3RhbXAgPj0gbWluICYmIHRtcFRpbWVzdGFtcCA8PSBtYXh9KTtcbiAgICB9XG5cbiAgICBpZihlbmREYXkgIT09IDApIGZvcihsZXQgaSA9IDE7IGkgPD0gKDcgLSBlbmREYXkpOyBpKyspIG91dHB1dC5wdXNoKHsgbnVtYmVyOiB6ZXJvcGFkKGkpLCBuZXh0TW9udGg6IHRydWV9KTtcblxuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG5leHBvcnQgY29uc3QgbW9udGhWaWV3RmFjdG9yeSA9IChkYXksIGxpbWl0cykgPT4gKHtcblx0bW9kZWw6IG1vbnRoTW9kZWwoZGF5LmdldEZ1bGxZZWFyKCksIGRheS5nZXRNb250aCgpLCBsaW1pdHMpLFxuXHRtb250aFRpdGxlOiBtb250aE5hbWVzW2RheS5nZXRNb250aCgpXSxcblx0eWVhclRpdGxlOiBkYXkuZ2V0RnVsbFllYXIoKVxufSk7XG5cbmV4cG9ydCBjb25zdCBtb250aFZpZXdFeGlzdHMgPSBkYXkgPT4gKGlkeCwgbW9udGhWaWV3LCBpKSA9PiB7XG5cdGlmKG1vbnRoVmlldy5tb250aFRpdGxlID09PSBtb250aE5hbWVzW2RheS5nZXRNb250aCgpXSAmJiBtb250aFZpZXcueWVhclRpdGxlID09PSBkYXkuZ2V0RnVsbFllYXIoKSkgaWR4ID0gaTtcblx0cmV0dXJuIGlkeDtcbn07Il19
