'use strict';

import './polyfills';
import Core from './valy.core';
import UI from './valy.ui';

/**
 * Constants
 */
const INPUT_TYPE_EVENT_INPUT = [
  'text',
  'password',
  'color',
  'date',
  'datetime',
  'datetime',
  'email',
  'month',
  'number',
  'range',
  'search',
  'tel',
  'time',
  'url',
  'week'
];

/**
 * Plugion class
 * Provides API to the user.
 */
export default class Valy {

  /**
   * Plugin class constructor
   * @param  {element} formElement
   * @param  {Object} settings    Config object
   */
  constructor(formElement, settings = {}) {
    // Prevent initialisation if there is no element present.
    if (!formElement) {
      return;
    }

    this.formElement = formElement;

    this.settings = settings;

    this.init();
  }

  /**
   * Class initialize method
   */
  init() {
    // Stop the browser default validation
    this.formElement.setAttribute('novalidate', true);

    this.bind();
  }

  /**
   * Class event bind method
   */
  bind() {
    this.formElement.addEventListener('submit', event => this.handleSubmit(event));

    Core.collectFormElements(this.formElement).forEach((element) => {
      element.addEventListener(
        (INPUT_TYPE_EVENT_INPUT.includes(element.type.toLowerCase()) ? 'input' : 'change'),
        event => this.handleElementChange(event)
      );
    });
  }

  /**
   * Handles submit event - validates form and prevents form submission if there are errors.
   */
  handleSubmit(event) {
    if (!Valy.validateForm(this.formElement).valid) {
      event.preventDefault();
    }
  }

  /**
   * Handles element change - live validate elements.
   */
  handleElementChange(event) {
    Valy.validateElement(event.target);

    // Validate radio siblings, or they may have error set from previous validations.
    if (event.target.type.toLowerCase() === 'radio') {
      Core.getRadioSiblings(event.target).forEach(element => {
        if (element !== event.target) Valy.validateElement(element);
      });
    }
  }

  /**
   * Validates form
   * @param  {Element} formElement
   * @return {Object}             Form valid state and form errors
   */
  static validateForm(formElement) {

    // Collect form elements
    const errors = Core.collectFormElements(formElement)

      // Validate each element
      .map(element => {
        return {
          element: element,
          validation: Valy.validateElement(element)
        };
      })

      // Filter only errors
      .filter(item => item.validation.errors.length);

    const valid = !errors.length;

    if (valid) {
      Valy.setFormValid(formElement);
    } else {
      Valy.setFormInvalid(formElement, errors);
    }

    return {valid, errors};
  }

  /**
   * Validates element
   * @param  {Element} element
   * @return {Object}         Element valid state and errors
   */
  static validateElement(element) {
    const validationType = Core.determineValidationType(element);
    const validationRules = Core.getValidationRules(element);
    let validation = {
      valid: true,
      errors: []
    };

    switch (validationType) {
      case 'file':
        validation = Core.validateFile(element, validationRules);
        break;

      case 'checkbox':
        validation = Core.validateCheckbox(element, validationRules);
        break;

      case 'radio':
        validation = Core.validateRadio(element, validationRules);
        break;

      case 'select':
        validation = Core.validateSelect(element, validationRules);
        break;

      case 'field':
        validation = Core.validateField(element, validationRules);
        break;

      default:
        console.error(`ValyJS: Can't validate "${element.name || element.type}" element!`);
    }

    if (validation.valid) {
      Valy.setElementValid(element);
    } else {
      Valy.setElementInvalid(element, validation.errors);
    }

    return validation;
  }

  /**
   * Sets element as valid
   * @param {Element} element
   */
  static setElementValid(element) {
    UI.setElementValid(element);
  }

  /**
   * Sets element as invalid
   * @param {Element} element
   * @param {Array} errors  Array of errors
   */
  static setElementInvalid(element, errors) {
    UI.setElementInvalid(element, errors);
  }

  /**
   * Sets element as valid
   * @param {Element} element
   */
  static setFormValid(element) {
    UI.setFormValid(element);
  }

  /**
   * Sets element as invalid
   * @param {Element} element
   * @param {Array} errors  Array of elements ad errors
   */
  static setFormInvalid(element, errors) {
    UI.setFormInvalid(element, errors);
  }

}
