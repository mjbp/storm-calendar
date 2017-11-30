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
		var totalDays = (0, _utils.diffDays)(this.startDate, this.endDate),
		    eventDateObjects = [];

		for (var i = 0; i <= totalDays; i++) {
			eventDateObjects.push((0, _utils.addDays)(this.startDate, i));
		}this.data = eventDateObjects.reduce(function (acc, curr) {
			var existingMonthIndex = acc.monthViews.length ? acc.monthViews.reduce((0, _utils.monthViewExists)(curr), -1) : false;
			if (!acc.monthViews.length || existingMonthIndex === -1) acc.monthViews.push((0, _utils.monthViewFactory)(curr));

			acc.activeDates[curr.getFullYear()] = acc.activeDates[curr.getFullYear()] || {};
			if (acc.activeDates[curr.getFullYear()] && acc.activeDates[curr.getFullYear()][_utils.monthNames[curr.getMonth()]]) acc.activeDates[curr.getFullYear()][_utils.monthNames[curr.getMonth()]].push(curr.getDate());
			if (!acc.activeDates[curr.getFullYear()][_utils.monthNames[curr.getMonth()]]) acc.activeDates[curr.getFullYear()][_utils.monthNames[curr.getMonth()]] = [curr.getDate()];

			return acc;
		}, { monthViews: [], activeDates: {} });

		eventDateObjects = [];

		this.data.monthViews = (0, _utils.activateDates)(this.data);
		this.renderView(0);

		return this;
	},
	renderView: function renderView(i) {
		this.node.innerHTML = (0, _templates.calendar)(this.data.monthViews[i]);
		this.manageButtons(i);
	},
	enableButton: function enableButton(btn, value) {
		var _this = this;

		TRIGGER_EVENTS.forEach(function (ev) {
			btn.addEventListener(ev, function (e) {
				if (!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode)) return;
				_this.renderView.call(_this, value);
			});
		});
	},
	manageButtons: function manageButtons(i) {
		var backButton = this.node.querySelector('.js-calendar__back'),
		    nextButton = this.node.querySelector('.js-calendar__next');

		//urgh...
		if (i === 0) {
			backButton.setAttribute('disabled', 'disabled');
			this.enableButton(nextButton, i + 1);
		}
		if (i === this.data.monthViews.length - 1) {
			nextButton.setAttribute('disabled', 'disabled');
			this.enableButton(backButton, i - 1);
		}
		if (i !== 0 && i !== this.data.monthViews.length - 1) {
			this.enableButton(nextButton, i + 1);
			this.enableButton(backButton, i - 1);
		}
	}
};

},{"./templates":5,"./utils":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	zeropad: true,
	callback: null
};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var calendar = exports.calendar = function calendar(props) {
    return '<div class="rd-container" style="display: inline-block;">\n                                    <div class="rd-date">\n                                        <div class="rd-month">\n                                            <button class="rd-back js-calendar__back" type="button"></button>\n                                            <button class="rd-next js-calendar__next" type="button"></button>\n                                            <div class="rd-month-label">' + props.monthTitle + ' ' + props.yearTitle + '</div>\n                                            <table class="rd-days">\n                                                <thead class="rd-days-head">\n                                                    <tr class="rd-days-row">\n                                                        <th class="rd-day-head">Mo</th>\n                                                        <th class="rd-day-head">Tu</th>\n                                                        <th class="rd-day-head">We</th>\n                                                        <th class="rd-day-head">Th</th>\n                                                        <th class="rd-day-head">Fr</th>\n                                                        <th class="rd-day-head">Sa</th>\n                                                        <th class="rd-day-head">Su</th>\n                                                    </tr>\n                                                </thead>\n                                                <tbody class="rd-days-body">\n                                                    <!--<tr class="rd-days-row">\n                                                        <td class="rd-day-body rd-day-prev-month rd-day-disabled">30</td>\n                                                        <td class="rd-day-body rd-day-prev-month rd-day-disabled">31</td>\n                                                        <td class="rd-day-body rd-day-disabled">01</td>\n                                                        <td class="rd-day-body rd-day-disabled">02</td>\n                                                        <td class="rd-day-body rd-day-disabled">03</td>\n                                                        <td class="rd-day-body rd-day-disabled">04</td>\n                                                        <td class="rd-day-body rd-day-disabled">05</td>\n                                                    </tr>-->\n                                                    ' + props.model.map(weeks(props.active)).join('') + '\n                                                </tbody>\n                                            </table>\n                                        </div>\n                                    </div>\n                                </div>';
};

