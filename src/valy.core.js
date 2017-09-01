'use strict';

/**
 * Constants
 */
const INPUT_TYPE_FIELD = [
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
  'week',
  'file'
];

const EXCLUDED_ELEMENT_NAMES = [
  'button',
  'keygen',
  'output'
];

const EXCLUDED_INPUT_TYPES = [
  'submit',
  'reset',
  'button',
  'datetime-local',
  'hidden'
];

const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const rulesAttribute = 'data-valy-rules';

/**
 * Core class
 * Handles core methods.
 */
export default class Core {

  /**
   * Converts RegExp like string to RegExp object
   * @param  {String} input
   * @return {RegExp}
   */
  static getRegExpFromString(input) {
    return new RegExp(input.match(/^\/(.+)\/(\w*)$/)[1], input.match(/^\/(.+)\/(\w*)$/)[2]);
  }

  /**
   * Gets radio element siblings
   * @param  {Element} element
   * @return {Array}         Array of elements
   */
  static getRadioSiblings(element) {
    return Array.from((element.form || document).querySelectorAll(`[name="${element.name}"]`));
  }

  /**
   * Determines the validation type of an element
   * @param  {Element} element
   * @return {String or null}         Validation type or null
   */
  static determineValidationType(element) {
    const elementName = element.nodeName.toLowerCase();
    const elementType = element.type.toLowerCase();

    switch (true) {
      case elementName === 'textarea':
      case elementName === 'input' && INPUT_TYPE_FIELD.includes(elementType):
        return 'field';

      case elementName === 'input' && elementType === 'checkbox':
        return 'checkbox';

      case elementName === 'input' && elementType === 'radio':
        return 'radio';

      case elementName === 'select':
        return 'select';

      default:
        return null;
    }
  }

  /**
   * Collects form elements
   * @param  {Element} formElement
   * @return {Array}             Array of elements
   */
  static collectFormElements(formElement) {
    return Array.from(formElement.elements).filter(element => {
      const elementName = element.nodeName.toLowerCase();
      const elementType = element.type.toLowerCase();

      return !(
        EXCLUDED_ELEMENT_NAMES.includes(elementName) ||
        elementName === 'input' &&
        EXCLUDED_INPUT_TYPES.includes(elementType)
      );
    });
  }

