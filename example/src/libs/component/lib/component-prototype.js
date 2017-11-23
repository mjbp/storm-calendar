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
		
		for (let i = 1; i <= totalDays; )


		console.log(monthModel(this.startDate.getFullYear(), this.startDate.getMonth()));

		return this;
	}
};