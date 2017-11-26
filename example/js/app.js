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
                number: prevMonthStartDay,
                previousMonth: true,
                date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonthStartDay)
            });
            prevMonthStartDay++;
        }
    }
    for (var i = 1; i <= totalDays; i++) {
        output.push({ number: i, date: new Date(year, month, i) });
    }if (endDay !== 0) for (var _i = 1; _i <= 7 - endDay; _i++) {
        output.push({ number: _i, nextMonth: true, date: new Date(year, month + 1, _i) });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3RlbXBsYXRlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7Ozs7O0FBRUEsSUFBTSwyQkFBMkIsWUFBTSxBQUNuQzt3QkFBQSxBQUFTLEtBQVQsQUFBYyxBQUNqQjtBQUZELEFBQWdDLENBQUE7O0FBSWhDLElBQUcsc0JBQUgsQUFBeUIsZUFBUSxBQUFPLGlCQUFQLEFBQXdCLG9CQUFvQixZQUFNLEFBQUU7NEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtlQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7QUFBcEcsQ0FBQTs7Ozs7Ozs7O0FDTmpDOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsS0FBRCxBQUFNLE1BQVMsQUFDM0I7S0FBSSxNQUFNLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsaUJBQWpDLEFBQVUsQUFBYyxBQUEwQixBQUMvQztBQUVIOztLQUFHLENBQUMsSUFBSixBQUFRLFFBQVEsT0FBTyxRQUFBLEFBQVEsS0FBZixBQUFPLEFBQWEsQUFFcEM7O1lBQU8sQUFBSSxJQUFJLFVBQUEsQUFBQyxJQUFPLEFBQ3RCO2dCQUFPLEFBQU8sT0FBTyxPQUFBLEFBQU8sNEJBQXJCO1NBQWlELEFBQ2pELEFBQ047Y0FBVyxHQUFBLEFBQUcsYUFBSCxBQUFnQixxQkFBcUIs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QixBQUN2QztBQURNOztBQU1BLElBQU0sNENBQWtCLFNBQWxCLEFBQWtCLHFCQUFBO1dBQU8sVUFBQSxBQUFDLEtBQUQsQUFBTSxXQUFOLEFBQWlCLEdBQU0sQUFDNUQ7WUFBRyxVQUFBLEFBQVUsZUFBZSxXQUFXLElBQXBDLEFBQXlCLEFBQVcsQUFBSSxlQUFlLFVBQUEsQUFBVSxjQUFjLElBQWxGLEFBQWtGLEFBQUksZUFBZSxNQUFBLEFBQU0sQUFDM0c7ZUFBQSxBQUFPLEFBQ1A7QUFIOEI7QUFBeEI7O0FBTUEsSUFBTSx3Q0FBZ0IsU0FBaEIsQUFBZ0Isb0JBQUE7Z0JBQVEsQUFBSyxXQUFMLEFBQWdCLElBQUkscUJBQUE7c0JBQWEsQUFBTyxPQUFQLEFBQWMsSUFBZCxBQUFrQjs2QkFDaEYsQUFBVSxNQUFWLEFBQWdCLElBQUksb0JBQUE7OEJBQVksQUFBTyxPQUFQLEFBQWMsSUFBZCxBQUFrQjs0QkFDL0MsS0FBQSxBQUFLLFlBQVksU0FBQSxBQUFTLEtBQTFCLEFBQWlCLEFBQWMsa0JBQWtCLEtBQUEsQUFBSyxZQUFZLFNBQUEsQUFBUyxLQUExQixBQUFpQixBQUFjLGVBQWUsV0FBVyxTQUFBLEFBQVMsS0FBbkgsQUFBaUQsQUFBOEMsQUFBVyxBQUFjLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFBLEFBQUssWUFBWSxTQUFBLEFBQVMsS0FBMUIsQUFBaUIsQUFBYyxlQUFlLFdBQVcsU0FBQSxBQUFTLEtBQWxFLEFBQThDLEFBQVcsQUFBYyxhQUF2RSxBQUFvRixRQUFRLFNBRHROLEFBQVksQUFBNEIsQUFDa0YsQUFBcUc7QUFEdkwsQUFDakUsaUJBRHFDO0FBRGlCLEFBQWEsQUFBNkIsQUFDM0YsYUFBQTtBQUQyRixBQUNsRyxTQURxRTtBQUF6QyxBQUFRLEtBQUE7QUFBOUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IENhbGVuZGFyIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG4gICAgQ2FsZW5kYXIuaW5pdCgnLmpzLWNhbGVuZGFyJyk7XG59XTtcbiAgICBcbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0pOyIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuXG5jb25zdCBpbml0ID0gKHNlbCwgb3B0cykgPT4ge1xuXHRsZXQgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuICAgIC8vbGV0IGVscyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcblxuXHRpZighZWxzLmxlbmd0aCkgcmV0dXJuIGNvbnNvbGUud2FybignQ2FsZW5kYXIgbm90IGluaXRpYWxpc2VkLCBubyBhdWdtZW50YWJsZSBlbGVtZW50cyBmb3VuZCcpO1xuICAgIFxuXHRyZXR1cm4gZWxzLm1hcCgoZWwpID0+IHtcblx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdG5vZGU6IGVsLFxuXHRcdFx0c3RhcnREYXRlOiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhcnQtZGF0ZScpID8gbmV3IERhdGUoZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN0YXJ0LWRhdGUnKSkgOiBmYWxzZSxcblx0XHRcdGVuZERhdGU6IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1lbmQtZGF0ZScpID8gbmV3IERhdGUoZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWVuZC1kYXRlJykpIDogbmV3IERhdGUoZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXN0YXJ0LWRhdGUnKSksXG5cdFx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpXG5cdFx0fSkuaW5pdCgpO1xuXHR9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsImltcG9ydCB7IGRpZmZEYXlzLCBhZGREYXlzLCBtb250aE5hbWVzLCBtb250aFZpZXdGYWN0b3J5LCBtb250aFZpZXdFeGlzdHMsIGFjdGl2YXRlRGF0ZXMgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IGNhbGVuZGFyIH0gZnJvbSAnLi90ZW1wbGF0ZXMnO1xuXG5jb25zdCBUUklHR0VSX0VWRU5UUyA9IFsnY2xpY2snLCAna2V5ZG93biddLFxuXHQgIFRSSUdHRVJfS0VZQ09ERVMgPSBbMTMsIDMyXTtcblxuZXhwb3J0IGRlZmF1bHQge1xuXHRpbml0KCkge1xuXHRcdGxldCB0b3RhbERheXMgPSBkaWZmRGF5cyh0aGlzLnN0YXJ0RGF0ZSwgdGhpcy5lbmREYXRlKSxcblx0XHRcdGV2ZW50RGF0ZU9iamVjdHMgPSBbXTtcblx0XHRcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8PSB0b3RhbERheXM7IGkrKykgZXZlbnREYXRlT2JqZWN0cy5wdXNoKGFkZERheXModGhpcy5zdGFydERhdGUsIGkpKTtcblx0XHR0aGlzLmRhdGEgPSBldmVudERhdGVPYmplY3RzLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiB7XG5cdFx0XHRcdGxldCBleGlzdGluZ01vbnRoSW5kZXggPSBhY2MubW9udGhWaWV3cy5sZW5ndGggPyBhY2MubW9udGhWaWV3cy5yZWR1Y2UobW9udGhWaWV3RXhpc3RzKGN1cnIpLCAtMSkgOiBmYWxzZTtcblx0XHRcdFx0aWYoIWFjYy5tb250aFZpZXdzLmxlbmd0aCB8fCBleGlzdGluZ01vbnRoSW5kZXggPT09IC0xKSBhY2MubW9udGhWaWV3cy5wdXNoKG1vbnRoVmlld0ZhY3RvcnkoY3VycikpO1xuXHRcdFx0XHRcblx0XHRcdFx0YWNjLmFjdGl2ZURhdGVzW2N1cnIuZ2V0RnVsbFllYXIoKV0gPSBhY2MuYWN0aXZlRGF0ZXNbY3Vyci5nZXRGdWxsWWVhcigpXSB8fCB7fTtcblx0XHRcdFx0aWYoYWNjLmFjdGl2ZURhdGVzW2N1cnIuZ2V0RnVsbFllYXIoKV0gJiYgYWNjLmFjdGl2ZURhdGVzW2N1cnIuZ2V0RnVsbFllYXIoKV1bbW9udGhOYW1lc1tjdXJyLmdldE1vbnRoKCldXSkgXG5cdFx0XHRcdFx0YWNjLmFjdGl2ZURhdGVzW2N1cnIuZ2V0RnVsbFllYXIoKV1bbW9udGhOYW1lc1tjdXJyLmdldE1vbnRoKCldXS5wdXNoKGN1cnIuZ2V0RGF0ZSgpKTtcblx0XHRcdFx0aWYoIWFjYy5hY3RpdmVEYXRlc1tjdXJyLmdldEZ1bGxZZWFyKCldW21vbnRoTmFtZXNbY3Vyci5nZXRNb250aCgpXV0pXG5cdFx0XHRcdFx0YWNjLmFjdGl2ZURhdGVzW2N1cnIuZ2V0RnVsbFllYXIoKV1bbW9udGhOYW1lc1tjdXJyLmdldE1vbnRoKCldXSA9IFtjdXJyLmdldERhdGUoKV07XG5cblx0XHRcdFx0cmV0dXJuIGFjYztcblx0XHRcdH0sIHsgbW9udGhWaWV3czogW10sIGFjdGl2ZURhdGVzOiB7fSB9KTtcblx0XHRcdFxuXHRcdGV2ZW50RGF0ZU9iamVjdHMgPSBbXTtcblx0XHRcblx0XHR0aGlzLmRhdGEubW9udGhWaWV3cyA9IGFjdGl2YXRlRGF0ZXModGhpcy5kYXRhKTtcblx0XHR0aGlzLnJlbmRlclZpZXcoMCk7XG5cdFx0XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cdHJlbmRlclZpZXcoaSl7XG5cdFx0dGhpcy5ub2RlLmlubmVySFRNTCA9IGNhbGVuZGFyKHRoaXMuZGF0YS5tb250aFZpZXdzW2ldKTtcblx0XHR0aGlzLm1hbmFnZUJ1dHRvbnMoaSk7XG5cdH0sXG5cdGVuYWJsZUJ1dHRvbihidG4sIHZhbHVlKXtcblx0XHRUUklHR0VSX0VWRU5UUy5mb3JFYWNoKGV2ID0+IHtcblx0XHRcdGJ0bi5hZGRFdmVudExpc3RlbmVyKGV2LCBlID0+IHtcblx0XHRcdFx0aWYoISFlLmtleUNvZGUgJiYgIX5UUklHR0VSX0tFWUNPREVTLmluZGV4T2YoZS5rZXlDb2RlKSkgcmV0dXJuO1xuXHRcdFx0XHR0aGlzLnJlbmRlclZpZXcuY2FsbCh0aGlzLCB2YWx1ZSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblx0bWFuYWdlQnV0dG9ucyhpKSB7XG5cdFx0bGV0IGJhY2tCdXR0b24gPSB0aGlzLm5vZGUucXVlcnlTZWxlY3RvcignLmpzLWNhbGVuZGFyX19iYWNrJyksXG5cdFx0XHRuZXh0QnV0dG9uID0gdGhpcy5ub2RlLnF1ZXJ5U2VsZWN0b3IoJy5qcy1jYWxlbmRhcl9fbmV4dCcpO1xuXG5cdFx0Ly91cmdoLi4uXG5cdFx0aWYoaSA9PT0gMCkge1xuXHRcdFx0YmFja0J1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG5cdFx0XHR0aGlzLmVuYWJsZUJ1dHRvbihuZXh0QnV0dG9uLCBpICsgMSk7XG5cdFx0fVxuXHRcdGlmKGkgPT09IHRoaXMuZGF0YS5tb250aFZpZXdzLmxlbmd0aCAtIDEpIHtcblx0XHRcdG5leHRCdXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuXHRcdFx0dGhpcy5lbmFibGVCdXR0b24oYmFja0J1dHRvbiwgaSAtIDEpO1xuXHRcdH1cblx0XHRpZihpICE9PSAwICYmIGkgIT09IHRoaXMuZGF0YS5tb250aFZpZXdzLmxlbmd0aCAtIDEpIHtcblx0XHRcdHRoaXMuZW5hYmxlQnV0dG9uKG5leHRCdXR0b24sIGkgKyAxKTtcblx0XHRcdHRoaXMuZW5hYmxlQnV0dG9uKGJhY2tCdXR0b24sIGkgLSAxKTtcblx0XHR9XG5cdH1cbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuXHRjYWxsYmFjazogbnVsbFxufTsiLCJleHBvcnQgY29uc3QgY2FsZW5kYXIgPSBwcm9wcyA9PiBgPGRpdiBjbGFzcz1cInJkLWNvbnRhaW5lclwiIHN0eWxlPVwiZGlzcGxheTogaW5saW5lLWJsb2NrO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJkLWRhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmQtbW9udGhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInJkLWJhY2sganMtY2FsZW5kYXJfX2JhY2tcIiB0eXBlPVwiYnV0dG9uXCI+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJyZC1uZXh0IGpzLWNhbGVuZGFyX19uZXh0XCIgdHlwZT1cImJ1dHRvblwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmQtbW9udGgtbGFiZWxcIj4ke3Byb3BzLm1vbnRoVGl0bGV9ICR7cHJvcHMueWVhclRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJyZC1kYXlzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGhlYWQgY2xhc3M9XCJyZC1kYXlzLWhlYWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIgY2xhc3M9XCJyZC1kYXlzLXJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJyZC1kYXktaGVhZFwiPk1vPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzPVwicmQtZGF5LWhlYWRcIj5UdTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cInJkLWRheS1oZWFkXCI+V2U8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJyZC1kYXktaGVhZFwiPlRoPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzPVwicmQtZGF5LWhlYWRcIj5GcjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cInJkLWRheS1oZWFkXCI+U2E8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJyZC1kYXktaGVhZFwiPlN1PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keSBjbGFzcz1cInJkLWRheXMtYm9keVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS08dHIgY2xhc3M9XCJyZC1kYXlzLXJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJyZC1kYXktYm9keSByZC1kYXktcHJldi1tb250aCByZC1kYXktZGlzYWJsZWRcIj4zMDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInJkLWRheS1ib2R5IHJkLWRheS1wcmV2LW1vbnRoIHJkLWRheS1kaXNhYmxlZFwiPjMxPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwicmQtZGF5LWJvZHkgcmQtZGF5LWRpc2FibGVkXCI+MDE8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJyZC1kYXktYm9keSByZC1kYXktZGlzYWJsZWRcIj4wMjwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInJkLWRheS1ib2R5IHJkLWRheS1kaXNhYmxlZFwiPjAzPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwicmQtZGF5LWJvZHkgcmQtZGF5LWRpc2FibGVkXCI+MDQ8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJyZC1kYXktYm9keSByZC1kYXktZGlzYWJsZWRcIj4wNTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj4tLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3Byb3BzLm1vZGVsLm1hcCh3ZWVrcyhwcm9wcy5hY3RpdmUpKS5qb2luKCcnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcblxuY29uc3QgZGF5ID0gKGFjdGl2ZURheXMsIHByb3BzKSA9PiBgPHRkIGNsYXNzPVwicmQtZGF5LWJvZHkgJHtwcm9wcy5uZXh0TW9udGggPyAnIHJkLWRheS1uZXh0LW1vbnRoJyA6ICcnfSR7cHJvcHMucHJldmlvdXNNb250aCA/ICcgcmQtZGF5LXByZXYtbW9udGgnIDogJyd9JHtwcm9wcy5hY3RpdmUgPyAnIHJkLWRheS1zZWxlY3RlZCcgOiAnIHJkLWRheS1kaXNhYmxlZCd9XCI+JHtwcm9wcy5udW1iZXJ9PC90ZD5gO1xuXG5jb25zdCB3ZWVrcyA9IGFjdGl2ZURheXMgPT4gKHByb3BzLCBpLCBhcnIpID0+IHtcbiAgICBpZihpID09PSAwKSByZXR1cm4gYDx0ciBjbGFzcz1cInJkLWRheXMtcm93XCI+JHtkYXkoYWN0aXZlRGF5cywgcHJvcHMpfWA7XG4gICAgZWxzZSBpZiAoaSA9PT0gYXJyLmxlbmd0aCAtIDEpIHJldHVybiBgJHtkYXkoYWN0aXZlRGF5cywgcHJvcHMpfTwvdHI+YDtcbiAgICBlbHNlIGlmKChpKzEpICUgNyA9PT0gMCkgcmV0dXJuIGAke2RheShhY3RpdmVEYXlzLCBwcm9wcyl9PC90cj48dHIgY2xhc3M9XCJyZC1kYXlzLXJvd1wiPmA7XG4gICAgZWxzZSByZXR1cm4gZGF5KGFjdGl2ZURheXMsIHByb3BzKTtcbn07IiwiZXhwb3J0IGNvbnN0IGRpZmZEYXlzID0gKGEsIGIpID0+IHtcblx0Y29uc3QgTVNfUEVSX0RBWSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG5cdC8vIERpc2NhcmQgdGhlIHRpbWUgYW5kIHRpbWUtem9uZSBpbmZvcm1hdGlvbi5cblx0bGV0IHV0YzEgPSBEYXRlLlVUQyhhLmdldEZ1bGxZZWFyKCksIGEuZ2V0TW9udGgoKSwgYS5nZXREYXRlKCkpLFxuXHRcdHV0YzIgPSBEYXRlLlVUQyhiLmdldEZ1bGxZZWFyKCksIGIuZ2V0TW9udGgoKSwgYi5nZXREYXRlKCkpO1xuXG4gIFx0cmV0dXJuIE1hdGguZmxvb3IoKHV0YzIgLSB1dGMxKSAvIE1TX1BFUl9EQVkpO1xufTtcbi8qXG5vci4uLlxuTWF0aC5yb3VuZChNYXRoLmFicygoYS5nZXRUaW1lKCkgLSBiLmdldFRpbWUoKSkvKDI0KjYwKjYwKjEwMDApKSk7XG4qL1xuXG5leHBvcnQgY29uc3QgYWRkRGF5cyA9IChkYXRlLCBkYXlzKSA9PiB7XG5cdGxldCByZXN1bHQgPSBuZXcgRGF0ZShkYXRlKTtcblx0cmVzdWx0LnNldERhdGUocmVzdWx0LmdldERhdGUoKSArIGRheXMpO1xuXHRyZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGNvbnN0IG1vbnRoTmFtZXMgPSBbJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLCAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXTtcblxuY29uc3QgbW9udGhNb2RlbCA9ICh5ZWFyLCBtb250aCkgPT4ge1xuICAgIGxldCB0aGVNb250aCA9IG5ldyBEYXRlKHllYXIsIG1vbnRoICsgMSwgMCksXG4gICAgICAgIHRvdGFsRGF5cyA9IHRoZU1vbnRoLmdldERhdGUoKSxcbiAgICAgICAgZW5kRGF5ID0gdGhlTW9udGguZ2V0RGF5KCksXG4gICAgICAgIHN0YXJ0RGF5LFxuICAgICAgICBwcmV2TW9udGhTdGFydERheSA9IGZhbHNlLFxuICAgICAgICBwcmV2TW9udGggPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMCksXG4gICAgICAgIHByZXZNb250aEVuZERheSA9IHByZXZNb250aC5nZXREYXRlKCksXG4gICAgICAgIG91dHB1dCA9IFtdO1xuXG4gICAgdGhlTW9udGguc2V0RGF0ZSgxKTtcbiAgICBzdGFydERheSA9IHRoZU1vbnRoLmdldERheSgpO1xuICAgIFxuICAgIGlmKHN0YXJ0RGF5ICE9PSAxKSB7XG4gICAgICAgIGlmKHN0YXJ0RGF5ID09PSAwKSBwcmV2TW9udGhTdGFydERheSA9IHByZXZNb250aC5nZXREYXRlKCkgLSA1O1xuICAgICAgICBlbHNlIHByZXZNb250aFN0YXJ0RGF5ID0gcHJldk1vbnRoLmdldERhdGUoKSAtIChzdGFydERheSAtIDIpO1xuICAgIH1cblxuICAgIGlmKHByZXZNb250aFN0YXJ0RGF5KXtcbiAgICAgICAgd2hpbGUocHJldk1vbnRoU3RhcnREYXkgPD0gcHJldk1vbnRoRW5kRGF5KXtcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKHtcbiAgICAgICAgICAgICAgICBudW1iZXI6IHByZXZNb250aFN0YXJ0RGF5LFxuXHRcdFx0XHRwcmV2aW91c01vbnRoOiB0cnVlLFxuXHRcdFx0XHRkYXRlOiBuZXcgRGF0ZShwcmV2TW9udGguZ2V0RnVsbFllYXIoKSwgcHJldk1vbnRoLmdldE1vbnRoKCksIHByZXZNb250aFN0YXJ0RGF5KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmV2TW9udGhTdGFydERheSsrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvcihsZXQgaSA9IDE7IGkgPD0gdG90YWxEYXlzOyBpKyspIG91dHB1dC5wdXNoKHsgbnVtYmVyOiBpLCBkYXRlOiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgaSl9KTtcblxuICAgIGlmKGVuZERheSAhPT0gMCkgZm9yKGxldCBpID0gMTsgaSA8PSAoNyAtIGVuZERheSk7IGkrKykgb3V0cHV0LnB1c2goeyBudW1iZXI6IGksIG5leHRNb250aDogdHJ1ZSwgZGF0ZTogbmV3IERhdGUoeWVhciwgbW9udGggKyAxLCBpKX0pO1xuXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbmV4cG9ydCBjb25zdCBtb250aFZpZXdGYWN0b3J5ID0gZGF5ID0+ICh7XG5cdG1vZGVsOiBtb250aE1vZGVsKGRheS5nZXRGdWxsWWVhcigpLCBkYXkuZ2V0TW9udGgoKSksXG5cdG1vbnRoVGl0bGU6IG1vbnRoTmFtZXNbZGF5LmdldE1vbnRoKCldLFxuXHR5ZWFyVGl0bGU6IGRheS5nZXRGdWxsWWVhcigpXG59KTtcblxuZXhwb3J0IGNvbnN0IG1vbnRoVmlld0V4aXN0cyA9IGRheSA9PiAoaWR4LCBtb250aFZpZXcsIGkpID0+IHtcblx0aWYobW9udGhWaWV3Lm1vbnRoVGl0bGUgPT09IG1vbnRoTmFtZXNbZGF5LmdldE1vbnRoKCldICYmIG1vbnRoVmlldy55ZWFyVGl0bGUgPT09IGRheS5nZXRGdWxsWWVhcigpKSBpZHggPSBpO1xuXHRyZXR1cm4gaWR4O1xufVxuXG5cbmV4cG9ydCBjb25zdCBhY3RpdmF0ZURhdGVzID0gZGF0YSA9PiBkYXRhLm1vbnRoVmlld3MubWFwKG1vbnRoVmlldyA9PiBPYmplY3QuYXNzaWduKHt9LCBtb250aFZpZXcsIHsgXG5cdG1vZGVsOiBtb250aFZpZXcubW9kZWwubWFwKGRheU1vZGVsID0+IE9iamVjdC5hc3NpZ24oe30sIGRheU1vZGVsLCB7IFxuXHRcdFx0YWN0aXZlOiBkYXRhLmFjdGl2ZURhdGVzW2RheU1vZGVsLmRhdGUuZ2V0RnVsbFllYXIoKV0gJiYgZGF0YS5hY3RpdmVEYXRlc1tkYXlNb2RlbC5kYXRlLmdldEZ1bGxZZWFyKCldW21vbnRoTmFtZXNbZGF5TW9kZWwuZGF0ZS5nZXRNb250aCgpXV0gJiYgISF+ZGF0YS5hY3RpdmVEYXRlc1tkYXlNb2RlbC5kYXRlLmdldEZ1bGxZZWFyKCldW21vbnRoTmFtZXNbZGF5TW9kZWwuZGF0ZS5nZXRNb250aCgpXV0uaW5kZXhPZihkYXlNb2RlbC5udW1iZXIpXG5cdFx0fSkpXG59KSk7Il19
