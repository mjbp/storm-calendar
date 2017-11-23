export default (year, month) => {
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
            output.push(prevMonthStartDay);
            prevMonthStartDay++;
        }
    }
    for(let i = 1; i <= totalDays; i++) output.push(i);

    if(endDay !== 0) for(let i = 1; i <= (7 - endDay); i++) output.push(i);

    return output;
};