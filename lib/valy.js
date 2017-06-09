(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Valy", [], factory);
	else if(typeof exports === 'object')
		exports["Valy"] = factory();
	else
		root["Valy"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	__webpack_require__(1);
	
	var _valy = __webpack_require__(2);
	
	var _valy2 = _interopRequireDefault(_valy);
	
	var _valy3 = __webpack_require__(3);
	
	var _valy4 = _interopRequireDefault(_valy3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Constants
	 */
	var INPUT_TYPE_EVENT_INPUT = ['text', 'password', 'color', 'date', 'datetime', 'datetime', 'email', 'month', 'number', 'range', 'search', 'tel', 'time', 'url', 'week'];
	
	/**
	 * Plugion class
	 * Provides API to the user.
	 */
	
	var Valy = function () {
	
	  /**
	   * Plugin class constructor
	   * @param  {element} formElement
	   * @param  {Object} settings    Config object
	   */
	  function Valy(formElement) {
	    var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	    _classCallCheck(this, Valy);
	
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
	
	
	  _createClass(Valy, [{
	    key: 'init',
	    value: function init() {
	      // Stop the browser default validation
	      this.formElement.setAttribute('novalidate', true);
	
	      this.bind();
	    }
	
	    /**
	     * Class event bind method
	     */
	
	  }, {
	    key: 'bind',
	    value: function bind() {
	      var _this = this;
	
	      this.formElement.addEventListener('submit', function (event) {
	        return _this.handleSubmit(event);
	      });
	
	      _valy2.default.collectFormElements(this.formElement).forEach(function (element) {
	        element.addEventListener(INPUT_TYPE_EVENT_INPUT.includes(element.type.toLowerCase()) ? 'input' : 'change', function (event) {
	          return _this.handleElementChange(event);
	        });
	      });
	    }
	
	    /**
	     * Handles submit event - validates form and prevents form submission if there are errors.
	     */
	
	  }, {
	    key: 'handleSubmit',
	    value: function handleSubmit(event) {
	      if (!Valy.validateForm(this.formElement).valid) {
	        event.preventDefault();
	      }
	    }
	
	    /**
	     * Handles element change - live validate elements.
	     */
	
	  }, {
	    key: 'handleElementChange',
	    value: function handleElementChange(event) {
	      Valy.validateElement(event.target);
	
	      // Validate radio siblings, or they may have error set from previous validations.
	      if (event.target.type.toLowerCase() === 'radio') {
	        _valy2.default.getRadioSiblings(event.target).forEach(function (element) {
	          if (element !== event.target) Valy.validateElement(element);
	        });
	      }
	    }
	
	    /**
	     * Validates form
	     * @param  {Element} formElement
	     * @return {Object}             Form valid state and form errors
	     */
	
	  }], [{
	    key: 'validateForm',
	    value: function validateForm(formElement) {
	
	      // Collect form elements
	      var errors = _valy2.default.collectFormElements(formElement)
	
	      // Validate each element
	      .map(function (element) {
	        return {
	          element: element,
	          validation: Valy.validateElement(element)
	        };
	      })
	
	      // Filter only errors
	      .filter(function (item) {
	        return item.validation.errors.length;
	      });
	
	      var valid = !errors.length;
	
	      if (valid) {
	        Valy.setFormValid(formElement);
	      } else {
	        Valy.setFormInvalid(formElement, errors);
	      }
	
	      return { valid: valid, errors: errors };
	    }
	
	    /**
	     * Validates element
	     * @param  {Element} element
	     * @return {Object}         Element valid state and errors
	     */
	
	  }, {
	    key: 'validateElement',
	    value: function validateElement(element) {
	      var validationType = _valy2.default.determineValidationType(element);
	      var validationRules = _valy2.default.getValidationRules(element);
	      var validation = {
	        valid: true,
	        errors: []
	      };
	
	      switch (validationType) {
	        case 'file':
	          validation = _valy2.default.validateFile(element, validationRules);
	          break;
	
	        case 'checkbox':
	          validation = _valy2.default.validateCheckbox(element, validationRules);
	          break;
	
	        case 'radio':
	          validation = _valy2.default.validateRadio(element, validationRules);
	          break;
	
	        case 'select':
	          validation = _valy2.default.validateSelect(element, validationRules);
	          break;
	
	        case 'field':
	          validation = _valy2.default.validateField(element, validationRules);
	          break;
	
	        default:
	          console.error('ValyJS: Can\'t validate "' + (element.name || element.type) + '" element!');
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
	
	  }, {
	    key: 'setElementValid',
	    value: function setElementValid(element) {
	      _valy4.default.setElementValid(element);
	    }
	
	    /**
	     * Sets element as invalid
	     * @param {Element} element
	     * @param {Array} errors  Array of errors
	     */
	
	  }, {
	    key: 'setElementInvalid',
	    value: function setElementInvalid(element, errors) {
	      _valy4.default.setElementInvalid(element, errors);
	    }
	
	    /**
	     * Sets element as valid
	     * @param {Element} element
	     */
	
	  }, {
	    key: 'setFormValid',
	    value: function setFormValid(element) {
	      _valy4.default.setFormValid(element);
	    }
	
	    /**
	     * Sets element as invalid
	     * @param {Element} element
	     * @param {Array} errors  Array of elements ad errors
	     */
	
	  }, {
	    key: 'setFormInvalid',
	    value: function setFormInvalid(element, errors) {
	      _valy4.default.setFormInvalid(element, errors);
	    }
	  }]);
	
	  return Valy;
	}();
	
	exports.default = Valy;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	// Polyfills
	
	// Adds support for Element.closest() - Android 4.4, Edge, Safari 8, iOS Safari 8.4
	if (!('closest' in Element.prototype)) {
	  Element.prototype.closest = function (selector) {
	    var all = Array.from(document.querySelectorAll(selector));
	    var current = this;
	
	    while (current && !all.includes(current)) {
	      current = current.parentNode;
	    }
	
	    return current;
	  };
	}
	
	// Adds support for Element.remove() - IE 11, Android 4.3, Safari 6, iOS Safari 6.1
	if (!('remove' in Element.prototype)) {
	  Element.prototype.remove = function () {
	    if (this.parentNode) {
	      this.parentNode.removeChild(this);
	    }
	  };
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Constants
	 */
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var INPUT_TYPE_FIELD = ['text', 'password', 'color', 'date', 'datetime', 'datetime', 'email', 'month', 'number', 'range', 'search', 'tel', 'time', 'url', 'week', 'file'];
	
	var EXCLUDED_ELEMENT_NAMES = ['button', 'keygen', 'output'];
	
	var EXCLUDED_INPUT_TYPES = ['submit', 'reset', 'button', 'datetime-local'];
	
	var EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	
	var rulesAttribute = 'data-valy-rules';
	
	/**
	 * Core class
	 * Handles core methods.
	 */
	
	var Core = function () {
	  function Core() {
	    _classCallCheck(this, Core);
	  }
	
	  _createClass(Core, null, [{
	    key: 'getRegExpFromString',
	
	
	    /**
	     * Converts RegExp like string to RegExp object
	     * @param  {String} input
	     * @return {RegExp}
	     */
	    value: function getRegExpFromString(input) {
	      return new RegExp(input.match(/^\/(.+)\/(\w*)$/)[1], input.match(/^\/(.+)\/(\w*)$/)[2]);
	    }
	
	    /**
	     * Gets radio element siblings
	     * @param  {Element} element
	     * @return {Array}         Array of elements
	     */
	
	  }, {
	    key: 'getRadioSiblings',
	    value: function getRadioSiblings(element) {
	      return Array.from((element.form || document).querySelectorAll('[name="' + element.name + '"]'));
	    }
	
	    /**
	     * Determines the validation type of an element
	     * @param  {Element} element
	     * @return {String or null}         Validation type or null
	     */
	
	  }, {
	    key: 'determineValidationType',
	    value: function determineValidationType(element) {
	      var elementName = element.nodeName.toLowerCase();
	      var elementType = element.type.toLowerCase();
	
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
	
	  }, {
	    key: 'collectFormElements',
	    value: function collectFormElements(formElement) {
	      return Array.from(formElement.elements).filter(function (element) {
	        var elementName = element.nodeName.toLowerCase();
	        var elementType = element.type.toLowerCase();
	
	        return !(EXCLUDED_ELEMENT_NAMES.includes(elementName) || elementName === 'input' && EXCLUDED_INPUT_TYPES.includes(elementType));
	      });
	    }
	
	    /**
	     * Gets custom validation rules
	     * @param  {Element} element
	     * @return {Array}         Array of validation rules
	     */
	
	  }, {
	    key: 'getCustomValidationRules',
	    value: function getCustomValidationRules(element) {
	      var escapedRegexes = [];
	
	      return element.getAttribute(rulesAttribute)
	
	      // Exclude the escaped slashes from the string
	      .replace(/\\\//g, '@@escapedRegexSlash@@')
	
	      // Exclude the regexes from the string
	      .replace(/\/.*?\/\w+/g, function (match) {
	        escapedRegexes.push(match);
	
	        return '@@escapedRegex' + (escapedRegexes.length - 1) + '@@';
	      })
	
	      // Split the rules into array
	      .split(/;\s?/)
	      // Remove the empty rules
	      .filter(function (rule) {
	        return !!rule;
	      }).map(function (rule) {
	        var key = rule.split('(')[0];
	        var options = rule
	        // Remove the key
	        .replace(key, '')
	
	        // Remove the brackets
	        .replace(/\(|\)/g, '')
	
	        // Split the options into array
	        .split(/,\s?/)
	
	        // Remove the empty options
	        .filter(function (option) {
	          return option !== '';
	        })
	
	        // Add back the regexes or convert to number
	        .map(function (option) {
	          if (!isNaN(option)) {
	            return Number(option);
	          } else if (option.match(/@@escapedRegex(\d+)@@/)) {
	            return Core.getRegExpFromString(option.replace(/@@escapedRegex(\d+)@@/, function (match, index) {
	              return escapedRegexes[index - 0].replace(/@@escapedRegexSlash@@/g, '\\/');
	            }));
	          }
	
	          return option;
	        });
	
	        return { key: key, options: options };
	      });
	    }
	
	    /**
	     * Gets validation rules
	     * @param  {Element} element
	     * @return {Array}         Array of validation rules
	     */
	
	  }, {
	    key: 'getValidationRules',
	    value: function getValidationRules(element) {
	      var rules = [];
	
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
	        rules.push.apply(rules, _toConsumableArray(Core.getCustomValidationRules(element)));
	      }
	
	      return rules;
	    }
	
	    /**
	     * Validates file
	     * @param  {Element} element
	     * @param  {Array} validationRules
	     * @return {Object}                 Element valid state and errors
	     */
	
	  }, {
	    key: 'validateFile',
	    value: function validateFile(element, validationRules) {
	      var valid = true;
	      var errors = [];
	
	      validationRules.forEach(function (rule) {
	
	        switch (rule.key) {
	          case 'required':
	            if (!element.value) {
	              valid = false;
	
	              errors.push('required');
	            }
	            break;
	        }
	      });
	
	      return { valid: valid, errors: errors };
	    }
	
	    /**
	     * Validates checkbox
	     * @param  {Element} element
	     * @param  {Array} validationRules
	     * @return {Object}                 Element valid state and errors
	     */
	
	  }, {
	    key: 'validateCheckbox',
	    value: function validateCheckbox(element, validationRules) {
	      var valid = true;
	      var errors = [];
	
	      validationRules.forEach(function (rule) {
	
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
	
	      return { valid: valid, errors: errors };
	    }
	
	    /**
	     * Validates radio
	     * @param  {Element} element
	     * @param  {Array} validationRules
	     * @return {Object}                 Element valid state and errors
	     */
	
	  }, {
	    key: 'validateRadio',
	    value: function validateRadio(element, validationRules) {
	      var valid = true;
	      var errors = [];
	      var siblings = Core.getRadioSiblings(element);
	
	      validationRules.forEach(function (rule) {
	
	        switch (rule.key) {
	          case 'required':
	            var hasCheckedSibling = false;
	
	            siblings.forEach(function (element) {
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
	
	      return { valid: valid, errors: errors };
	    }
	
	    /**
	     * Validates select
	     * @param  {Element} element
	     * @param  {Array} validationRules
	     * @return {Object}                 Element valid state and errors
	     */
	
	  }, {
	    key: 'validateSelect',
	    value: function validateSelect(element, validationRules) {
	      var valid = true;
	      var errors = [];
	
	      validationRules.forEach(function (rule) {
	
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
	            var selectedCount = Array.from(element.options).filter(function (option) {
	              return option.selected;
	            }).length;
	
	            if (selectedCount < rule.options[0] || selectedCount > rule.options[1]) {
	              valid = false;
	
	              errors.push('selectedCount');
	            }
	            break;
	        }
	      });
	
	      return { valid: valid, errors: errors };
	    }
	
	    /**
	     * Validates field
	     * @param  {Element} element
	     * @param  {Array} validationRules
	     * @return {Object}                 Element valid state and errors
	     */
	
	  }, {
	    key: 'validateField',
	    value: function validateField(element, validationRules) {
	      var valid = true;
	      var value = element.value;
	      var errors = [];
	
	      validationRules.forEach(function (rule) {
	
	        switch (rule.key) {
	          case 'required':
	            if (value === '') {
	              valid = false;
	
	              errors.push('required');
	            }
	            break;
	
	          case 'pattern':
	            if (value !== '' && !rule.options[0].test(value)) {
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
	
	      return { valid: valid, errors: errors };
	    }
	  }]);
	
	  return Core;
	}();
	
	exports.default = Core;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Constants
	 */
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var classHolderAttribute = 'data-valy-class-holder';
	var messageContainerAttribute = 'data-valy-message-container';
	var errorByTypeAttribute = 'data-valy-error-';
	var elementInvalidClass = 'valy-invalid';
	var elementValidClass = 'valy-valid';
	var errorMessageClass = 'valy-error-message';
	var formElementInvalidClass = 'valy-form-invalid';
	var formElementValidClass = 'valy-form-valid';
	
	/**
	 * UI Class
	 * Handles DOM modifications
	 */
	
	var UI = function () {
	  function UI() {
	    _classCallCheck(this, UI);
	  }
	
	  _createClass(UI, null, [{
	    key: 'getHTMLClassHolder',
	
	
	    /**
	     * Gets error/valid class holder of element
	     * @param  {Element} element
	     * @return {Element}         Class holder
	     */
	    value: function getHTMLClassHolder(element) {
	      return element.closest(element.getAttribute(classHolderAttribute)) || element;
	    }
	
	    /**
	     * Gets message container for element messages
	     * @param  {Element} element
	     * @return {Element}         Message container
	     */
	
	  }, {
	    key: 'getMessageContainer',
	    value: function getMessageContainer(element) {
	      var messageContainerSelector = element.getAttribute(messageContainerAttribute);
	      var messageContainer = null;
	      var current = element;
	
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
	
	  }, {
	    key: 'getErrorMessageByType',
	    value: function getErrorMessageByType(element, errorType) {
	      return element.getAttribute(errorByTypeAttribute + errorType);
	    }
	
	    /**
	     * Sets element as valid
	     * @param {Element} element
	     */
	
	  }, {
	    key: 'setElementValid',
	    value: function setElementValid(element) {
	
	      var classHolder = UI.getHTMLClassHolder(element);
	
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
	
	  }, {
	    key: 'setElementInvalid',
	    value: function setElementInvalid(element, errors) {
	
	      var classHolder = UI.getHTMLClassHolder(element);
	
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
	
	  }, {
	    key: 'setFormValid',
	    value: function setFormValid(element) {
	
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
	
	  }, {
	    key: 'setFormInvalid',
	    value: function setFormInvalid(element, formErrors) {
	
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
	
	  }, {
	    key: 'clearElementErrorMessages',
	    value: function clearElementErrorMessages(element) {
	      var messageContainerElement = UI.getMessageContainer(element);
	
	      // Clear messages
	      if (messageContainerElement) {
	        messageContainerElement.querySelectorAll('.' + errorMessageClass).forEach(function (element) {
	          return element.remove();
	        });
	      }
	    }
	
	    /**
	     * Sets element error messages
	     * @param {Element} element
	     * @param {Array} errors  Array of errors
	     */
	
	  }, {
	    key: 'setElementErrorMessages',
	    value: function setElementErrorMessages(element, errors) {
	      var messageContainerElement = UI.getMessageContainer(element);
	
	      // Set messages
	      if (messageContainerElement) {
	        (function () {
	          var messagesFragment = document.createDocumentFragment();
	
	          // Remove duplicates
	          [].concat(_toConsumableArray(new Set(errors))).forEach(function (error) {
	            var errorText = UI.getErrorMessageByType(element, error);
	
	            if (errorText) {
	              var errorElement = document.createElement('span');
	
	              errorElement.textContent = errorText;
	
	              errorElement.classList.add(errorMessageClass);
	
	              messagesFragment.appendChild(errorElement);
	            }
	          });
	
	          UI.clearElementErrorMessages(element);
	
	          messageContainerElement.appendChild(messagesFragment);
	        })();
	      }
	    }
	
	    /**
	     * Sets form element error messages
	     * @param {Element} formElement
	     * @param {Array} formErrors  Array of elements and errors
	     */
	
	  }, {
	    key: 'setFormErrorMessages',
	    value: function setFormErrorMessages(formElement, formErrors) {
	      var messageContainerElement = UI.getMessageContainer(formElement);
	
	      // Set messages
	      if (messageContainerElement) {
	        (function () {
	          var messagesFragment = document.createDocumentFragment();
	
	          formErrors.forEach(function (formError) {
	
	            // Remove duplicates
	            [].concat(_toConsumableArray(new Set(formError.validation.errors))).forEach(function (error) {
	              var errorText = UI.getErrorMessageByType(formError.element, error);
	
	              if (errorText) {
	                var errorElement = document.createElement('span');
	
	                errorElement.textContent = errorText;
	
	                errorElement.classList.add(errorMessageClass);
	
	                messagesFragment.appendChild(errorElement);
	              }
	            });
	          });
	
	          UI.clearElementErrorMessages(formElement);
	
	          messageContainerElement.appendChild(messagesFragment);
	        })();
	      }
	    }
	  }]);
	
	  return UI;
	}();
	
	exports.default = UI;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=valy.js.map