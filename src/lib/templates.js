export const calendar = props => `<div class="calendar-container">
                                    <div class="calendar-date">
                                        <button class="calendar-back js-calendar__back" type="button"><svg class="sdp-btn__icon" width="19" height="19" viewBox="0 0 1000 1000"><path d="M336.2 274.5l-210.1 210h805.4c13 0 23 10 23 23s-10 23-23 23H126.1l210.1 210.1c11 11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7l-249.1-249c-11-11-11-21 0-32l249.1-249.1c21-21.1 53 10.9 32 32z"></path></svg></button>
                                        <button class="calendar-next js-calendar__next" type="button"><svg class="sdp-btn__icon" width="19" height="19" viewBox="0 0 1000 1000"><path d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z"></path></svg></button>
                                        <div class="calendar-month-label">${props.monthTitle} ${props.yearTitle}</div>
                                        <table class="calendar-days">
                                            <thead class="calendar-days-head">
                                                <tr class="calendar-days-row">
                                                    <th class="calendar-day-head">Mo</th>
                                                    <th class="calendar-day-head">Tu</th>
                                                    <th class="calendar-day-head">We</th>
                                                    <th class="calendar-day-head">Th</th>
                                                    <th class="calendar-day-head">Fr</th>
                                                    <th class="calendar-day-head">Sa</th>
                                                    <th class="calendar-day-head">Su</th>
                                                </tr>
                                            </thead>
                                            <tbody class="calendar-days-body">
                                                ${props.model.map(weeks(props.active)).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>`;

const day = (activeDays, props) => `<td class="calendar-day${props.nextMonth ? ' calendar-day-next-month' : ''}${props.previousMonth ? ' calendar-day-prev-month' : ''}${props.active && !props.previousMonth && !props.nextMonth ? ' calendar-day-selected' : ' calendar-day-disabled'}">${props.number}</td>`;

const weeks = activeDays => (props, i, arr) => {
    if(i === 0) return `<tr class="calendar-days-row">${day(activeDays, props)}`;
    else if (i === arr.length - 1) return `${day(activeDays, props)}</tr>`;
    else if((i+1) % 7 === 0) return `${day(activeDays, props)}</tr><tr class="calendar-days-row">`;
    else return day(activeDays, props);
};