  /**
   * Gets custom validation rules
   * @param  {Element} element
   * @return {Array}         Array of validation rules
   */
  static getCustomValidationRules(element) {
    const escapedRegexes = [];

    return element.getAttribute(rulesAttribute)

      // Exclude the escaped slashes from the string
      .replace(/\\\//g, '@@escapedRegexSlash@@')

      // Exclude the regexes from the string
      .replace(/\/.*?\/\w*/g, match => {
        escapedRegexes.push(match);

        return `@@escapedRegex${(escapedRegexes.length - 1)}@@`;
      })

      // Split the rules into array
      .split(/;\s?/)
        // Remove the empty rules
        .filter(rule => !!rule)
        .map(rule => {
          const key = rule.split('(')[0];
          const options = rule
            // Remove the key
            .replace(key, '')

            // Remove the brackets
            .replace(/\(|\)/g, '')

            // Split the options into array
            .split(/,\s?/)

            // Remove the empty options
            .filter(option => option !== '')

            // Add back the regexes or convert to number
            .map(option => {
              if (!isNaN(option)) {
                return Number(option);
              } else if (option.match(/@@escapedRegex(\d+)@@/)) {
                return Core.getRegExpFromString(option
                  .replace(/@@escapedRegex(\d+)@@/, (match, index) =>
                    escapedRegexes[index - 0].replace(/@@escapedRegexSlash@@/g, '\\/')
                  ));
              }

              return option;

            });

          return {key, options};
        });
  }

  /**
   * Gets validation rules
   * @param  {Element} element
   * @return {Array}         Array of validation rules
   */
  static getValidationRules(element) {
    const rules = [];

    if (element.required) {
      rules.push({
        key: 'required',
        options: []
      });
    }

    if (element.pattern) {
      rules.push({
        key: 'pattern',
        options: new RegExp(element.pattern)
      });
    }

    if (element.type && element.type === 'email') {
      rules.push({
        key: 'email'
      });
    }

    if (element.getAttribute(rulesAttribute)) {
      rules.push(...Core.getCustomValidationRules(element));
    }

    return rules;
  }

  /**
   * Validates file
   * @param  {Element} element
   * @param  {Array} validationRules
   * @return {Object}                 Element valid state and errors
   */
  static validateFile(element, validationRules) {
    let valid = true;
    const errors = [];

    validationRules.forEach(rule => {

      switch (rule.key) {
        case 'required':
          if (!element.value) {
            valid = false;

            errors.push('required');
          }
          break;
      }
    });

    return {valid, errors};
  }

  /**
   * Validates checkbox
   * @param  {Element} element
   * @param  {Array} validationRules
   * @return {Object}                 Element valid state and errors
   */
  static validateCheckbox(element, validationRules) {
    let valid = true;
    const errors = [];

    validationRules.forEach(rule => {

      switch (rule.key) {
        case 'required':
          if (!element.checked) {
            valid = false;

            errors.push('required');
          }
          break;

        case 'unchecked':
          if (element.checked) {
            valid = false;

            errors.push('unchecked');
          }
          break;
      }
    });

    return {valid, errors};
  }

  /**
   * Validates radio
   * @param  {Element} element
   * @param  {Array} validationRules
   * @return {Object}                 Element valid state and errors
   */
  static validateRadio(element, validationRules) {
    let valid = true;
    const errors = [];
    const siblings = Core.getRadioSiblings(element);

    validationRules.forEach(rule => {

      switch (rule.key) {
        case 'required':
          let hasCheckedSibling = false;

          siblings.forEach(element => {
            if (element.checked) {
              hasCheckedSibling = true;
            }
          });

          if (!hasCheckedSibling) {
            valid = false;

            errors.push('required');
          }
          break;

        case 'selected':
          if (!element.checked) {
            valid = false;

            errors.push('selected');
          }
          break;

        case 'unselected':
          if (element.checked) {
            valid = false;

            errors.push('unselected');
          }
          break;
      }
    });

    return {valid, errors};
  }

  /**
   * Validates select
   * @param  {Element} element
   * @param  {Array} validationRules
   * @return {Object}                 Element valid state and errors
   */
  static validateSelect(element, validationRules) {
    let valid = true;
    const errors = [];

    validationRules.forEach(rule => {

      switch (rule.key) {
        case 'required':
          if (element.value === '') {
            valid = false;

            errors.push('required');
          }
          break;

        case 'exact':
          if (element.value !== rule.options[0]) {
            valid = false;

            errors.push('exact');
          }
          break;

        case 'selectedCount':
          const selectedCount = Array.from(element.options).filter(option => option.selected).length;

          if (selectedCount < rule.options[0] || selectedCount > rule.options[1]) {
            valid = false;

            errors.push('selectedCount');
          }
          break;
      }
    });

    return {valid, errors};
  }

  /**
   * Validates field
   * @param  {Element} element
   * @param  {Array} validationRules
   * @return {Object}                 Element valid state and errors
   */
  static validateField(element, validationRules) {
    let valid = true;
    const value = element.value;
    const errors = [];

    validationRules.forEach(rule => {

      switch (rule.key) {
        case 'required':
          if (value === '') {
            valid = false;

            errors.push('required');
          }
          break;

        case 'pattern':
          if (value !== '' && !(rule.options[0] || rule.options).test(value)) {
            valid = false;

            errors.push('pattern');
          }
          break;

        case 'email':
          if (value !== '' && !value.match(EMAIL_REGEX)) {
            valid = false;

            errors.push('email');
          }
          break;

        case 'presence':
          if (value.length < (rule.options.length ? rule.options[0] : 1) || value.length > rule.options[1]) {
            valid = false;

            errors.push('presence');
          }
          break;

        case 'exact':
          if (value !== rule.options[0]) {
            valid = false;

            errors.push('exact');
          }
          break;

        case 'number':
          if (isNaN(value) || Number(value) < rule.options[0] || Number(value) > rule.options[1]) {
            valid = false;

            errors.push('number');
          }
          break;

        case 'matchField':
          if (document.querySelector(rule.options[0]) && value !== document.querySelector(rule.options[0]).value) {
            valid = false;

            errors.push('matchField');
          }
          break;
      }
    });

    return {valid, errors};
  }
}
