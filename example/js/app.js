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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL3RlbXBsYXRlcy5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7Ozs7O0FBRUEsSUFBTSwyQkFBMkIsWUFBTSxBQUNuQzt3QkFBQSxBQUFTLEtBQVQsQUFBYyxBQUNqQjtBQUZELEFBQWdDLENBQUE7O0FBSWhDLElBQUcsc0JBQUgsQUFBeUIsZUFBUSxBQUFPLGlCQUFQLEFBQXdCLG9CQUFvQixZQUFNLEFBQUU7NEJBQUEsQUFBd0IsUUFBUSxVQUFBLEFBQUMsSUFBRDtlQUFBLEFBQVE7QUFBeEMsQUFBZ0Q7QUFBcEcsQ0FBQTs7Ozs7Ozs7O0FDTmpDOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsQUFBTyxLQUFBLEFBQUMsS0FBRCxBQUFNLE1BQVMsQUFDM0I7S0FBSSxNQUFNLEdBQUEsQUFBRyxNQUFILEFBQVMsS0FBSyxTQUFBLEFBQVMsaUJBQWpDLEFBQVUsQUFBYyxBQUEwQixBQUMvQztBQUVIOztLQUFHLENBQUMsSUFBSixBQUFRLFFBQVEsT0FBTyxRQUFBLEFBQVEsS0FBZixBQUFPLEFBQWEsQUFFcEM7O1lBQU8sQUFBSSxJQUFJLFVBQUEsQUFBQyxJQUFPLEFBQ3RCO2dCQUFPLEFBQU8sT0FBTyxPQUFBLEFBQU8sNEJBQXJCO1NBQWlELEFBQ2pELEFBQ047Y0FBVyxHQUFBLEFBQUcsYUFBSCxBQUFnQixxQkFBcUIsSUFBQSxBQUFJLEtBQUssR0FBQSxBQUFHLGFBQWpELEFBQXFDLEFBQVMsQUFBZ0Isc0JBRmxCLEFBRXdDLEFBQy9GO1lBQVMsR0FBQSxBQUFHLGFBQUgsQUFBZ0IsbUJBQW1CLElBQUEsQUFBSSxLQUFLLEdBQUEsQUFBRyxhQUEvQyxBQUFtQyxBQUFTLEFBQWdCLG9CQUhkLEFBR2tDLEFBQ3pGO2FBQVUsT0FBQSxBQUFPLE9BQVAsQUFBYyx3QkFKbEIsQUFBaUQsQUFJN0MsQUFBNEI7QUFKaUIsQUFDdkQsR0FETSxFQUFQLEFBQU8sQUFLSixBQUNIO0FBUEQsQUFBTyxBQVFQLEVBUk87QUFOUjs7a0JBZ0JlLEVBQUUsTSxBQUFGOzs7Ozs7Ozs7QUNuQmY7O0FBQ0E7O0FBRUEsSUFBTSxpQkFBaUIsQ0FBQSxBQUFDLFNBQXhCLEFBQXVCLEFBQVU7SUFDOUIsbUJBQW1CLENBQUEsQUFBQyxJQUR2QixBQUNzQixBQUFLOzs7QUFFWix1QkFDUCxBQUNOO01BQUksWUFBWSxxQkFBUyxLQUFULEFBQWMsV0FBVyxLQUF6QyxBQUFnQixBQUE4QjtNQUM3QyxtQkFERCxBQUNvQixBQUVwQjs7T0FBSyxJQUFJLElBQVQsQUFBYSxHQUFHLEtBQWhCLEFBQXFCLFdBQXJCLEFBQWdDLEtBQUs7b0JBQUEsQUFBaUIsS0FBSyxvQkFBUSxLQUFSLEFBQWEsV0FBeEUsQUFBcUMsQUFBc0IsQUFBd0I7QUFDbkYsUUFBQSxBQUFLLHdCQUFPLEFBQWlCLE9BQU8sVUFBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQ2pEO09BQUkscUJBQXFCLElBQUEsQUFBSSxXQUFKLEFBQWUsU0FBUyxJQUFBLEFBQUksV0FBSixBQUFlLE9BQU8sNEJBQXRCLEFBQXNCLEFBQWdCLE9BQU8sQ0FBckUsQUFBd0IsQUFBOEMsS0FBL0YsQUFBb0csQUFDcEc7T0FBRyxDQUFDLElBQUEsQUFBSSxXQUFMLEFBQWdCLFVBQVUsdUJBQXVCLENBQXBELEFBQXFELEdBQUcsSUFBQSxBQUFJLFdBQUosQUFBZSxLQUFLLDZCQUFwQixBQUFvQixBQUFpQixBQUU3Rjs7T0FBQSxBQUFJLFlBQVksS0FBaEIsQUFBZ0IsQUFBSyxpQkFBaUIsSUFBQSxBQUFJLFlBQVksS0FBaEIsQUFBZ0IsQUFBSyxrQkFBM0QsQUFBNkUsQUFDN0U7T0FBRyxJQUFBLEFBQUksWUFBWSxLQUFoQixBQUFnQixBQUFLLGtCQUFrQixJQUFBLEFBQUksWUFBWSxLQUFoQixBQUFnQixBQUFLLGVBQWUsa0JBQVcsS0FBekYsQUFBMEMsQUFBb0MsQUFBVyxBQUFLLGNBQzdGLElBQUEsQUFBSSxZQUFZLEtBQWhCLEFBQWdCLEFBQUssZUFBZSxrQkFBVyxLQUEvQyxBQUFvQyxBQUFXLEFBQUssYUFBcEQsQUFBaUUsS0FBSyxLQUF0RSxBQUFzRSxBQUFLLEFBQzVFO09BQUcsQ0FBQyxJQUFBLEFBQUksWUFBWSxLQUFoQixBQUFnQixBQUFLLGVBQWUsa0JBQVcsS0FBbkQsQUFBSSxBQUFvQyxBQUFXLEFBQUssY0FDdkQsSUFBQSxBQUFJLFlBQVksS0FBaEIsQUFBZ0IsQUFBSyxlQUFlLGtCQUFXLEtBQS9DLEFBQW9DLEFBQVcsQUFBSyxlQUFlLENBQUMsS0FBcEUsQUFBbUUsQUFBQyxBQUFLLEFBRTFFOztVQUFBLEFBQU8sQUFDUDtBQVhVLEdBQUEsRUFXUixFQUFFLFlBQUYsQUFBYyxJQUFJLGFBWHRCLEFBQVksQUFXUixBQUErQixBQUVuQzs7cUJBQUEsQUFBbUIsQUFFbkI7O09BQUEsQUFBSyxLQUFMLEFBQVUsYUFBYSwwQkFBYyxLQUFyQyxBQUF1QixBQUFtQixBQUMxQztPQUFBLEFBQUssV0FBTCxBQUFnQixBQUVoQjs7U0FBQSxBQUFPLEFBQ1A7QUF6QmEsQUEwQmQ7QUExQmMsaUNBQUEsQUEwQkgsR0FBRSxBQUNaO09BQUEsQUFBSyxLQUFMLEFBQVUsWUFBWSx5QkFBUyxLQUFBLEFBQUssS0FBTCxBQUFVLFdBQXpDLEFBQXNCLEFBQVMsQUFBcUIsQUFDcEQ7T0FBQSxBQUFLLGNBQUwsQUFBbUIsQUFDbkI7QUE3QmEsQUE4QmQ7QUE5QmMscUNBQUEsQUE4QkQsS0E5QkMsQUE4QkksT0FBTTtjQUN2Qjs7aUJBQUEsQUFBZSxRQUFRLGNBQU0sQUFDNUI7T0FBQSxBQUFJLGlCQUFKLEFBQXFCLElBQUksYUFBSyxBQUM3QjtRQUFHLENBQUMsQ0FBQyxFQUFGLEFBQUksV0FBVyxDQUFDLENBQUMsaUJBQUEsQUFBaUIsUUFBUSxFQUE3QyxBQUFvQixBQUEyQixVQUFVLEFBQ3pEO1VBQUEsQUFBSyxXQUFMLEFBQWdCLFlBQWhCLEFBQTJCLEFBQzNCO0FBSEQsQUFJQTtBQUxELEFBTUE7QUFyQ2EsQUFzQ2Q7QUF0Q2MsdUNBQUEsQUFzQ0EsR0FBRyxBQUNoQjtNQUFJLGFBQWEsS0FBQSxBQUFLLEtBQUwsQUFBVSxjQUEzQixBQUFpQixBQUF3QjtNQUN4QyxhQUFhLEtBQUEsQUFBSyxLQUFMLEFBQVUsY0FEeEIsQUFDYyxBQUF3QixBQUV0Qzs7QUFDQTtNQUFHLE1BQUgsQUFBUyxHQUFHLEFBQ1g7Y0FBQSxBQUFXLGFBQVgsQUFBd0IsWUFBeEIsQUFBb0MsQUFDcEM7UUFBQSxBQUFLLGFBQUwsQUFBa0IsWUFBWSxJQUE5QixBQUFrQyxBQUNsQztBQUNEO01BQUcsTUFBTSxLQUFBLEFBQUssS0FBTCxBQUFVLFdBQVYsQUFBcUIsU0FBOUIsQUFBdUMsR0FBRyxBQUN6QztjQUFBLEFBQVcsYUFBWCxBQUF3QixZQUF4QixBQUFvQyxBQUNwQztRQUFBLEFBQUssYUFBTCxBQUFrQixZQUFZLElBQTlCLEFBQWtDLEFBQ2xDO0FBQ0Q7TUFBRyxNQUFBLEFBQU0sS0FBSyxNQUFNLEtBQUEsQUFBSyxLQUFMLEFBQVUsV0FBVixBQUFxQixTQUF6QyxBQUFrRCxHQUFHLEFBQ3BEO1FBQUEsQUFBSyxhQUFMLEFBQWtCLFlBQVksSUFBOUIsQUFBa0MsQUFDbEM7UUFBQSxBQUFLLGFBQUwsQUFBa0IsWUFBWSxJQUE5QixBQUFrQyxBQUNsQztBQUNEO0EsQUF2RGE7QUFBQSxBQUNkOzs7Ozs7Ozs7VyxBQ1BjLEFBQ0o7QUFESSxBQUNkOzs7Ozs7OztBQ0RNLElBQU0sOEJBQVcsU0FBWCxBQUFXLGdCQUFBOzRlQUtrRCxNQUxsRCxBQUt3RCxtQkFBYyxNQUx0RSxBQUs0RSxtL0RBdUI5QyxNQUFBLEFBQU0sTUFBTixBQUFZLElBQUksTUFBTSxNQUF0QixBQUFnQixBQUFZLFNBQTVCLEFBQXFDLEtBNUJuRSxBQTRCOEIsQUFBMEMsTUE1QnhFO0FBQWpCOztBQW1DUCxJQUFNLE1BQU0sU0FBTixBQUFNLElBQUEsQUFBQyxZQUFELEFBQWEsT0FBYjt3Q0FBaUQsTUFBQSxBQUFNLFlBQU4sQUFBa0IsdUJBQW5FLEFBQTBGLE9BQUssTUFBQSxBQUFNLGdCQUFOLEFBQXNCLHVCQUFySCxBQUE0SSxPQUFLLE1BQUEsQUFBTSxTQUFOLEFBQWUscUJBQWhLLEFBQXFMLDZCQUF1QixNQUE1TSxBQUFrTixTQUFsTjtBQUFaOztBQUVBLElBQU0sUUFBUSxTQUFSLEFBQVEsa0JBQUE7V0FBYyxVQUFBLEFBQUMsT0FBRCxBQUFRLEdBQVIsQUFBVyxLQUFRLEFBQzNDO1lBQUcsTUFBSCxBQUFTLEdBQUcsb0NBQWtDLElBQUEsQUFBSSxZQUFsRCxBQUFZLEFBQWtDLEFBQWdCLFlBQ3pELElBQUksTUFBTSxJQUFBLEFBQUksU0FBZCxBQUF1QixHQUFHLE9BQVUsSUFBQSxBQUFJLFlBQWQsQUFBVSxBQUFnQixTQUFwRCxhQUNBLElBQUcsQ0FBQyxJQUFELEFBQUcsS0FBSCxBQUFRLE1BQVgsQUFBaUIsR0FBRyxPQUFVLElBQUEsQUFBSSxZQUFkLEFBQVUsQUFBZ0IsU0FBOUMscUNBQ0EsT0FBTyxJQUFBLEFBQUksWUFBWCxBQUFPLEFBQWdCLEFBQy9CO0FBTGE7QUFBZDs7Ozs7Ozs7QUNyQ08sSUFBTSw4QkFBVyxTQUFYLEFBQVcsU0FBQSxBQUFDLEdBQUQsQUFBSSxHQUFNLEFBQ2pDO1FBQU0sYUFBYSxPQUFBLEFBQU8sS0FBUCxBQUFZLEtBQS9CLEFBQW9DLEFBQ3BDO0FBQ0E7UUFBSSxPQUFPLEtBQUEsQUFBSyxJQUFJLEVBQVQsQUFBUyxBQUFFLGVBQWUsRUFBMUIsQUFBMEIsQUFBRSxZQUFZLEVBQW5ELEFBQVcsQUFBd0MsQUFBRTtRQUNwRCxPQUFPLEtBQUEsQUFBSyxJQUFJLEVBQVQsQUFBUyxBQUFFLGVBQWUsRUFBMUIsQUFBMEIsQUFBRSxZQUFZLEVBRGhELEFBQ1EsQUFBd0MsQUFBRSxBQUVoRDs7V0FBTyxLQUFBLEFBQUssTUFBTSxDQUFDLE9BQUQsQUFBUSxRQUExQixBQUFPLEFBQTJCLEFBQ3BDO0FBUE07QUFRUDs7Ozs7QUFLTyxJQUFNLDRCQUFVLFNBQVYsQUFBVSxRQUFBLEFBQUMsTUFBRCxBQUFPLE1BQVMsQUFDdEM7UUFBSSxTQUFTLElBQUEsQUFBSSxLQUFqQixBQUFhLEFBQVMsQUFDdEI7V0FBQSxBQUFPLFFBQVEsT0FBQSxBQUFPLFlBQXRCLEFBQWtDLEFBQ2xDO1dBQUEsQUFBTyxBQUNQO0FBSk07O0FBTUEsSUFBTSxrQ0FBYSxDQUFBLEFBQUMsV0FBRCxBQUFZLFlBQVosQUFBd0IsU0FBeEIsQUFBaUMsU0FBakMsQUFBMEMsT0FBMUMsQUFBaUQsUUFBakQsQUFBeUQsUUFBekQsQUFBaUUsVUFBakUsQUFBMkUsYUFBM0UsQUFBd0YsV0FBeEYsQUFBbUcsWUFBdEgsQUFBbUIsQUFBK0c7O0FBRXpJLElBQU0sYUFBYSxTQUFiLEFBQWEsV0FBQSxBQUFDLE1BQUQsQUFBTyxPQUFVLEFBQ2hDO1FBQUksV0FBVyxJQUFBLEFBQUksS0FBSixBQUFTLE1BQU0sUUFBZixBQUF1QixHQUF0QyxBQUFlLEFBQTBCO1FBQ3JDLFlBQVksU0FEaEIsQUFDZ0IsQUFBUztRQUNyQixTQUFTLFNBRmIsQUFFYSxBQUFTO1FBQ2xCLGdCQUhKO1FBSUksb0JBSkosQUFJd0I7UUFDcEIsWUFBWSxJQUFBLEFBQUksS0FBSixBQUFTLE1BQVQsQUFBZSxPQUwvQixBQUtnQixBQUFzQjtRQUNsQyxrQkFBa0IsVUFOdEIsQUFNc0IsQUFBVTtRQUM1QixTQVBKLEFBT2EsQUFFYjs7YUFBQSxBQUFTLFFBQVQsQUFBaUIsQUFDakI7ZUFBVyxTQUFYLEFBQVcsQUFBUyxBQUVwQjs7UUFBRyxhQUFILEFBQWdCLEdBQUcsQUFDZjtZQUFHLGFBQUgsQUFBZ0IsR0FBRyxvQkFBb0IsVUFBQSxBQUFVLFlBQWpELEFBQW1CLEFBQTBDLE9BQ3hELG9CQUFvQixVQUFBLEFBQVUsYUFBYSxXQUEzQyxBQUFvQixBQUFrQyxBQUM5RDtBQUVEOztRQUFBLEFBQUcsbUJBQWtCLEFBQ2pCO2VBQU0scUJBQU4sQUFBMkIsaUJBQWdCLEFBQ3ZDO21CQUFBLEFBQU87d0JBQUssQUFDQSxBQUNwQjsrQkFGb0IsQUFFTCxBQUNmO3NCQUFNLElBQUEsQUFBSSxLQUFLLFVBQVQsQUFBUyxBQUFVLGVBQWUsVUFBbEMsQUFBa0MsQUFBVSxZQUgxQyxBQUFZLEFBR2QsQUFBd0QsQUFFdEQ7QUFMWSxBQUNSO0FBS1A7QUFDSjtBQUNEO1NBQUksSUFBSSxJQUFSLEFBQVksR0FBRyxLQUFmLEFBQW9CLFdBQXBCLEFBQStCLEtBQUs7ZUFBQSxBQUFPLEtBQUssRUFBRSxRQUFGLEFBQVUsR0FBRyxNQUFNLElBQUEsQUFBSSxLQUFKLEFBQVMsTUFBVCxBQUFlLE9BQWxGLEFBQW9DLEFBQVksQUFBbUIsQUFBc0I7QUFFekYsU0FBRyxXQUFILEFBQWMsR0FBRyxLQUFJLElBQUksS0FBUixBQUFZLEdBQUcsTUFBTSxJQUFyQixBQUF5QixRQUF6QixBQUFrQyxNQUFLO2VBQUEsQUFBTyxLQUFLLEVBQUUsUUFBRixBQUFVLElBQUcsV0FBYixBQUF3QixNQUFNLE1BQU0sSUFBQSxBQUFJLEtBQUosQUFBUyxNQUFNLFFBQWYsQUFBdUIsR0FBOUcsQUFBdUMsQUFBWSxBQUFvQyxBQUEwQjtBQUVsSSxZQUFBLEFBQU8sQUFDVjtBQWpDRDs7QUFtQ08sSUFBTSw4Q0FBbUIsU0FBbkIsQUFBbUIsc0JBQUE7O2VBQ3hCLFdBQVcsSUFBWCxBQUFXLEFBQUksZUFBZSxJQURFLEFBQ2hDLEFBQThCLEFBQUksQUFDekM7b0JBQVksV0FBVyxJQUZnQixBQUUzQixBQUFXLEFBQUksQUFDM0I7bUJBQVcsSUFIb0IsQUFBUSxBQUc1QixBQUFJO0FBSHdCLEFBQ3ZDO0FBRE07O0FBTUEsSUFBTSw0Q0FBa0IsU0FBbEIsQUFBa0IscUJBQUE7V0FBTyxVQUFBLEFBQUMsS0FBRCxBQUFNLFdBQU4sQUFBaUIsR0FBTSxBQUM1RDtZQUFHLFVBQUEsQUFBVSxlQUFlLFdBQVcsSUFBcEMsQUFBeUIsQUFBVyxBQUFJLGVBQWUsVUFBQSxBQUFVLGNBQWMsSUFBbEYsQUFBa0YsQUFBSSxlQUFlLE1BQUEsQUFBTSxBQUMzRztlQUFBLEFBQU8sQUFDUDtBQUg4QjtBQUF4Qjs7QUFNQSxJQUFNLHdDQUFnQixTQUFoQixBQUFnQixvQkFBQTtnQkFBUSxBQUFLLFdBQUwsQUFBZ0IsSUFBSSxxQkFBQTtzQkFBYSxBQUFPLE9BQVAsQUFBYyxJQUFkLEFBQWtCOzZCQUNoRixBQUFVLE1BQVYsQUFBZ0IsSUFBSSxvQkFBQTs4QkFBWSxBQUFPLE9BQVAsQUFBYyxJQUFkLEFBQWtCOzRCQUMvQyxLQUFBLEFBQUssWUFBWSxTQUFBLEFBQVMsS0FBMUIsQUFBaUIsQUFBYyxrQkFBa0IsS0FBQSxBQUFLLFlBQVksU0FBQSxBQUFTLEtBQTFCLEFBQWlCLEFBQWMsZUFBZSxXQUFXLFNBQUEsQUFBUyxLQUFuSCxBQUFpRCxBQUE4QyxBQUFXLEFBQWMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUEsQUFBSyxZQUFZLFNBQUEsQUFBUyxLQUExQixBQUFpQixBQUFjLGVBQWUsV0FBVyxTQUFBLEFBQVMsS0FBbEUsQUFBOEMsQUFBVyxBQUFjLGFBQXZFLEFBQW9GLFFBQVEsU0FEdE4sQUFBWSxBQUE0QixBQUNrRixBQUFxRztBQUR2TCxBQUNqRSxpQkFEcUM7QUFEaUIsQUFBYSxBQUE2QixBQUMzRixhQUFBO0FBRDJGLEFBQ2xHLFNBRHFFO0FBQXpDLEFBQVEsS0FBQTtBQUE5QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgQ2FsZW5kYXIgZnJvbSAnLi9saWJzL2NvbXBvbmVudCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcbiAgICBDYWxlbmRhci5pbml0KCcuanMtY2FsZW5kYXInKTtcbn1dO1xuICAgIFxuaWYoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdykgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSk7IiwiaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vbGliL2RlZmF1bHRzJztcbmltcG9ydCBjb21wb25lbnRQcm90b3R5cGUgZnJvbSAnLi9saWIvY29tcG9uZW50LXByb3RvdHlwZSc7XG5cbmNvbnN0IGluaXQgPSAoc2VsLCBvcHRzKSA9PiB7XG5cdGxldCBlbHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSk7XG4gICAgLy9sZXQgZWxzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXG5cdGlmKCFlbHMubGVuZ3RoKSByZXR1cm4gY29uc29sZS53YXJuKCdDYWxlbmRhciBub3QgaW5pdGlhbGlzZWQsIG5vIGF1Z21lbnRhYmxlIGVsZW1lbnRzIGZvdW5kJyk7XG4gICAgXG5cdHJldHVybiBlbHMubWFwKChlbCkgPT4ge1xuXHRcdHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoY29tcG9uZW50UHJvdG90eXBlKSwge1xuXHRcdFx0bm9kZTogZWwsXG5cdFx0XHRzdGFydERhdGU6IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1zdGFydC1kYXRlJykgPyBuZXcgRGF0ZShlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhcnQtZGF0ZScpKSA6IGZhbHNlLFxuXHRcdFx0ZW5kRGF0ZTogZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWVuZC1kYXRlJykgPyBuZXcgRGF0ZShlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZW5kLWRhdGUnKSkgOiBmYWxzZSxcblx0XHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cylcblx0XHR9KS5pbml0KCk7XG5cdH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiaW1wb3J0IHsgZGlmZkRheXMsIGFkZERheXMsIG1vbnRoTmFtZXMsIG1vbnRoVmlld0ZhY3RvcnksIG1vbnRoVmlld0V4aXN0cywgYWN0aXZhdGVEYXRlcyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgY2FsZW5kYXIgfSBmcm9tICcuL3RlbXBsYXRlcyc7XG5cbmNvbnN0IFRSSUdHRVJfRVZFTlRTID0gWydjbGljaycsICdrZXlkb3duJ10sXG5cdCAgVFJJR0dFUl9LRVlDT0RFUyA9IFsxMywgMzJdO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGluaXQoKSB7XG5cdFx0bGV0IHRvdGFsRGF5cyA9IGRpZmZEYXlzKHRoaXMuc3RhcnREYXRlLCB0aGlzLmVuZERhdGUpLFxuXHRcdFx0ZXZlbnREYXRlT2JqZWN0cyA9IFtdO1xuXHRcdFxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDw9IHRvdGFsRGF5czsgaSsrKSBldmVudERhdGVPYmplY3RzLnB1c2goYWRkRGF5cyh0aGlzLnN0YXJ0RGF0ZSwgaSkpO1xuXHRcdHRoaXMuZGF0YSA9IGV2ZW50RGF0ZU9iamVjdHMucmVkdWNlKChhY2MsIGN1cnIpID0+IHtcblx0XHRcdFx0bGV0IGV4aXN0aW5nTW9udGhJbmRleCA9IGFjYy5tb250aFZpZXdzLmxlbmd0aCA/IGFjYy5tb250aFZpZXdzLnJlZHVjZShtb250aFZpZXdFeGlzdHMoY3VyciksIC0xKSA6IGZhbHNlO1xuXHRcdFx0XHRpZighYWNjLm1vbnRoVmlld3MubGVuZ3RoIHx8IGV4aXN0aW5nTW9udGhJbmRleCA9PT0gLTEpIGFjYy5tb250aFZpZXdzLnB1c2gobW9udGhWaWV3RmFjdG9yeShjdXJyKSk7XG5cdFx0XHRcdFxuXHRcdFx0XHRhY2MuYWN0aXZlRGF0ZXNbY3Vyci5nZXRGdWxsWWVhcigpXSA9IGFjYy5hY3RpdmVEYXRlc1tjdXJyLmdldEZ1bGxZZWFyKCldIHx8IHt9O1xuXHRcdFx0XHRpZihhY2MuYWN0aXZlRGF0ZXNbY3Vyci5nZXRGdWxsWWVhcigpXSAmJiBhY2MuYWN0aXZlRGF0ZXNbY3Vyci5nZXRGdWxsWWVhcigpXVttb250aE5hbWVzW2N1cnIuZ2V0TW9udGgoKV1dKSBcblx0XHRcdFx0XHRhY2MuYWN0aXZlRGF0ZXNbY3Vyci5nZXRGdWxsWWVhcigpXVttb250aE5hbWVzW2N1cnIuZ2V0TW9udGgoKV1dLnB1c2goY3Vyci5nZXREYXRlKCkpO1xuXHRcdFx0XHRpZighYWNjLmFjdGl2ZURhdGVzW2N1cnIuZ2V0RnVsbFllYXIoKV1bbW9udGhOYW1lc1tjdXJyLmdldE1vbnRoKCldXSlcblx0XHRcdFx0XHRhY2MuYWN0aXZlRGF0ZXNbY3Vyci5nZXRGdWxsWWVhcigpXVttb250aE5hbWVzW2N1cnIuZ2V0TW9udGgoKV1dID0gW2N1cnIuZ2V0RGF0ZSgpXTtcblxuXHRcdFx0XHRyZXR1cm4gYWNjO1xuXHRcdFx0fSwgeyBtb250aFZpZXdzOiBbXSwgYWN0aXZlRGF0ZXM6IHt9IH0pO1xuXHRcdFx0XG5cdFx0ZXZlbnREYXRlT2JqZWN0cyA9IFtdO1xuXHRcdFxuXHRcdHRoaXMuZGF0YS5tb250aFZpZXdzID0gYWN0aXZhdGVEYXRlcyh0aGlzLmRhdGEpO1xuXHRcdHRoaXMucmVuZGVyVmlldygwKTtcblx0XHRcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0cmVuZGVyVmlldyhpKXtcblx0XHR0aGlzLm5vZGUuaW5uZXJIVE1MID0gY2FsZW5kYXIodGhpcy5kYXRhLm1vbnRoVmlld3NbaV0pO1xuXHRcdHRoaXMubWFuYWdlQnV0dG9ucyhpKTtcblx0fSxcblx0ZW5hYmxlQnV0dG9uKGJ0biwgdmFsdWUpe1xuXHRcdFRSSUdHRVJfRVZFTlRTLmZvckVhY2goZXYgPT4ge1xuXHRcdFx0YnRuLmFkZEV2ZW50TGlzdGVuZXIoZXYsIGUgPT4ge1xuXHRcdFx0XHRpZighIWUua2V5Q29kZSAmJiAhflRSSUdHRVJfS0VZQ09ERVMuaW5kZXhPZihlLmtleUNvZGUpKSByZXR1cm47XG5cdFx0XHRcdHRoaXMucmVuZGVyVmlldy5jYWxsKHRoaXMsIHZhbHVlKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRtYW5hZ2VCdXR0b25zKGkpIHtcblx0XHRsZXQgYmFja0J1dHRvbiA9IHRoaXMubm9kZS5xdWVyeVNlbGVjdG9yKCcuanMtY2FsZW5kYXJfX2JhY2snKSxcblx0XHRcdG5leHRCdXR0b24gPSB0aGlzLm5vZGUucXVlcnlTZWxlY3RvcignLmpzLWNhbGVuZGFyX19uZXh0Jyk7XG5cblx0XHQvL3VyZ2guLi5cblx0XHRpZihpID09PSAwKSB7XG5cdFx0XHRiYWNrQnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcblx0XHRcdHRoaXMuZW5hYmxlQnV0dG9uKG5leHRCdXR0b24sIGkgKyAxKTtcblx0XHR9XG5cdFx0aWYoaSA9PT0gdGhpcy5kYXRhLm1vbnRoVmlld3MubGVuZ3RoIC0gMSkge1xuXHRcdFx0bmV4dEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG5cdFx0XHR0aGlzLmVuYWJsZUJ1dHRvbihiYWNrQnV0dG9uLCBpIC0gMSk7XG5cdFx0fVxuXHRcdGlmKGkgIT09IDAgJiYgaSAhPT0gdGhpcy5kYXRhLm1vbnRoVmlld3MubGVuZ3RoIC0gMSkge1xuXHRcdFx0dGhpcy5lbmFibGVCdXR0b24obmV4dEJ1dHRvbiwgaSArIDEpO1xuXHRcdFx0dGhpcy5lbmFibGVCdXR0b24oYmFja0J1dHRvbiwgaSAtIDEpO1xuXHRcdH1cblx0fVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG5cdGNhbGxiYWNrOiBudWxsXG59OyIsImV4cG9ydCBjb25zdCBjYWxlbmRhciA9IHByb3BzID0+IGA8ZGl2IGNsYXNzPVwicmQtY29udGFpbmVyXCIgc3R5bGU9XCJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmQtZGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyZC1tb250aFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicmQtYmFjayBqcy1jYWxlbmRhcl9fYmFja1wiIHR5cGU9XCJidXR0b25cIj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInJkLW5leHQganMtY2FsZW5kYXJfX25leHRcIiB0eXBlPVwiYnV0dG9uXCI+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyZC1tb250aC1sYWJlbFwiPiR7cHJvcHMubW9udGhUaXRsZX0gJHtwcm9wcy55ZWFyVGl0bGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInJkLWRheXNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aGVhZCBjbGFzcz1cInJkLWRheXMtaGVhZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBjbGFzcz1cInJkLWRheXMtcm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cInJkLWRheS1oZWFkXCI+TW88L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJyZC1kYXktaGVhZFwiPlR1PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzPVwicmQtZGF5LWhlYWRcIj5XZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cInJkLWRheS1oZWFkXCI+VGg8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJyZC1kYXktaGVhZFwiPkZyPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzPVwicmQtZGF5LWhlYWRcIj5TYTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cInJkLWRheS1oZWFkXCI+U3U8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5IGNsYXNzPVwicmQtZGF5cy1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLTx0ciBjbGFzcz1cInJkLWRheXMtcm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInJkLWRheS1ib2R5IHJkLWRheS1wcmV2LW1vbnRoIHJkLWRheS1kaXNhYmxlZFwiPjMwPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwicmQtZGF5LWJvZHkgcmQtZGF5LXByZXYtbW9udGggcmQtZGF5LWRpc2FibGVkXCI+MzE8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJyZC1kYXktYm9keSByZC1kYXktZGlzYWJsZWRcIj4wMTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInJkLWRheS1ib2R5IHJkLWRheS1kaXNhYmxlZFwiPjAyPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwicmQtZGF5LWJvZHkgcmQtZGF5LWRpc2FibGVkXCI+MDM8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJyZC1kYXktYm9keSByZC1kYXktZGlzYWJsZWRcIj4wNDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInJkLWRheS1ib2R5IHJkLWRheS1kaXNhYmxlZFwiPjA1PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPi0tPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7cHJvcHMubW9kZWwubWFwKHdlZWtzKHByb3BzLmFjdGl2ZSkpLmpvaW4oJycpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xuXG5jb25zdCBkYXkgPSAoYWN0aXZlRGF5cywgcHJvcHMpID0+IGA8dGQgY2xhc3M9XCJyZC1kYXktYm9keSAke3Byb3BzLm5leHRNb250aCA/ICcgcmQtZGF5LW5leHQtbW9udGgnIDogJyd9JHtwcm9wcy5wcmV2aW91c01vbnRoID8gJyByZC1kYXktcHJldi1tb250aCcgOiAnJ30ke3Byb3BzLmFjdGl2ZSA/ICcgcmQtZGF5LXNlbGVjdGVkJyA6ICcgcmQtZGF5LWRpc2FibGVkJ31cIj4ke3Byb3BzLm51bWJlcn08L3RkPmA7XG5cbmNvbnN0IHdlZWtzID0gYWN0aXZlRGF5cyA9PiAocHJvcHMsIGksIGFycikgPT4ge1xuICAgIGlmKGkgPT09IDApIHJldHVybiBgPHRyIGNsYXNzPVwicmQtZGF5cy1yb3dcIj4ke2RheShhY3RpdmVEYXlzLCBwcm9wcyl9YDtcbiAgICBlbHNlIGlmIChpID09PSBhcnIubGVuZ3RoIC0gMSkgcmV0dXJuIGAke2RheShhY3RpdmVEYXlzLCBwcm9wcyl9PC90cj5gO1xuICAgIGVsc2UgaWYoKGkrMSkgJSA3ID09PSAwKSByZXR1cm4gYCR7ZGF5KGFjdGl2ZURheXMsIHByb3BzKX08L3RyPjx0ciBjbGFzcz1cInJkLWRheXMtcm93XCI+YDtcbiAgICBlbHNlIHJldHVybiBkYXkoYWN0aXZlRGF5cywgcHJvcHMpO1xufTsiLCJleHBvcnQgY29uc3QgZGlmZkRheXMgPSAoYSwgYikgPT4ge1xuXHRjb25zdCBNU19QRVJfREFZID0gMTAwMCAqIDYwICogNjAgKiAyNDtcblx0Ly8gRGlzY2FyZCB0aGUgdGltZSBhbmQgdGltZS16b25lIGluZm9ybWF0aW9uLlxuXHRsZXQgdXRjMSA9IERhdGUuVVRDKGEuZ2V0RnVsbFllYXIoKSwgYS5nZXRNb250aCgpLCBhLmdldERhdGUoKSksXG5cdFx0dXRjMiA9IERhdGUuVVRDKGIuZ2V0RnVsbFllYXIoKSwgYi5nZXRNb250aCgpLCBiLmdldERhdGUoKSk7XG5cbiAgXHRyZXR1cm4gTWF0aC5mbG9vcigodXRjMiAtIHV0YzEpIC8gTVNfUEVSX0RBWSk7XG59O1xuLypcbm9yLi4uXG5NYXRoLnJvdW5kKE1hdGguYWJzKChhLmdldFRpbWUoKSAtIGIuZ2V0VGltZSgpKS8oMjQqNjAqNjAqMTAwMCkpKTtcbiovXG5cbmV4cG9ydCBjb25zdCBhZGREYXlzID0gKGRhdGUsIGRheXMpID0+IHtcblx0bGV0IHJlc3VsdCA9IG5ldyBEYXRlKGRhdGUpO1xuXHRyZXN1bHQuc2V0RGF0ZShyZXN1bHQuZ2V0RGF0ZSgpICsgZGF5cyk7XG5cdHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgY29uc3QgbW9udGhOYW1lcyA9IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlciddO1xuXG5jb25zdCBtb250aE1vZGVsID0gKHllYXIsIG1vbnRoKSA9PiB7XG4gICAgbGV0IHRoZU1vbnRoID0gbmV3IERhdGUoeWVhciwgbW9udGggKyAxLCAwKSxcbiAgICAgICAgdG90YWxEYXlzID0gdGhlTW9udGguZ2V0RGF0ZSgpLFxuICAgICAgICBlbmREYXkgPSB0aGVNb250aC5nZXREYXkoKSxcbiAgICAgICAgc3RhcnREYXksXG4gICAgICAgIHByZXZNb250aFN0YXJ0RGF5ID0gZmFsc2UsXG4gICAgICAgIHByZXZNb250aCA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAwKSxcbiAgICAgICAgcHJldk1vbnRoRW5kRGF5ID0gcHJldk1vbnRoLmdldERhdGUoKSxcbiAgICAgICAgb3V0cHV0ID0gW107XG5cbiAgICB0aGVNb250aC5zZXREYXRlKDEpO1xuICAgIHN0YXJ0RGF5ID0gdGhlTW9udGguZ2V0RGF5KCk7XG4gICAgXG4gICAgaWYoc3RhcnREYXkgIT09IDEpIHtcbiAgICAgICAgaWYoc3RhcnREYXkgPT09IDApIHByZXZNb250aFN0YXJ0RGF5ID0gcHJldk1vbnRoLmdldERhdGUoKSAtIDU7XG4gICAgICAgIGVsc2UgcHJldk1vbnRoU3RhcnREYXkgPSBwcmV2TW9udGguZ2V0RGF0ZSgpIC0gKHN0YXJ0RGF5IC0gMik7XG4gICAgfVxuXG4gICAgaWYocHJldk1vbnRoU3RhcnREYXkpe1xuICAgICAgICB3aGlsZShwcmV2TW9udGhTdGFydERheSA8PSBwcmV2TW9udGhFbmREYXkpe1xuICAgICAgICAgICAgb3V0cHV0LnB1c2goe1xuICAgICAgICAgICAgICAgIG51bWJlcjogcHJldk1vbnRoU3RhcnREYXksXG5cdFx0XHRcdHByZXZpb3VzTW9udGg6IHRydWUsXG5cdFx0XHRcdGRhdGU6IG5ldyBEYXRlKHByZXZNb250aC5nZXRGdWxsWWVhcigpLCBwcmV2TW9udGguZ2V0TW9udGgoKSwgcHJldk1vbnRoU3RhcnREYXkpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByZXZNb250aFN0YXJ0RGF5Kys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yKGxldCBpID0gMTsgaSA8PSB0b3RhbERheXM7IGkrKykgb3V0cHV0LnB1c2goeyBudW1iZXI6IGksIGRhdGU6IG5ldyBEYXRlKHllYXIsIG1vbnRoLCBpKX0pO1xuXG4gICAgaWYoZW5kRGF5ICE9PSAwKSBmb3IobGV0IGkgPSAxOyBpIDw9ICg3IC0gZW5kRGF5KTsgaSsrKSBvdXRwdXQucHVzaCh7IG51bWJlcjogaSwgbmV4dE1vbnRoOiB0cnVlLCBkYXRlOiBuZXcgRGF0ZSh5ZWFyLCBtb250aCArIDEsIGkpfSk7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuZXhwb3J0IGNvbnN0IG1vbnRoVmlld0ZhY3RvcnkgPSBkYXkgPT4gKHtcblx0bW9kZWw6IG1vbnRoTW9kZWwoZGF5LmdldEZ1bGxZZWFyKCksIGRheS5nZXRNb250aCgpKSxcblx0bW9udGhUaXRsZTogbW9udGhOYW1lc1tkYXkuZ2V0TW9udGgoKV0sXG5cdHllYXJUaXRsZTogZGF5LmdldEZ1bGxZZWFyKClcbn0pO1xuXG5leHBvcnQgY29uc3QgbW9udGhWaWV3RXhpc3RzID0gZGF5ID0+IChpZHgsIG1vbnRoVmlldywgaSkgPT4ge1xuXHRpZihtb250aFZpZXcubW9udGhUaXRsZSA9PT0gbW9udGhOYW1lc1tkYXkuZ2V0TW9udGgoKV0gJiYgbW9udGhWaWV3LnllYXJUaXRsZSA9PT0gZGF5LmdldEZ1bGxZZWFyKCkpIGlkeCA9IGk7XG5cdHJldHVybiBpZHg7XG59XG5cblxuZXhwb3J0IGNvbnN0IGFjdGl2YXRlRGF0ZXMgPSBkYXRhID0+IGRhdGEubW9udGhWaWV3cy5tYXAobW9udGhWaWV3ID0+IE9iamVjdC5hc3NpZ24oe30sIG1vbnRoVmlldywgeyBcblx0bW9kZWw6IG1vbnRoVmlldy5tb2RlbC5tYXAoZGF5TW9kZWwgPT4gT2JqZWN0LmFzc2lnbih7fSwgZGF5TW9kZWwsIHsgXG5cdFx0XHRhY3RpdmU6IGRhdGEuYWN0aXZlRGF0ZXNbZGF5TW9kZWwuZGF0ZS5nZXRGdWxsWWVhcigpXSAmJiBkYXRhLmFjdGl2ZURhdGVzW2RheU1vZGVsLmRhdGUuZ2V0RnVsbFllYXIoKV1bbW9udGhOYW1lc1tkYXlNb2RlbC5kYXRlLmdldE1vbnRoKCldXSAmJiAhIX5kYXRhLmFjdGl2ZURhdGVzW2RheU1vZGVsLmRhdGUuZ2V0RnVsbFllYXIoKV1bbW9udGhOYW1lc1tkYXlNb2RlbC5kYXRlLmdldE1vbnRoKCldXS5pbmRleE9mKGRheU1vZGVsLm51bWJlcilcblx0XHR9KSlcbn0pKTsiXX0=
