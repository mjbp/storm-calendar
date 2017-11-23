import Calendar from './libs/component';

const onDOMContentLoadedTasks = [() => {
    Calendar.init('.js-calendar');
}];
    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach((fn) => fn()); });