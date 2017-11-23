import { diffDays } from './utils';
import monthModel from './month-model';

export default{
	init() {
		/*
			monthViews = [
				{
					model: monthModel(_DAY_.getFullYear(), _DAY_getMonth()),
					monthTitle: '',
					yearTitle: '',
					active: [x, x, x]
				}
			];


		*/

		console.log(diffDays(this.startDate, this.endDate));

		let totalDays = diffDays(this.startDate, this.endDate),
			utilityDate = new Date(this.startDate.getTime());
		
		//for (let i = 1; i <= totalDays; )
		//get date objects for each day between start and end
		
		
		
		
		
		//let numDays = Math.round(Math.abs((eventDates.startDate.getTime() - eventDates.endDate.getTime())/(24*60*60*1000)));
		// let count = 0;
		// let eventDateObjects = [];
	
		// let addDays = (date, days) => {
		// 	let result = new Date(date);
		// 	result.setDate(result.getDate() + days);
		// 	return result;
		// };
	
		// while(count <= numDays){
		// 	eventDateObjects.push(addDays(eventDates.startDate, count));
		// 	count++;
		// }
	
	
		console.log(eventDateObjects);


		console.log(monthModel(this.startDate.getFullYear(), this.startDate.getMonth()));

		return this;
	}
};