var day = function day(activeDays, props) {
    return '<td class="rd-day-body ' + (props.nextMonth ? ' rd-day-next-month' : '') + (props.previousMonth ? ' rd-day-prev-month' : '') + (props.active ? ' rd-day-selected' : ' rd-day-disabled') + '">' + props.number + '</td>';
};

var weeks = function weeks(activeDays) {
    return function (props, i, arr) {
        if (i === 0) return '<tr class="rd-days-row">' + day(activeDays, props);else if (i === arr.length - 1) return day(activeDays, props) + '</tr>';else if ((i + 1) % 7 === 0) return day(activeDays, props) + '</tr><tr class="rd-days-row">';else return day(activeDays, props);
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

var addDays = exports.addDays = function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

var monthNames = exports.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
            output.push({
                number: zeropad(prevMonthStartDay),
                previousMonth: true,
                date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonthStartDay)
            });
            prevMonthStartDay++;
        }
    }
    for (var i = 1; i <= totalDays; i++) {
        output.push({ number: zeropad(i), date: new Date(year, month, i) });
    }if (endDay !== 0) for (var _i = 1; _i <= 7 - endDay; _i++) {
        output.push({ number: zeropad(_i), nextMonth: true, date: new Date(year, month + 1, _i) });
    }return output;
};

