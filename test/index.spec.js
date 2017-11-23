import should from 'should';
import Boilerplate from '../dist/storm-component-boilerplate.standalone';
import 'jsdom-global/register';

const html = `<div class="js-calendar"></div>`;

document.body.innerHTML = html;
  
let components = Boilerplate.init('.js-calendar'),
    componentsTwo = Boilerplate.init.call(Boilerplate, '.js-calendar-two', {
      callback(){
        this.node.classList.toggle('callback-test');
      }
    });


describe('Initialisation', () => {

  it('should return array of length 2', () => {

    should(components)
      .Array()
      .and.have.lengthOf(2);

  });

  it('each array item should be an object with DOMElement, settings, init, and  handleClick properties', () => {

    components[0].should.be.an.instanceOf(Object).and.not.empty();
    components[0].should.have.property('node');
    components[0].should.have.property('settings').Object();
    components[0].should.have.property('init').Function()

  });


  // it('should throw an error if no elements are found', () => {

  //   Boilerplate.init.bind(Boilerplate, '.js-err').should.throw();

  // })
  
  it('should initialisation with different settings if different options are passed', () => {

    should(componentsTwo[0].settings.callback).not.equal(components[0].settings.callback);
  
  });

});