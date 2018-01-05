import should from 'should';
import Calendar from '../dist/storm-calendar.standalone';
import 'jsdom-global/register';

const html = `<div class="js-calendar" data-start-date="2017-11-30" data-end-date="2018-01-01"></div>
<div class="js-calendar-two" data-start-date="2017-11-30" data-end-date="2018-01-01"></div>`;

document.body.innerHTML = html;
  
let components = Calendar.init('.js-calendar'),
    componentsTwo = Calendar.init.call(Calendar, '.js-calendar-two', {
      zeropad: false
    });


describe('Initialisation', () => {

  it('should return array of length 2', () => {

    should(components)
      .Array()
      .and.have.lengthOf(1);

  });

  it('each array item should be an object with a specific set of properties', () => {

    components[0].should.be.an.instanceOf(Object).and.not.empty();
    components[0].should.have.property('node');
    components[0].should.have.property('startDate');
    components[0].should.have.property('endDate');
    components[0].should.have.property('settings').Object();
    components[0].should.have.property('init').Function()
    components[0].should.have.property('renderView').Function()
    components[0].should.have.property('manageButtons').Function()

  });


  it('should gracefully display a warning in the console and not throw if no elements are found', () => {

    Calendar.init.bind(Calendar, '.js-err').should.not.throw();

  })
  
  it('should initialisation with different settings if different options are passed', () => {

    should(componentsTwo[0].settings.zeropad).not.equal(components[0].settings.zeropad);
  
  });

});


describe('Month navigation', () => {
  it('should render a different month when the navigation is clicked', () => {
    components[0].node.querySelector('.js-calendar__next').click();
    components[0].node.querySelector('.js-calendar__next').click();
    components[0].node.querySelector('.js-calendar__back').click();
    //no value to test here, have to interrogate the DOM...
    
    components[0].node.querySelector('.js-calendar__next').dispatchEvent(
      new window.KeyboardEvent('keydown', {
        key : 32,
        keyCode: 32
      })
    );
  });
});