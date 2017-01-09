'use strict';

/**
 * Constants
 */
const classHolderAttribute = 'data-valy-class-holder';
const messageContainerAttribute = 'data-valy-message-container';
const errorByTypeAttribute = 'data-valy-error-';
const elementInvalidClass = 'valy-invalid';
const elementValidClass = 'valy-valid';
const errorMessageClass = 'valy-error-message';
const formElementInvalidClass = 'valy-form-invalid';
const formElementValidClass = 'valy-form-valid';

/**
 * UI Class
 * Handles DOM modifications
 */
export default class UI {

  /**
   * Gets error/valid class holder of element
   * @param  {Element} element
   * @return {Element}         Class holder
   */
  static getHTMLClassHolder(element) {
    return element.closest(element.getAttribute(classHolderAttribute)) || element;
  }

  /**
   * Gets message container for element messages
   * @param  {Element} element
   * @return {Element}         Message container
   */
  static getMessageContainer(element) {
    const messageContainerSelector = element.getAttribute(messageContainerAttribute);
    let messageContainer = null;
    let current = element;

    if (!messageContainerSelector) {
      return null;
    }

    while (current && !messageContainer) {
      messageContainer = current.querySelector(messageContainerSelector);
      current = current.parentNode;
    }

    return messageContainer;
  }

  /**
   * Gets error message for specific element by it's type
   * @param  {Element} element
   * @param  {String} errorType
   * @return {String}           Error message
   */
  static getErrorMessageByType(element, errorType) {
    return element.getAttribute(errorByTypeAttribute + errorType);
  }

  /**
   * Sets element as valid
   * @param {Element} element
   */
  static setElementValid(element) {

    const classHolder = UI.getHTMLClassHolder(element);

    // Make element valid
    element.setCustomValidity('');

    // Add valid class to the class holder
    classHolder.classList.add(elementValidClass);

    // Remove invalid class from the class holder
    classHolder.classList.remove(elementInvalidClass);

    UI.clearElementErrorMessages(element);
  }

  /**
   * Sets element as invalid
   * @param {Element} element
   * @param {Array} errors  Array of errors
   */
  static setElementInvalid(element, errors) {

    const classHolder = UI.getHTMLClassHolder(element);

    // Make element invalid
    element.setCustomValidity(errors.join(', '));

    // Add invalid class to the class holder
    classHolder.classList.add(elementInvalidClass);

    // Remove valid class from the class holder
    classHolder.classList.remove(elementValidClass);

    UI.setElementErrorMessages(element, errors);
  }

  /**
   * Sets form as valid
   * @param {Element} element
   */
  static setFormValid(element) {

    // Add valid class to the element
    element.classList.add(formElementValidClass);

    // Remove invalid class from the element
    element.classList.remove(formElementInvalidClass);

    UI.clearElementErrorMessages(element);
  }

  /**
   * Sets form as invalid
   * @param {Element} element
   * @param {Array} formErrors Array of elements and errors
   */
  static setFormInvalid(element, formErrors) {

    // Add error class to the element
    element.classList.add(formElementInvalidClass);

    // Remove valid class from the element
    element.classList.remove(formElementValidClass);

    UI.setFormErrorMessages(element, formErrors);
  }

  /**
   * Clears element error messages
   * @param  {Element} element
   */
  static clearElementErrorMessages(element) {
    const messageContainerElement = UI.getMessageContainer(element);

    // Clear messages
    if (messageContainerElement) {
      messageContainerElement
        .querySelectorAll(`.${errorMessageClass}`)
        .forEach(element => element.remove());
    }
  }

  /**
   * Sets element error messages
   * @param {Element} element
   * @param {Array} errors  Array of errors
   */
  static setElementErrorMessages(element, errors) {
    const messageContainerElement = UI.getMessageContainer(element);

    // Set messages
    if (messageContainerElement) {
      const messagesFragment = document.createDocumentFragment();

      // Remove duplicates
      [...new Set(errors)]
        .forEach(error => {
          const errorText = UI.getErrorMessageByType(element, error);

          if (errorText) {
            const errorElement = document.createElement('span');

            errorElement.textContent = errorText;

            errorElement.classList.add(errorMessageClass);

            messagesFragment.appendChild(errorElement);
          }
        });

      UI.clearElementErrorMessages(element);

      messageContainerElement.appendChild(messagesFragment);
    }

  }

  /**
   * Sets form element error messages
   * @param {Element} formElement
   * @param {Array} formErrors  Array of elements and errors
   */
  static setFormErrorMessages(formElement, formErrors) {
    const messageContainerElement = UI.getMessageContainer(formElement);

    // Set messages
    if (messageContainerElement) {
      const messagesFragment = document.createDocumentFragment();

      formErrors.forEach(formError => {

        // Remove duplicates
        [...new Set(formError.validation.errors)]
          .forEach(error => {
            const errorText = UI.getErrorMessageByType(formError.element, error);

            if (errorText) {
              const errorElement = document.createElement('span');

              errorElement.textContent = errorText;

              errorElement.classList.add(errorMessageClass);

              messagesFragment.appendChild(errorElement);
            }
          });
      });

      UI.clearElementErrorMessages(formElement);

      messageContainerElement.appendChild(messagesFragment);
    }
  }

}
