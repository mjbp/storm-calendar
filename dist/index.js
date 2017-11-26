/**
 * @name storm-calendar: 
 * @version 0.1.0: Sun, 26 Nov 2017 20:20:21 GMT
 * @author stormid
 * @license MIT
 */
import defaults from './lib/defaults';
import componentPrototype from './lib/component-prototype';

const init = (sel, opts) => {
	let els = [].slice.call(document.querySelectorAll(sel));
    //let els = Array.from(document.querySelectorAll(sel));

	if(!els.length) return console.warn('Calendar not initialised, no augmentable elements found');
    
	return els.map((el) => {
		return Object.assign(Object.create(componentPrototype), {
			node: el,
			startDate: el.getAttribute('data-start-date') ? new Date(el.getAttribute('data-start-date')) : false,
			endDate: el.getAttribute('data-end-date') ? new Date(el.getAttribute('data-end-date')) : new Date(el.getAttribute('data-start-date')),
			settings: Object.assign({}, defaults, opts)
		}).init();
	});
};

export default { init };