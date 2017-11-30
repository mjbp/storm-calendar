/**
 * @name storm-calendar: 
 * @version 0.1.0: Fri, 24 Nov 2017 16:50:24 GMT
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
/*
or...
Math.round(Math.abs((a.getTime() - b.getTime())/(24*60*60*1000)));
*/

var addDays = function addDays(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
};

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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

var monthViewFactory = function monthViewFactory(day) {
	return {
		model: monthModel(day.getFullYear(), day.getMonth()),
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

var activateDates = function activateDates(data) {
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

var calendar = function calendar(props) {
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

var TRIGGER_EVENTS = ['click', 'keydown'];
var TRIGGER_KEYCODES = [13, 32];

var componentPrototype = {
	init: function init() {
		var totalDays = diffDays(this.startDate, this.endDate),
		    eventDateObjects = [];

		for (var i = 0; i <= totalDays; i++) {
			eventDateObjects.push(addDays(this.startDate, i));
		}this.data = eventDateObjects.reduce(function (acc, curr) {
			var existingMonthIndex = acc.monthViews.length ? acc.monthViews.reduce(monthViewExists(curr), -1) : false;
			if (!acc.monthViews.length || existingMonthIndex === -1) acc.monthViews.push(monthViewFactory(curr));

			acc.activeDates[curr.getFullYear()] = acc.activeDates[curr.getFullYear()] || {};
			if (acc.activeDates[curr.getFullYear()] && acc.activeDates[curr.getFullYear()][monthNames[curr.getMonth()]]) acc.activeDates[curr.getFullYear()][monthNames[curr.getMonth()]].push(curr.getDate());
			if (!acc.activeDates[curr.getFullYear()][monthNames[curr.getMonth()]]) acc.activeDates[curr.getFullYear()][monthNames[curr.getMonth()]] = [curr.getDate()];

			return acc;
		}, { monthViews: [], activeDates: {} });

		eventDateObjects = [];

		this.data.monthViews = activateDates(this.data);
		this.renderView(0);

		return this;
	},
	renderView: function renderView(i) {
		this.node.innerHTML = calendar(this.data.monthViews[i]);
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
