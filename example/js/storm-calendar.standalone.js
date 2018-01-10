/**
 * @name storm-calendar: 
 * @version 0.2.0: Wed, 10 Jan 2018 08:41:56 GMT
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
	zeropad: true //to do - pass through to monthModel
};

var diffDays = function diffDays(a, b) {
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

var zeropad = function zeropad(n) {
	return ('0' + n).slice(-2);
};

var addDays = function addDays(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
};

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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

var monthViewFactory = function monthViewFactory(day, limits) {
	return {
		model: monthModel(day.getFullYear(), day.getMonth(), limits),
		monthTitle: monthNames[day.getMonth()],
		yearTitle: day.getFullYear()
	};
};

var monthViewExists = function monthViewExists(day) {
	return function (idx, monthView, i) {
		if (monthView.monthTitle === monthNames[day.getMonth()] && monthView.yearTitle === day.getFullYear()) idx = i;
		return idx;
	};
};

var calendar = function calendar(props) {
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

var TRIGGER_EVENTS = ['click', 'keydown'];
var TRIGGER_KEYCODES = [13, 32];

var componentPrototype = {
	init: function init() {
		var _this = this;

		var totalDays = diffDays(this.startDate, this.endDate),
		    eventDateObjects = [];

		//normalise hour for timestamp comparison
		this.startDate.setHours(0, 0, 0, 0);
		this.endDate.setHours(0, 0, 0, 0);

		for (var i = 0; i <= totalDays; i++) {
			eventDateObjects.push(addDays(this.startDate, i));
		} //Array.apply(null, new Array(totalDays + 1)).map((item, i) => addDays(this.startDate, i));s

		this.data = eventDateObjects.reduce(function (acc, curr) {
			var existingMonthIndex = acc.monthViews.length ? acc.monthViews.reduce(monthViewExists(curr), -1) : false;
			if (!acc.monthViews.length || existingMonthIndex === -1) acc.monthViews.push(monthViewFactory(curr, { min: _this.startDate.getTime(), max: _this.endDate.getTime() }));
			return acc;
		}, { monthViews: [] });

		console.log(this.data);
		eventDateObjects = [];
		this.renderView(0);

		return this;
	},
	renderView: function renderView(i) {
		this.node.innerHTML = calendar(this.data.monthViews[i]);
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

var init = function init(sel, opts) {
	var els = [].slice.call(document.querySelectorAll(sel));
	//let els = Array.from(document.querySelectorAll(sel));

	if (!els.length) return console.warn('Calendar not initialised, no augmentable elements found');

	return els.map(function (el) {
		return Object.assign(Object.create(componentPrototype), {
			node: el,
			startDate: el.getAttribute('data-start-date') ? new Date(el.getAttribute('data-start-date')) : false,
			endDate: el.getAttribute('data-end-date') ? new Date(el.getAttribute('data-end-date')) : new Date(el.getAttribute('data-start-date')),
			settings: Object.assign({}, defaults, opts)
		}).init();
	});
};

var index = { init: init };

exports.default = index;;
}));
