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
    subscribeThankYouContainer: '[data-subscribe-thank-you-container]'
  }

  _init() {
    this.subscribeForm = this.app.querySelector(this.selectors.subscribeForm);
    this.formButton = this.subscribeForm.querySelector(this.selectors.formButton);
    this.subscribeFormContainer = this.app.querySelector(this.selectors.subscribeFormContainer);
    this.subscribeThankYouContainer = this.app.querySelector(this.selectors.subscribeThankYouContainer);
    console.log('this is the form', this.subscribeForm)
  }

  _bindEvents() {
    this.formButton.addEventListener('click', (e) => this.handleSubscribeFormSubmit(e))
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
          console.log(error.message);
          this.putFormMessage(this.subscribeForm, 'Please include your email', true)
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
