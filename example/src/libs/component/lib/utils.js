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

export const stripZeroPad = n => +n[0] === 0 ? n[1] : n;

export const addDays = (date, days) => {
	let result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
};

export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const monthModel = (year, month, { min, max }) => {
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
            });
            prevMonthStartDay++;
        }
    }
    for(let i = 1; i <= totalDays; i++) {
        let tmpTimestamp = new Date(year, month, i).getTime();
        output.push({ number: zeropad(i), active: tmpTimestamp >= min && tmpTimestamp <= max});
    }

    if(endDay !== 0) for(let i = 1; i <= (7 - endDay); i++) output.push({ number: zeropad(i), nextMonth: true});

    return output;
};

export const monthViewFactory = (day, limits) => ({
	model: monthModel(day.getFullYear(), day.getMonth(), limits),
	monthTitle: monthNames[day.getMonth()],
	yearTitle: day.getFullYear()
});

export const monthViewExists = day => (idx, monthView, i) => {
	if(monthView.monthTitle === monthNames[day.getMonth()] && monthView.yearTitle === day.getFullYear()) idx = i;
	return idx;
};