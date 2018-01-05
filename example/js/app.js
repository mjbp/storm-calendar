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

		for (var i = 0; i <= totalDays; i++) {
			eventDateObjects.push((0, _utils.addDays)(this.startDate, i));
		} //Array.apply(null, new Array(totalDays + 1)).map((item, i) => addDays(this.startDate, i));s

		this.data = eventDateObjects.reduce(function (acc, curr) {
			var existingMonthIndex = acc.monthViews.length ? acc.monthViews.reduce((0, _utils.monthViewExists)(curr), -1) : false;
			if (!acc.monthViews.length || existingMonthIndex === -1) acc.monthViews.push((0, _utils.monthViewFactory)(curr, { min: _this.startDate.getTime(), max: _this.endDate.getTime() }));
			return acc;
		}, { monthViews: [] });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3RlbXBsYXRlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7Ozs7O0FBRUEsSUFBTSwyQkFBMkIsWUFBTSxBQUNuQzt3QkFBQSxBQUFTLEtBQVQsQUFBYyxBQUNqQjtBQUZELEFBQWdDLENBQUE7O0FBSWhDLElBQUcsc0JBQUgsQUFBeUIsZUFBUSxBQUFPLGlCQUFQLEFBQXdCLG9CQUFvQixZQUFNLEFBQUU7NEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtlQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7QUFBcEcsQ0FBQTs7Ozs7Ozs7O0FDTmpDOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsS0FBRCxBQUFNLE1BQVMsQUFDM0I7S0FBSSxNQUFNLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsaUJBQWpDLEFBQVUsQUFBYyxBQUEwQixBQUMvQztBQUVIOztLQUFHLENBQUMsSUFBSixBQUFRLFFBQVEsT0FBTyxRQUFBLEFBQVEsS0FBZixBQUFPLEFBQWEsQUFFcEM7O1lBQU8sQUFBSSxJQUFJLFVBQUEsQUFBQyxJQUFPLEFBQ3RCO2dCQUFPLEFBQU8sT0FBTyxPQUFBLEFBQU8sNEJBQXJCO1NBQWlELEFBQ2pELEFBQ047Y0FBVyxHQUFBLEFBQUcsYUFBSCxBQUFnQixxQkFBcUIs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b3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgQ2FsZW5kYXIgZnJvbSAnLi9saWJzL2NvbXBvbmVudCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcbiAgICBDYWxlbmRhci5pbml0KCcuanMtY2FsZW5kYXInKTtcbn1dO1xuICAgIFxuaWYoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdykgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSk7IiwiaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vbGliL2RlZmF1bHRzJztcbmltcG9ydCBjb21wb25lbnRQcm90b3R5cGUgZnJvbSAnLi9saWIvY29tcG9uZW50LXByb3RvdHlwZSc7XG5cbmNvbnN0IGluaXQgPSAoc2VsLCBvcHRzKSA9PiB7XG5cdGxldCBlbHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSk7XG4gICAgLy9sZXQgZWxzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXG5cdGlmKCFlbHMubGVuZ3RoKSByZXR1cm4gY29uc29sZS53YXJuKCdDYWxlbmRhciBub3QgaW5pdGlhbGlzZWQsIG5vIGF1Z21lbnRhYmxlIGVsZW1lbnRzIGZvdW5kJyk7XG4gICAgXG5cdHJldHVybiBlbHMubWFwKChlbCkgPT4ge1xuXHRcdHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoY29tcG9uZW50UHJvdG90eXBlKSwge1xuXHRcdFx0bm9kZTogZWwsXG5cdFx0XHRzdGFydERhdGU6IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zdGFydC1kYXRlJykgPyBuZXcgRGF0ZShlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhcnQtZGF0ZScpKSA6IGZhbHNlLFxuXHRcdFx0ZW5kRGF0ZTogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWVuZC1kYXRlJykgPyBuZXcgRGF0ZShlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZW5kLWRhdGUnKSkgOiBuZXcgRGF0ZShlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhcnQtZGF0ZScpKSxcblx0XHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cylcblx0XHR9KS5pbml0KCk7XG5cdH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiaW1wb3J0IHsgZGlmZkRheXMsIGFkZERheXMsIG1vbnRoTmFtZXMsIG1vbnRoVmlld0ZhY3RvcnksIG1vbnRoVmlld0V4aXN0cywgYWN0aXZhdGVEYXRlcyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgY2FsZW5kYXIgfSBmcm9tICcuL3RlbXBsYXRlcyc7XG5cbmNvbnN0IFRSSUdHRVJfRVZFTlRTID0gWydjbGljaycsICdrZXlkb3duJ10sXG5cdCAgVFJJR0dFUl9LRVlDT0RFUyA9IFsxMywgMzJdO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGluaXQoKSB7XG5cdFx0bGV0IHRvdGFsRGF5cyA9IGRpZmZEYXlzKHRoaXMuc3RhcnREYXRlLCB0aGlzLmVuZERhdGUpLFxuXHRcdFx0ZXZlbnREYXRlT2JqZWN0cyA9IFtdO1xuXHRcdFxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDw9IHRvdGFsRGF5czsgaSsrKSBldmVudERhdGVPYmplY3RzLnB1c2goYWRkRGF5cyh0aGlzLnN0YXJ0RGF0ZSwgaSkpO1xuXHRcdC8vQXJyYXkuYXBwbHkobnVsbCwgbmV3IEFycmF5KHRvdGFsRGF5cyArIDEpKS5tYXAoKGl0ZW0sIGkpID0+IGFkZERheXModGhpcy5zdGFydERhdGUsIGkpKTtzXG5cblx0XHR0aGlzLmRhdGEgPSBldmVudERhdGVPYmplY3RzLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiB7XG5cdFx0XHRcdGxldCBleGlzdGluZ01vbnRoSW5kZXggPSBhY2MubW9udGhWaWV3cy5sZW5ndGggPyBhY2MubW9udGhWaWV3cy5yZWR1Y2UobW9udGhWaWV3RXhpc3RzKGN1cnIpLCAtMSkgOiBmYWxzZTtcblx0XHRcdFx0aWYoIWFjYy5tb250aFZpZXdzLmxlbmd0aCB8fCBleGlzdGluZ01vbnRoSW5kZXggPT09IC0xKSBhY2MubW9udGhWaWV3cy5wdXNoKG1vbnRoVmlld0ZhY3RvcnkoY3Vyciwge21pbjogdGhpcy5zdGFydERhdGUuZ2V0VGltZSgpLCBtYXg6IHRoaXMuZW5kRGF0ZS5nZXRUaW1lKCl9KSk7XG5cdFx0XHRcdHJldHVybiBhY2M7XG5cdFx0XHR9LCB7IG1vbnRoVmlld3M6IFtdfSk7XG5cdFx0XHRcblx0XHRldmVudERhdGVPYmplY3RzID0gW107XG5cdFx0dGhpcy5yZW5kZXJWaWV3KDApO1xuXHRcdFxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRyZW5kZXJWaWV3KGkpe1xuXHRcdHRoaXMubm9kZS5pbm5lckhUTUwgPSBjYWxlbmRhcih0aGlzLmRhdGEubW9udGhWaWV3c1tpXSk7XG5cdFx0dGhpcy5tYW5hZ2VCdXR0b25zKGkpO1xuXHR9LFxuXHRtYW5hZ2VCdXR0b25zKGkpIHtcblx0XHRsZXQgYmFja0J1dHRvbiA9IHRoaXMubm9kZS5xdWVyeVNlbGVjdG9yKCcuanMtY2FsZW5kYXJfX2JhY2snKSxcblx0XHRcdG5leHRCdXR0b24gPSB0aGlzLm5vZGUucXVlcnlTZWxlY3RvcignLmpzLWNhbGVuZGFyX19uZXh0JyksXG5cdFx0XHRlbmFibGVCdXR0b24gPSAoYnRuLCB2YWx1ZSkgPT4ge1xuXHRcdFx0XHRUUklHR0VSX0VWRU5UUy5mb3JFYWNoKGV2ID0+IHtcblx0XHRcdFx0XHRidG4uYWRkRXZlbnRMaXN0ZW5lcihldiwgZSA9PiB7XG5cdFx0XHRcdFx0XHRpZighIWUua2V5Q29kZSAmJiAhflRSSUdHRVJfS0VZQ09ERVMuaW5kZXhPZihlLmtleUNvZGUpKSByZXR1cm47XG5cdFx0XHRcdFx0XHR0aGlzLnJlbmRlclZpZXcuY2FsbCh0aGlzLCB2YWx1ZSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblxuXHRcdC8vdXJnaC4uLlxuXHRcdGlmKGkgPT09IDApIHtcblx0XHRcdGJhY2tCdXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuXHRcdFx0ZW5hYmxlQnV0dG9uKG5leHRCdXR0b24sIGkgKyAxKTtcblx0XHR9XG5cdFx0aWYoaSA9PT0gdGhpcy5kYXRhLm1vbnRoVmlld3MubGVuZ3RoIC0gMSkge1xuXHRcdFx0bmV4dEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG5cdFx0XHRlbmFibGVCdXR0b24oYmFja0J1dHRvbiwgaSAtIDEpO1xuXHRcdH1cblx0XHRpZihpICE9PSAwICYmIGkgIT09IHRoaXMuZGF0YS5tb250aFZpZXdzLmxlbmd0aCAtIDEpIHtcblx0XHRcdGVuYWJsZUJ1dHRvbihuZXh0QnV0dG9uLCBpICsgMSk7XG5cdFx0XHRlbmFibGVCdXR0b24oYmFja0J1dHRvbiwgaSAtIDEpO1xuXHRcdH1cblx0fVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG5cdHplcm9wYWQ6IHRydWUsLy90byBkbyAtIHBhc3MgdGhyb3VnaCB0byBtb250aE1vZGVsXG59OyIsImV4cG9ydCBjb25zdCBjYWxlbmRhciA9IHByb3BzID0+IGA8ZGl2IGNsYXNzPVwiY2FsZW5kYXItY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsZW5kYXItZGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJjYWxlbmRhci1iYWNrIGpzLWNhbGVuZGFyX19iYWNrXCIgdHlwZT1cImJ1dHRvblwiPjxzdmcgY2xhc3M9XCJzZHAtYnRuX19pY29uXCIgd2lkdGg9XCIxOVwiIGhlaWdodD1cIjE5XCIgdmlld0JveD1cIjAgMCAxMDAwIDEwMDBcIj48cGF0aCBkPVwiTTMzNi4yIDI3NC41bC0yMTAuMSAyMTBoODA1LjRjMTMgMCAyMyAxMCAyMyAyM3MtMTAgMjMtMjMgMjNIMTI2LjFsMjEwLjEgMjEwLjFjMTEgMTEgMTEgMjEgMCAzMi01IDUtMTAgNy0xNiA3cy0xMS0yLTE2LTdsLTI0OS4xLTI0OWMtMTEtMTEtMTEtMjEgMC0zMmwyNDkuMS0yNDkuMWMyMS0yMS4xIDUzIDEwLjkgMzIgMzJ6XCI+PC9wYXRoPjwvc3ZnPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJjYWxlbmRhci1uZXh0IGpzLWNhbGVuZGFyX19uZXh0XCIgdHlwZT1cImJ1dHRvblwiPjxzdmcgY2xhc3M9XCJzZHAtYnRuX19pY29uXCIgd2lkdGg9XCIxOVwiIGhlaWdodD1cIjE5XCIgdmlld0JveD1cIjAgMCAxMDAwIDEwMDBcIj48cGF0aCBkPVwiTTY5NC40IDI0Mi40bDI0OS4xIDI0OS4xYzExIDExIDExIDIxIDAgMzJMNjk0LjQgNzcyLjdjLTUgNS0xMCA3LTE2IDdzLTExLTItMTYtN2MtMTEtMTEtMTEtMjEgMC0zMmwyMTAuMS0yMTAuMUg2Ny4xYy0xMyAwLTIzLTEwLTIzLTIzczEwLTIzIDIzLTIzaDgwNS40TDY2Mi40IDI3NC41Yy0yMS0yMS4xIDExLTUzLjEgMzItMzIuMXpcIj48L3BhdGg+PC9zdmc+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhbGVuZGFyLW1vbnRoLWxhYmVsXCI+JHtwcm9wcy5tb250aFRpdGxlfSAke3Byb3BzLnllYXJUaXRsZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJjYWxlbmRhci1kYXlzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aGVhZCBjbGFzcz1cImNhbGVuZGFyLWRheXMtaGVhZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiY2FsZW5kYXItZGF5cy1yb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJjYWxlbmRhci1kYXktaGVhZFwiPk1vPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJjYWxlbmRhci1kYXktaGVhZFwiPlR1PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJjYWxlbmRhci1kYXktaGVhZFwiPldlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJjYWxlbmRhci1kYXktaGVhZFwiPlRoPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJjYWxlbmRhci1kYXktaGVhZFwiPkZyPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJjYWxlbmRhci1kYXktaGVhZFwiPlNhPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJjYWxlbmRhci1kYXktaGVhZFwiPlN1PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keSBjbGFzcz1cImNhbGVuZGFyLWRheXMtYm9keVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtwcm9wcy5tb2RlbC5tYXAod2Vla3MocHJvcHMuYWN0aXZlKSkuam9pbignJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xuXG5jb25zdCBkYXkgPSAoYWN0aXZlRGF5cywgcHJvcHMpID0+IGA8dGQgY2xhc3M9XCJjYWxlbmRhci1kYXkke3Byb3BzLm5leHRNb250aCA/ICcgY2FsZW5kYXItZGF5LW5leHQtbW9udGgnIDogJyd9JHtwcm9wcy5wcmV2aW91c01vbnRoID8gJyBjYWxlbmRhci1kYXktcHJldi1tb250aCcgOiAnJ30ke3Byb3BzLmFjdGl2ZSAmJiAhcHJvcHMucHJldmlvdXNNb250aCAmJiAhcHJvcHMubmV4dE1vbnRoID8gJyBjYWxlbmRhci1kYXktc2VsZWN0ZWQnIDogJyBjYWxlbmRhci1kYXktZGlzYWJsZWQnfVwiPiR7cHJvcHMubnVtYmVyfTwvdGQ+YDtcblxuY29uc3Qgd2Vla3MgPSBhY3RpdmVEYXlzID0+IChwcm9wcywgaSwgYXJyKSA9PiB7XG4gICAgaWYoaSA9PT0gMCkgcmV0dXJuIGA8dHIgY2xhc3M9XCJjYWxlbmRhci1kYXlzLXJvd1wiPiR7ZGF5KGFjdGl2ZURheXMsIHByb3BzKX1gO1xuICAgIGVsc2UgaWYgKGkgPT09IGFyci5sZW5ndGggLSAxKSByZXR1cm4gYCR7ZGF5KGFjdGl2ZURheXMsIHByb3BzKX08L3RyPmA7XG4gICAgZWxzZSBpZigoaSsxKSAlIDcgPT09IDApIHJldHVybiBgJHtkYXkoYWN0aXZlRGF5cywgcHJvcHMpfTwvdHI+PHRyIGNsYXNzPVwiY2FsZW5kYXItZGF5cy1yb3dcIj5gO1xuICAgIGVsc2UgcmV0dXJuIGRheShhY3RpdmVEYXlzLCBwcm9wcyk7XG59OyIsImV4cG9ydCBjb25zdCBkaWZmRGF5cyA9IChhLCBiKSA9PiB7XG5cdGNvbnN0IE1TX1BFUl9EQVkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuXHQvLyBEaXNjYXJkIHRoZSB0aW1lIGFuZCB0aW1lLXpvbmUgaW5mb3JtYXRpb24uXG5cdGxldCB1dGMxID0gRGF0ZS5VVEMoYS5nZXRGdWxsWWVhcigpLCBhLmdldE1vbnRoKCksIGEuZ2V0RGF0ZSgpKSxcblx0XHR1dGMyID0gRGF0ZS5VVEMoYi5nZXRGdWxsWWVhcigpLCBiLmdldE1vbnRoKCksIGIuZ2V0RGF0ZSgpKTtcblxuICBcdHJldHVybiBNYXRoLmZsb29yKCh1dGMyIC0gdXRjMSkgLyBNU19QRVJfREFZKTtcbn07XG4vKlxub3IuLi5cbk1hdGgucm91bmQoTWF0aC5hYnMoKGEuZ2V0VGltZSgpIC0gYi5nZXRUaW1lKCkpLygyNCo2MCo2MCoxMDAwKSkpO1xuKi9cblxuZXhwb3J0IGNvbnN0IHplcm9wYWQgPSBuID0+IGAwJHtufWAuc2xpY2UoLTIpO1xuXG5leHBvcnQgY29uc3Qgc3RyaXBaZXJvUGFkID0gbiA9PiArblswXSA9PT0gMCA/IG5bMV0gOiBuO1xuXG5leHBvcnQgY29uc3QgYWRkRGF5cyA9IChkYXRlLCBkYXlzKSA9PiB7XG5cdGxldCByZXN1bHQgPSBuZXcgRGF0ZShkYXRlKTtcblx0cmVzdWx0LnNldERhdGUocmVzdWx0LmdldERhdGUoKSArIGRheXMpO1xuXHRyZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGNvbnN0IG1vbnRoTmFtZXMgPSBbJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLCAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXTtcblxuY29uc3QgbW9udGhNb2RlbCA9ICh5ZWFyLCBtb250aCwgeyBtaW4sIG1heCB9KSA9PiB7XG4gICAgbGV0IHRoZU1vbnRoID0gbmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAwKSxcbiAgICAgICAgdG90YWxEYXlzID0gdGhlTW9udGguZ2V0RGF0ZSgpLFxuICAgICAgICBlbmREYXkgPSB0aGVNb250aC5nZXREYXkoKSxcbiAgICAgICAgc3RhcnREYXksXG4gICAgICAgIHByZXZNb250aFN0YXJ0RGF5ID0gZmFsc2UsXG4gICAgICAgIHByZXZNb250aCA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAwKSxcbiAgICAgICAgcHJldk1vbnRoRW5kRGF5ID0gcHJldk1vbnRoLmdldERhdGUoKSxcbiAgICAgICAgb3V0cHV0ID0gW107XG5cbiAgICB0aGVNb250aC5zZXREYXRlKDEpO1xuICAgIHN0YXJ0RGF5ID0gdGhlTW9udGguZ2V0RGF5KCk7XG4gICAgXG4gICAgaWYoc3RhcnREYXkgIT09IDEpIHtcbiAgICAgICAgaWYoc3RhcnREYXkgPT09IDApIHByZXZNb250aFN0YXJ0RGF5ID0gcHJldk1vbnRoLmdldERhdGUoKSAtIDU7XG4gICAgICAgIGVsc2UgcHJldk1vbnRoU3RhcnREYXkgPSBwcmV2TW9udGguZ2V0RGF0ZSgpIC0gKHN0YXJ0RGF5IC0gMik7XG4gICAgfVxuXG4gICAgaWYocHJldk1vbnRoU3RhcnREYXkpe1xuICAgICAgICB3aGlsZShwcmV2TW9udGhTdGFydERheSA8PSBwcmV2TW9udGhFbmREYXkpe1xuICAgICAgICAgICAgb3V0cHV0LnB1c2goe1xuICAgICAgICAgICAgICAgIG51bWJlcjogemVyb3BhZChwcmV2TW9udGhTdGFydERheSksXG5cdFx0XHRcdHByZXZpb3VzTW9udGg6IHRydWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByZXZNb250aFN0YXJ0RGF5Kys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yKGxldCBpID0gMTsgaSA8PSB0b3RhbERheXM7IGkrKykge1xuICAgICAgICBsZXQgdG1wVGltZXN0YW1wID0gbmV3IERhdGUoeWVhciwgbW9udGgsIGkpLmdldFRpbWUoKTtcbiAgICAgICAgb3V0cHV0LnB1c2goeyBudW1iZXI6IHplcm9wYWQoaSksIGFjdGl2ZTogdG1wVGltZXN0YW1wID49IG1pbiAmJiB0bXBUaW1lc3RhbXAgPD0gbWF4fSk7XG4gICAgfVxuXG4gICAgaWYoZW5kRGF5ICE9PSAwKSBmb3IobGV0IGkgPSAxOyBpIDw9ICg3IC0gZW5kRGF5KTsgaSsrKSBvdXRwdXQucHVzaCh7IG51bWJlcjogemVyb3BhZChpKSwgbmV4dE1vbnRoOiB0cnVlfSk7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuZXhwb3J0IGNvbnN0IG1vbnRoVmlld0ZhY3RvcnkgPSAoZGF5LCBsaW1pdHMpID0+ICh7XG5cdG1vZGVsOiBtb250aE1vZGVsKGRheS5nZXRGdWxsWWVhcigpLCBkYXkuZ2V0TW9udGgoKSwgbGltaXRzKSxcblx0bW9udGhUaXRsZTogbW9udGhOYW1lc1tkYXkuZ2V0TW9udGgoKV0sXG5cdHllYXJUaXRsZTogZGF5LmdldEZ1bGxZZWFyKClcbn0pO1xuXG5leHBvcnQgY29uc3QgbW9udGhWaWV3RXhpc3RzID0gZGF5ID0+IChpZHgsIG1vbnRoVmlldywgaSkgPT4ge1xuXHRpZihtb250aFZpZXcubW9udGhUaXRsZSA9PT0gbW9udGhOYW1lc1tkYXkuZ2V0TW9udGgoKV0gJiYgbW9udGhWaWV3LnllYXJUaXRsZSA9PT0gZGF5LmdldEZ1bGxZZWFyKCkpIGlkeCA9IGk7XG5cdHJldHVybiBpZHg7XG59OyJdfQ==
