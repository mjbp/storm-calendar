export const calendar = props => `<div class="rd-container" style="display: inline-block;">
                                    <div class="rd-date">
                                        <div class="rd-month">
                                            <button class="rd-back js-calendar__back" type="button"></button>
                                            <button class="rd-next js-calendar__next" type="button"></button>
                                            <div class="rd-month-label">${props.monthTitle} ${props.yearTitle}</div>
                                            <table class="rd-days">
                                                <thead class="rd-days-head">
                                                    <tr class="rd-days-row">
                                                        <th class="rd-day-head">Mo</th>
                                                        <th class="rd-day-head">Tu</th>
                                                        <th class="rd-day-head">We</th>
                                                        <th class="rd-day-head">Th</th>
                                                        <th class="rd-day-head">Fr</th>
                                                        <th class="rd-day-head">Sa</th>
                                                        <th class="rd-day-head">Su</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="rd-days-body">
                                                    <!--<tr class="rd-days-row">
                                                        <td class="rd-day-body rd-day-prev-month rd-day-disabled">30</td>
                                                        <td class="rd-day-body rd-day-prev-month rd-day-disabled">31</td>
                                                        <td class="rd-day-body rd-day-disabled">01</td>
                                                        <td class="rd-day-body rd-day-disabled">02</td>
                                                        <td class="rd-day-body rd-day-disabled">03</td>
                                                        <td class="rd-day-body rd-day-disabled">04</td>
                                                        <td class="rd-day-body rd-day-disabled">05</td>
                                                    </tr>-->
                                                    ${props.model.map(weeks(props.active)).join('')}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>`;

const day = (activeDays, props) => `<td class="rd-day-body ${props.nextMonth ? ' rd-day-next-month' : ''}${props.previousMonth ? ' rd-day-prev-month' : ''}${props.active ? ' rd-day-selected' : ' rd-day-disabled'}">${props.number}</td>`;

const weeks = activeDays => (props, i, arr) => {
    if(i === 0) return `<tr class="rd-days-row">${day(activeDays, props)}`;
    else if (i === arr.length - 1) return `${day(activeDays, props)}</tr>`;
    else if((i+1) % 7 === 0) return `${day(activeDays, props)}</tr><tr class="rd-days-row">`;
    else return day(activeDays, props);
};