export const diffDays = (a, b) => {
	const MS_PER_DAY = 1000 * 60 * 60 * 24;
	// Discard the time and time-zone information.
	let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()),
		utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  	return Math.floor((utc2 - utc1) / MS_PER_DAY);
};
/*
or...
Math.round(Math.abs((a.getTime() - b.getTime())/(24*60*60*1000)));
*/

export const zeropad = n => `0${n}`.slice(-2);

export const addDays = (date, days) => {
	let result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
};

export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const monthModel = (year, month) => {
    let theMonth = new Date(year, month + 1, 0),
        totalDays = theMonth.getDate(),
        endDay = theMonth.getDay(),
        startDay,
        prevMonthStartDay = false,
        prevMonth = new Date(year, month, 0),
        prevMonthEndDay = prevMonth.getDate(),
        output = [];

    theMonth.setDate(1);
    startDay = theMonth.getDay();
    
    if(startDay !== 1) {
        if(startDay === 0) prevMonthStartDay = prevMonth.getDate() - 5;
        else prevMonthStartDay = prevMonth.getDate() - (startDay - 2);
    }

    if(prevMonthStartDay){
        while(prevMonthStartDay <= prevMonthEndDay){
            output.push({
                number: zeropad(prevMonthStartDay),
				previousMonth: true,
				date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonthStartDay)
            });
            prevMonthStartDay++;
        }
    }
    for(let i = 1; i <= totalDays; i++) output.push({ number: zeropad(i), date: new Date(year, month, i)});

    if(endDay !== 0) for(let i = 1; i <= (7 - endDay); i++) output.push({ number: zeropad(i), nextMonth: true, date: new Date(year, month + 1, i)});

    return output;
};

export const monthViewFactory = day => ({
	model: monthModel(day.getFullYear(), day.getMonth()),
	monthTitle: monthNames[day.getMonth()],
	yearTitle: day.getFullYear()
});

export const monthViewExists = day => (idx, monthView, i) => {
	if(monthView.monthTitle === monthNames[day.getMonth()] && monthView.yearTitle === day.getFullYear()) idx = i;
	return idx;
}


export const activateDates = data => data.monthViews.map(monthView => Object.assign({}, monthView, { 
	model: monthView.model.map(dayModel => Object.assign({}, dayModel, { 
			active: data.activeDates[dayModel.date.getFullYear()] && data.activeDates[dayModel.date.getFullYear()][monthNames[dayModel.date.getMonth()]] && !!~data.activeDates[dayModel.date.getFullYear()][monthNames[dayModel.date.getMonth()]].indexOf(dayModel.number)
		}))
}));