# ValyJS

Intuitive frontend form validation, using the HTML5 standard attributes + custom attributes for extended validation options.


## Install

```
$ npm install --save valy
```


## Usage

### ES6:
```js
const Valy = require('valy');

new Valy(document.querySelector('#myForm'));
```

### ES3:
First include the library in your html:

```html
  <script type="text/javascript" src="valy.min.js"></script>
```

```js
new Valy(document.querySelector('#myForm'));
```

In the HTML:
```html
<form action="?" method="post" id="myForm">
  ...
</form>
```

## API

### Validation rules

To define validation rules, you can use either the HTML5 standard attributes (`required`, `pattern` or `type="email"`), or custom validation rules attribute: `data-valy-rules`.

For the custom validation rules attribute, you must use the specified syntaxis:

```html
data-valy-riles="rule1(option1, option2); rule2(option1, option2);"
```

You can have as many rules as you need, you can also have duplicated rules, with different options (very useful for the **pattern** rule).


#### All form element rules:

##### required

```html
<input type="text" required>

<input type="text" data-valy-rules="required">
```

*Makes the field required.*

#### Field form element type:

##### pattern

```html
<input type="text" pattern="^[a-Z]$">

<input type="text" data-valy-rules="pattern(/^[a-z]$/i)">
```

*Validates the field value against the provided regular expression.*

###### Options:
- {String} (mandatory): Regular expression like string: `/^[a-z]$/i`

##### email

```html
<input type="email">

<input type="text" data-valy-rules="email">
```

*Validates the field value against predefined email regular expression.*

##### presence

```html
<input type="text" data-valy-rules="presence(6, 10)">
```

*Makes the field required.*

###### Options:
- {Number} (optional) - The minimum value length
- {Number} (optional) - The maximum value length

##### exact

```html
<input type="text" required>
```

*Makes the field required.*

##### number

```html
<input type="text" required>
```

*Makes the field required.*

##### matchField

```html
<input type="text" required>
```

*Makes the field required.*


## License

MIT © [Nikola Boychev](https://nboychev.com)