var monthViewFactory = exports.monthViewFactory = function monthViewFactory(day) {
    return {
        model: monthModel(day.getFullYear(), day.getMonth()),
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

var activateDates = exports.activateDates = function activateDates(data) {
    return data.monthViews.map(function (monthView) {
        return Object.assign({}, monthView, {
            model: monthView.model.map(function (dayModel) {
                return Object.assign({}, dayModel, {
                    active: data.activeDates[dayModel.date.getFullYear()] && data.activeDates[dayModel.date.getFullYear()][monthNames[dayModel.date.getMonth()]] && !!~data.activeDates[dayModel.date.getFullYear()][monthNames[dayModel.date.getMonth()]].indexOf(dayModel.number)
                });
            })
        });
    });
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3RlbXBsYXRlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7Ozs7O0FBRUEsSUFBTSwyQkFBMkIsWUFBTSxBQUNuQzt3QkFBQSxBQUFTLEtBQVQsQUFBYyxBQUNqQjtBQUZELEFBQWdDLENBQUE7O0FBSWhDLElBQUcsc0JBQUgsQUFBeUIsZUFBUSxBQUFPLGlCQUFQLEFBQXdCLG9CQUFvQixZQUFNLEFBQUU7NEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtlQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7QUFBcEcsQ0FBQTs7Ozs7Ozs7O0FDTmpDOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsS0FBRCxBQUFNLE1BQVMsQUFDM0I7S0FBSSxNQUFNLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsaUJBQWpDLEFBQVUsQUFBYyxBQUEwQixBQUMvQztBQUVIOztLQUFHLENBQUMsSUFBSixBQUFRLFFBQVEsT0FBTyxRQUFBLEFBQVEsS0FBZixBQUFPLEFBQWEsQUFFcEM7O1lBQU8sQUFBSSxJQUFJLFVBQUEsQUFBQyxJQUFPLEFBQ3RCO2dCQUFPLEFBQU8sT0FBTyxPQUFBLEFBQU8sNEJBQXJCO1NBQWlELEFBQ2pELEFBQ047Y0FBVyxHQUFBLEFBQUcsYUFBSCxBQUFnQixxQkFBcUIs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QUFBO0FBQTlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBDYWxlbmRhciBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuICAgIENhbGVuZGFyLmluaXQoJy5qcy1jYWxlbmRhcicpO1xufV07XG4gICAgXG5pZignYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaCgoZm4pID0+IGZuKCkpOyB9KTsiLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcbiAgICAvL2xldCBlbHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSk7XG5cblx0aWYoIWVscy5sZW5ndGgpIHJldHVybiBjb25zb2xlLndhcm4oJ0NhbGVuZGFyIG5vdCBpbml0aWFsaXNlZCwgbm8gYXVnbWVudGFibGUgZWxlbWVudHMgZm91bmQnKTtcbiAgICBcblx0cmV0dXJuIGVscy5tYXAoKGVsKSA9PiB7XG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0XHRub2RlOiBlbCxcblx0XHRcdHN0YXJ0RGF0ZTogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN0YXJ0LWRhdGUnKSA/IG5ldyBEYXRlKGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zdGFydC1kYXRlJykpIDogZmFsc2UsXG5cdFx0XHRlbmREYXRlOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZW5kLWRhdGUnKSA/IG5ldyBEYXRlKGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1lbmQtZGF0ZScpKSA6IG5ldyBEYXRlKGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zdGFydC1kYXRlJykpLFxuXHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRzKVxuXHRcdH0pLmluaXQoKTtcblx0fSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJpbXBvcnQgeyBkaWZmRGF5cywgYWRkRGF5cywgbW9udGhOYW1lcywgbW9udGhWaWV3RmFjdG9yeSwgbW9udGhWaWV3RXhpc3RzLCBhY3RpdmF0ZURhdGVzIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBjYWxlbmRhciB9IGZyb20gJy4vdGVtcGxhdGVzJztcblxuY29uc3QgVFJJR0dFUl9FVkVOVFMgPSBbJ2NsaWNrJywgJ2tleWRvd24nXSxcblx0ICBUUklHR0VSX0tFWUNPREVTID0gWzEzLCAzMl07XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0aW5pdCgpIHtcblx0XHRsZXQgdG90YWxEYXlzID0gZGlmZkRheXModGhpcy5zdGFydERhdGUsIHRoaXMuZW5kRGF0ZSksXG5cdFx0XHRldmVudERhdGVPYmplY3RzID0gW107XG5cdFx0XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPD0gdG90YWxEYXlzOyBpKyspIGV2ZW50RGF0ZU9iamVjdHMucHVzaChhZGREYXlzKHRoaXMuc3RhcnREYXRlLCBpKSk7XG5cdFx0dGhpcy5kYXRhID0gZXZlbnREYXRlT2JqZWN0cy5yZWR1Y2UoKGFjYywgY3VycikgPT4ge1xuXHRcdFx0XHRsZXQgZXhpc3RpbmdNb250aEluZGV4ID0gYWNjLm1vbnRoVmlld3MubGVuZ3RoID8gYWNjLm1vbnRoVmlld3MucmVkdWNlKG1vbnRoVmlld0V4aXN0cyhjdXJyKSwgLTEpIDogZmFsc2U7XG5cdFx0XHRcdGlmKCFhY2MubW9udGhWaWV3cy5sZW5ndGggfHwgZXhpc3RpbmdNb250aEluZGV4ID09PSAtMSkgYWNjLm1vbnRoVmlld3MucHVzaChtb250aFZpZXdGYWN0b3J5KGN1cnIpKTtcblx0XHRcdFx0XG5cdFx0XHRcdGFjYy5hY3RpdmVEYXRlc1tjdXJyLmdldEZ1bGxZZWFyKCldID0gYWNjLmFjdGl2ZURhdGVzW2N1cnIuZ2V0RnVsbFllYXIoKV0gfHwge307XG5cdFx0XHRcdGlmKGFjYy5hY3RpdmVEYXRlc1tjdXJyLmdldEZ1bGxZZWFyKCldICYmIGFjYy5hY3RpdmVEYXRlc1tjdXJyLmdldEZ1bGxZZWFyKCldW21vbnRoTmFtZXNbY3Vyci5nZXRNb250aCgpXV0pIFxuXHRcdFx0XHRcdGFjYy5hY3RpdmVEYXRlc1tjdXJyLmdldEZ1bGxZZWFyKCldW21vbnRoTmFtZXNbY3Vyci5nZXRNb250aCgpXV0ucHVzaChjdXJyLmdldERhdGUoKSk7XG5cdFx0XHRcdGlmKCFhY2MuYWN0aXZlRGF0ZXNbY3Vyci5nZXRGdWxsWWVhcigpXVttb250aE5hbWVzW2N1cnIuZ2V0TW9udGgoKV1dKVxuXHRcdFx0XHRcdGFjYy5hY3RpdmVEYXRlc1tjdXJyLmdldEZ1bGxZZWFyKCldW21vbnRoTmFtZXNbY3Vyci5nZXRNb250aCgpXV0gPSBbY3Vyci5nZXREYXRlKCldO1xuXG5cdFx0XHRcdHJldHVybiBhY2M7XG5cdFx0XHR9LCB7IG1vbnRoVmlld3M6IFtdLCBhY3RpdmVEYXRlczoge30gfSk7XG5cdFx0XHRcblx0XHRldmVudERhdGVPYmplY3RzID0gW107XG5cdFx0XG5cdFx0dGhpcy5kYXRhLm1vbnRoVmlld3MgPSBhY3RpdmF0ZURhdGVzKHRoaXMuZGF0YSk7XG5cdFx0dGhpcy5yZW5kZXJWaWV3KDApO1xuXHRcdFxuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXHRyZW5kZXJWaWV3KGkpe1xuXHRcdHRoaXMubm9kZS5pbm5lckhUTUwgPSBjYWxlbmRhcih0aGlzLmRhdGEubW9udGhWaWV3c1tpXSk7XG5cdFx0dGhpcy5tYW5hZ2VCdXR0b25zKGkpO1xuXHR9LFxuXHRlbmFibGVCdXR0b24oYnRuLCB2YWx1ZSl7XG5cdFx0VFJJR0dFUl9FVkVOVFMuZm9yRWFjaChldiA9PiB7XG5cdFx0XHRidG4uYWRkRXZlbnRMaXN0ZW5lcihldiwgZSA9PiB7XG5cdFx0XHRcdGlmKCEhZS5rZXlDb2RlICYmICF+VFJJR0dFUl9LRVlDT0RFUy5pbmRleE9mKGUua2V5Q29kZSkpIHJldHVybjtcblx0XHRcdFx0dGhpcy5yZW5kZXJWaWV3LmNhbGwodGhpcywgdmFsdWUpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cdG1hbmFnZUJ1dHRvbnMoaSkge1xuXHRcdGxldCBiYWNrQnV0dG9uID0gdGhpcy5ub2RlLnF1ZXJ5U2VsZWN0b3IoJy5qcy1jYWxlbmRhcl9fYmFjaycpLFxuXHRcdFx0bmV4dEJ1dHRvbiA9IHRoaXMubm9kZS5xdWVyeVNlbGVjdG9yKCcuanMtY2FsZW5kYXJfX25leHQnKTtcblxuXHRcdC8vdXJnaC4uLlxuXHRcdGlmKGkgPT09IDApIHtcblx0XHRcdGJhY2tCdXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuXHRcdFx0dGhpcy5lbmFibGVCdXR0b24obmV4dEJ1dHRvbiwgaSArIDEpO1xuXHRcdH1cblx0XHRpZihpID09PSB0aGlzLmRhdGEubW9udGhWaWV3cy5sZW5ndGggLSAxKSB7XG5cdFx0XHRuZXh0QnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcblx0XHRcdHRoaXMuZW5hYmxlQnV0dG9uKGJhY2tCdXR0b24sIGkgLSAxKTtcblx0XHR9XG5cdFx0aWYoaSAhPT0gMCAmJiBpICE9PSB0aGlzLmRhdGEubW9udGhWaWV3cy5sZW5ndGggLSAxKSB7XG5cdFx0XHR0aGlzLmVuYWJsZUJ1dHRvbihuZXh0QnV0dG9uLCBpICsgMSk7XG5cdFx0XHR0aGlzLmVuYWJsZUJ1dHRvbihiYWNrQnV0dG9uLCBpIC0gMSk7XG5cdFx0fVxuXHR9XG59OyIsImV4cG9ydCBkZWZhdWx0IHtcblx0emVyb3BhZDogdHJ1ZSxcblx0Y2FsbGJhY2s6IG51bGxcbn07IiwiZXhwb3J0IGNvbnN0IGNhbGVuZGFyID0gcHJvcHMgPT4gYDxkaXYgY2xhc3M9XCJyZC1jb250YWluZXJcIiBzdHlsZT1cImRpc3BsYXk6IGlubGluZS1ibG9jaztcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyZC1kYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJkLW1vbnRoXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJyZC1iYWNrIGpzLWNhbGVuZGFyX19iYWNrXCIgdHlwZT1cImJ1dHRvblwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicmQtbmV4dCBqcy1jYWxlbmRhcl9fbmV4dFwiIHR5cGU9XCJidXR0b25cIj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJkLW1vbnRoLWxhYmVsXCI+JHtwcm9wcy5tb250aFRpdGxlfSAke3Byb3BzLnllYXJUaXRsZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwicmQtZGF5c1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoZWFkIGNsYXNzPVwicmQtZGF5cy1oZWFkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGNsYXNzPVwicmQtZGF5cy1yb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzPVwicmQtZGF5LWhlYWRcIj5NbzwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cInJkLWRheS1oZWFkXCI+VHU8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJyZC1kYXktaGVhZFwiPldlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzPVwicmQtZGF5LWhlYWRcIj5UaDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cInJkLWRheS1oZWFkXCI+RnI8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJyZC1kYXktaGVhZFwiPlNhPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzPVwicmQtZGF5LWhlYWRcIj5TdTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHkgY2xhc3M9XCJyZC1kYXlzLWJvZHlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tPHRyIGNsYXNzPVwicmQtZGF5cy1yb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwicmQtZGF5LWJvZHkgcmQtZGF5LXByZXYtbW9udGggcmQtZGF5LWRpc2FibGVkXCI+MzA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJyZC1kYXktYm9keSByZC1kYXktcHJldi1tb250aCByZC1kYXktZGlzYWJsZWRcIj4zMTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInJkLWRheS1ib2R5IHJkLWRheS1kaXNhYmxlZFwiPjAxPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwicmQtZGF5LWJvZHkgcmQtZGF5LWRpc2FibGVkXCI+MDI8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJyZC1kYXktYm9keSByZC1kYXktZGlzYWJsZWRcIj4wMzwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInJkLWRheS1ib2R5IHJkLWRheS1kaXNhYmxlZFwiPjA0PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwicmQtZGF5LWJvZHkgcmQtZGF5LWRpc2FibGVkXCI+MDU8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+LS0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtwcm9wcy5tb2RlbC5tYXAod2Vla3MocHJvcHMuYWN0aXZlKSkuam9pbignJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7XG5cbmNvbnN0IGRheSA9IChhY3RpdmVEYXlzLCBwcm9wcykgPT4gYDx0ZCBjbGFzcz1cInJkLWRheS1ib2R5ICR7cHJvcHMubmV4dE1vbnRoID8gJyByZC1kYXktbmV4dC1tb250aCcgOiAnJ30ke3Byb3BzLnByZXZpb3VzTW9udGggPyAnIHJkLWRheS1wcmV2LW1vbnRoJyA6ICcnfSR7cHJvcHMuYWN0aXZlID8gJyByZC1kYXktc2VsZWN0ZWQnIDogJyByZC1kYXktZGlzYWJsZWQnfVwiPiR7cHJvcHMubnVtYmVyfTwvdGQ+YDtcblxuY29uc3Qgd2Vla3MgPSBhY3RpdmVEYXlzID0+IChwcm9wcywgaSwgYXJyKSA9PiB7XG4gICAgaWYoaSA9PT0gMCkgcmV0dXJuIGA8dHIgY2xhc3M9XCJyZC1kYXlzLXJvd1wiPiR7ZGF5KGFjdGl2ZURheXMsIHByb3BzKX1gO1xuICAgIGVsc2UgaWYgKGkgPT09IGFyci5sZW5ndGggLSAxKSByZXR1cm4gYCR7ZGF5KGFjdGl2ZURheXMsIHByb3BzKX08L3RyPmA7XG4gICAgZWxzZSBpZigoaSsxKSAlIDcgPT09IDApIHJldHVybiBgJHtkYXkoYWN0aXZlRGF5cywgcHJvcHMpfTwvdHI+PHRyIGNsYXNzPVwicmQtZGF5cy1yb3dcIj5gO1xuICAgIGVsc2UgcmV0dXJuIGRheShhY3RpdmVEYXlzLCBwcm9wcyk7XG59OyIsImV4cG9ydCBjb25zdCBkaWZmRGF5cyA9IChhLCBiKSA9PiB7XG5cdGNvbnN0IE1TX1BFUl9EQVkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuXHQvLyBEaXNjYXJkIHRoZSB0aW1lIGFuZCB0aW1lLXpvbmUgaW5mb3JtYXRpb24uXG5cdGxldCB1dGMxID0gRGF0ZS5VVEMoYS5nZXRGdWxsWWVhcigpLCBhLmdldE1vbnRoKCksIGEuZ2V0RGF0ZSgpKSxcblx0XHR1dGMyID0gRGF0ZS5VVEMoYi5nZXRGdWxsWWVhcigpLCBiLmdldE1vbnRoKCksIGIuZ2V0RGF0ZSgpKTtcblxuICBcdHJldHVybiBNYXRoLmZsb29yKCh1dGMyIC0gdXRjMSkgLyBNU19QRVJfREFZKTtcbn07XG4vKlxub3IuLi5cbk1hdGgucm91bmQoTWF0aC5hYnMoKGEuZ2V0VGltZSgpIC0gYi5nZXRUaW1lKCkpLygyNCo2MCo2MCoxMDAwKSkpO1xuKi9cblxuZXhwb3J0IGNvbnN0IHplcm9wYWQgPSBuID0+IGAwJHtufWAuc2xpY2UoLTIpO1xuXG5leHBvcnQgY29uc3QgYWRkRGF5cyA9IChkYXRlLCBkYXlzKSA9PiB7XG5cdGxldCByZXN1bHQgPSBuZXcgRGF0ZShkYXRlKTtcblx0cmVzdWx0LnNldERhdGUocmVzdWx0LmdldERhdGUoKSArIGRheXMpO1xuXHRyZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGNvbnN0IG1vbnRoTmFtZXMgPSBbJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLCAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXTtcblxuY29uc3QgbW9udGhNb2RlbCA9ICh5ZWFyLCBtb250aCkgPT4ge1xuICAgIGxldCB0aGVNb250aCA9IG5ldyBEYXRlKHllYXIsIG1vbnRoICsgMSwgMCksXG4gICAgICAgIHRvdGFsRGF5cyA9IHRoZU1vbnRoLmdldERhdGUoKSxcbiAgICAgICAgZW5kRGF5ID0gdGhlTW9udGguZ2V0RGF5KCksXG4gICAgICAgIHN0YXJ0RGF5LFxuICAgICAgICBwcmV2TW9udGhTdGFydERheSA9IGZhbHNlLFxuICAgICAgICBwcmV2TW9udGggPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMCksXG4gICAgICAgIHByZXZNb250aEVuZERheSA9IHByZXZNb250aC5nZXREYXRlKCksXG4gICAgICAgIG91dHB1dCA9IFtdO1xuXG4gICAgdGhlTW9udGguc2V0RGF0ZSgxKTtcbiAgICBzdGFydERheSA9IHRoZU1vbnRoLmdldERheSgpO1xuICAgIFxuICAgIGlmKHN0YXJ0RGF5ICE9PSAxKSB7XG4gICAgICAgIGlmKHN0YXJ0RGF5ID09PSAwKSBwcmV2TW9udGhTdGFydERheSA9IHByZXZNb250aC5nZXREYXRlKCkgLSA1O1xuICAgICAgICBlbHNlIHByZXZNb250aFN0YXJ0RGF5ID0gcHJldk1vbnRoLmdldERhdGUoKSAtIChzdGFydERheSAtIDIpO1xuICAgIH1cblxuICAgIGlmKHByZXZNb250aFN0YXJ0RGF5KXtcbiAgICAgICAgd2hpbGUocHJldk1vbnRoU3RhcnREYXkgPD0gcHJldk1vbnRoRW5kRGF5KXtcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKHtcbiAgICAgICAgICAgICAgICBudW1iZXI6IHplcm9wYWQocHJldk1vbnRoU3RhcnREYXkpLFxuXHRcdFx0XHRwcmV2aW91c01vbnRoOiB0cnVlLFxuXHRcdFx0XHRkYXRlOiBuZXcgRGF0ZShwcmV2TW9udGguZ2V0RnVsbFllYXIoKSwgcHJldk1vbnRoLmdldE1vbnRoKCksIHByZXZNb250aFN0YXJ0RGF5KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmV2TW9udGhTdGFydERheSsrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvcihsZXQgaSA9IDE7IGkgPD0gdG90YWxEYXlzOyBpKyspIG91dHB1dC5wdXNoKHsgbnVtYmVyOiB6ZXJvcGFkKGkpLCBkYXRlOiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgaSl9KTtcblxuICAgIGlmKGVuZERheSAhPT0gMCkgZm9yKGxldCBpID0gMTsgaSA8PSAoNyAtIGVuZERheSk7IGkrKykgb3V0cHV0LnB1c2goeyBudW1iZXI6IHplcm9wYWQoaSksIG5leHRNb250aDogdHJ1ZSwgZGF0ZTogbmV3IERhdGUoeWVhciwgbW9udGggKyAxLCBpKX0pO1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbmV4cG9ydCBjb25zdCBtb250aFZpZXdGYWN0b3J5ID0gZGF5ID0+ICh7XG5cdG1vZGVsOiBtb250aE1vZGVsKGRheS5nZXRGdWxsWWVhcigpLCBkYXkuZ2V0TW9udGgoKSksXG5cdG1vbnRoVGl0bGU6IG1vbnRoTmFtZXNbZGF5LmdldE1vbnRoKCldLFxuXHR5ZWFyVGl0bGU6IGRheS5nZXRGdWxsWWVhcigpXG59KTtcblxuZXhwb3J0IGNvbnN0IG1vbnRoVmlld0V4aXN0cyA9IGRheSA9PiAoaWR4LCBtb250aFZpZXcsIGkpID0+IHtcblx0aWYobW9udGhWaWV3Lm1vbnRoVGl0bGUgPT09IG1vbnRoTmFtZXNbZGF5LmdldE1vbnRoKCldICYmIG1vbnRoVmlldy55ZWFyVGl0bGUgPT09IGRheS5nZXRGdWxsWWVhcigpKSBpZHggPSBpO1xuXHRyZXR1cm4gaWR4O1xufVxuXG5cbmV4cG9ydCBjb25zdCBhY3RpdmF0ZURhdGVzID0gZGF0YSA9PiBkYXRhLm1vbnRoVmlld3MubWFwKG1vbnRoVmlldyA9PiBPYmplY3QuYXNzaWduKHt9LCBtb250aFZpZXcsIHsgXG5cdG1vZGVsOiBtb250aFZpZXcubW9kZWwubWFwKGRheU1vZGVsID0+IE9iamVjdC5hc3NpZ24oe30sIGRheU1vZGVsLCB7IFxuXHRcdFx0YWN0aXZlOiBkYXRhLmFjdGl2ZURhdGVzW2RheU1vZGVsLmRhdGUuZ2V0RnVsbFllYXIoKV0gJiYgZGF0YS5hY3RpdmVEYXRlc1tkYXlNb2RlbC5kYXRlLmdldEZ1bGxZZWFyKCldW21vbnRoTmFtZXNbZGF5TW9kZWwuZGF0ZS5nZXRNb250aCgpXV0gJiYgISF+ZGF0YS5hY3RpdmVEYXRlc1tkYXlNb2RlbC5kYXRlLmdldEZ1bGxZZWFyKCldW21vbnRoTmFtZXNbZGF5TW9kZWwuZGF0ZS5nZXRNb250aCgpXV0uaW5kZXhPZihkYXlNb2RlbC5udW1iZXIpXG5cdFx0fSkpXG59KSk7Il19
