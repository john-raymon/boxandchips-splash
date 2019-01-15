/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import * as EmailValidator from 'email-validator';
import $ from 'jquery';
// import axios from 'axios';

const IDLE = 'IDLE'
const ERROR = 'ERROR'
const LOADING = 'LOADING'

class App {
  constructor(app) {
    this.state = {
      status: "IDLE"
    }
    this.app = app;
    this._init();
    this._bindEvents();
  }

  selectors = {
    subscribeForm: '[data-subscribe-form]',
    formMessage: '[data-form-message]',
    formButton: '[data-form-submit]',
    subscribeFormContainer: '[data-subscribe-form-container]',
    subscribeThankYouContainer: '[data-subscribe-thank-you-container]',
    subscribeEmailField: '[data-subscribe-email-field]'
  }

  _init() {
    window.dataLayer = window.dataLayer || []
    this.subscribeForm = this.app.querySelector(this.selectors.subscribeForm);
    this.formButton = this.subscribeForm.querySelector(this.selectors.formButton);
    this.subscribeFormContainer = this.app.querySelector(this.selectors.subscribeFormContainer);
    this.subscribeThankYouContainer = this.app.querySelector(this.selectors.subscribeThankYouContainer);
    this.subscribeEmailField = this.app.querySelector(this.selectors.subscribeEmailField);
  }

  _bindEvents() {
    if ('ontouchstart' in window) {
      this.app.classList.add('pointer');
    } // fix ios click/touch issue https://stackoverflow.com/a/16006333/8320709

    this.app.addEventListener("click", (e) => {
      // window.ga('splashTracker.send', {
      //   hitType: 'event',
      //   eventCategory: e.target.id + '',
      //   eventAction: 'Click',
      //   eventLabel: 'Generic Click on Page'
      // });

      const isInternal = !!(document.cookie.match(/^(?:.*;)?\s*InternalTraffic\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1];
      if (!isInternal) {
        window.dataLayer.push({
            'event':'genericClick',
            'eventCategory': e.target.id === undefined ? e.target.type : e.target.id,
            'eventAction': 'Click',
            'eventLabel': 'Generic Click on Splash-Page'
         });
      }
    })

    this.subscribeForm.addEventListener('submit', (e) => this.handleSubscribeFormSubmit(e));

    this.subscribeEmailField.addEventListener('focus', (e) => {

      console.log('focused into sub. field')
      // window.ga('splashTracker.send', {
      //   hitType: 'event',
      //   eventCategory: 'Subscribe Email Field',
      //   eventAction: 'Focus',
      //   eventLabel: 'Splash Campaign'
      // });

      const isInternal = !!(document.cookie.match(/^(?:.*;)?\s*InternalTraffic\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1];
      if (!isInternal) {
        window.dataLayer.push({
          'event': 'subscribe_email_field_focus',
          'eventCategory': 'Subscribe Email Field',
          'eventAction': 'Focus',
          'eventLabel': 'Splash Campaign'
        });
      }
    })
  }

  putFormMessage(form, message, error = false) {
    const formStates = [
      'FormMessage--idle',
      'FormMessage--error'
    ]
    const formMessage = form.querySelector(this.selectors.formMessage);
    formMessage.classList.remove(formStates);
    formMessage.innerHTML = message
    formMessage.classList.add(formStates[0]);
    if (error) formMessage.classList.add(formStates[1]);
  }

  handleSubscribeSuccess(){
    window.ga('splashTracker.send', {
      hitType: 'event',
      eventCategory: 'Splash Subscription Form',
      eventAction: 'Subscribed',
      eventLabel: 'Splash Subscribers',
      nonInteraction: true
    });

    this.subscribeFormContainer.classList.add('Splash--success');
    this.subscribeThankYouContainer.classList.add('Splash__thank-you-container--initialize');
  }

  handleSubscribeFormSubmit(e) {
    e.preventDefault()
    const email = this.subscribeForm.elements['email'].value.trim();

    if ( email.length ) {

      if (EmailValidator.validate(email)) {
        $.ajax({
          method: 'post',
          url: '/subscribe',
          dataType: 'script',
          data: {email}
        })
        .catch((error) => {
          this.putFormMessage(this.subscribeForm, 'There was an error that was caught when making the request', true)
        });

      } else {
        this.putFormMessage(this.subscribeForm, 'Please include a valid email', true)
      }

    } else {
      this.putFormMessage(this.subscribeForm, 'Please include your email', true)
    }
  }

  setStatus(status) {
    const newState = Object.assign({}, this.state, { status: status })
    this.state = newState;
  }

  status() {
    return this.state.status;
  }
}

document.addEventListener('readystatechange', event => {
  if (event.target.readyState === 'complete') window.app = new App(document.getElementById('root'));
});
