import { diffDays, addDays, monthNames, monthViewFactory, monthViewExists, activateDates } from './utils';
import { calendar } from './templates';

const TRIGGER_EVENTS = ['click', 'keydown'],
	  TRIGGER_KEYCODES = [13, 32];

export default {
	init() {
		let totalDays = diffDays(this.startDate, this.endDate),
			eventDateObjects = [];
		
		for (let i = 0; i <= totalDays; i++) eventDateObjects.push(addDays(this.startDate, i));
		//Array.apply(null, new Array(totalDays + 1)).map((item, i) => addDays(this.startDate, i));s

		this.data = eventDateObjects.reduce((acc, curr) => {
				let existingMonthIndex = acc.monthViews.length ? acc.monthViews.reduce(monthViewExists(curr), -1) : false;
				if(!acc.monthViews.length || existingMonthIndex === -1) acc.monthViews.push(monthViewFactory(curr, {min: this.startDate.getTime(), max: this.endDate.getTime()}));
				return acc;
			}, { monthViews: []});
			
		eventDateObjects = [];
		this.renderView(0);
		
		return this;
	},
	renderView(i){
		this.node.innerHTML = calendar(this.data.monthViews[i]);
		this.manageButtons(i);
	},
	manageButtons(i) {
		let backButton = this.node.querySelector('.js-calendar__back'),
			nextButton = this.node.querySelector('.js-calendar__next'),
			enableButton = (btn, value) => {
				TRIGGER_EVENTS.forEach(ev => {
					btn.addEventListener(ev, e => {
						if(!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode)) return;
						this.renderView.call(this, value);
					});
				});
			};

		//urgh...
		if(i === 0) {
			backButton.setAttribute('disabled', 'disabled');
			enableButton(nextButton, i + 1);
		}
		if(i === this.data.monthViews.length - 1) {
			nextButton.setAttribute('disabled', 'disabled');
			enableButton(backButton, i - 1);
		}
		if(i !== 0 && i !== this.data.monthViews.length - 1) {
			enableButton(nextButton, i + 1);
			enableButton(backButton, i - 1);
		}
	}
};