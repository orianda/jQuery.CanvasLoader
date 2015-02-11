# jQuery.CanvasLoader

jQuery wrapper for [heartcodes CanvasLoader](https://github.com/heartcode/CanvasLoader).

## Usage

### Creating loader instance

In order to use the canvas loader you need to create an instance and provide the configuration for the layout.

Create canvas loader instance using the default options:

```javascript
$('div').canvasLoader();
```

Create canvas loader instance using custom options:

```javascript
$('div').canvasLoader({
    color: '#f00'
});
```

### Global options

Create custom options set to be used in multiple canvas loader instances:

```javascript
// Define custom option set
$.fn.canvasLoader.options.customOptions = {
    color: '#00'
};

// Create instance by referencing the custom options set
$('div').canvasLoader('customOptions');
```

### Fallback options

Using fallback options to cover missing properties of the main options:
The amount of fallback arguments is not limited.

```javascript
$('div').canvasLoader({
        color: '#f00' // Main options
    }, {
        shape: 'oval' // First fallback options
    }, {
        range: 1.2    // Second fallback options
    },
    ...
);
```

Fallback arguments can also refer to custom defined options:

```javascript
// Define fallback options
$.fn.canvasLoader.options.firstFallbackOptions = {
    shape: 'oval'
};
$.fn.canvasLoader.options.secondFallbackOptions = {
    range: 1.2
};

// Create instance by referencing the custom options set
$('div').canvasLoader({
    color: '#f00' // Main options
}, 'firstFallbackOptions', 'secondFallbackOptions', ...);
```

### Switching canvas loader on and off

After the instance is created, you can easily switching the loader on and off:

```javascript
var element = $('div').canvasLoader();  // Create instance
element.canvasLoader(false); // remove canvas loader
element.canvasLoader(true);  // activate canvas loader
```

The canvas loader will be enabled automatically during the crating process. To prevent this, set the _start_ option to false:

```javascript
$('div').canvasLoader({
    start: false
});
```

The canvas loader can also switched using events. This is useful, if the origin instance is not available:

```javascript
// Create and enable canvas loader
var element = $('div').canvasLoader();

// remove canvas loader
$(element).trigger('stop.canvasLoader');

// reactivate canvas loader
$(element).trigger('start.canvasLoader');
```

### Destroy canvas loader instance

The canvas loader instance can be destroyed by an event. After that, the canvas loader can not be enabled anymore.

```javascript
// Create and enable canvas loader
var element = $('div').canvasLoader();

// disable and remove setup
element.trigger('destroy.canvasLoader');

// this call does not work anymore
element.canvasLoader(true);
```

Prior created instances will be destroyed automatically, if the canvas loader got created again:

```javascript
// Create and enable canvas loader
var element = $('div').canvasLoader({
    color: '#f00'
});

// Destroys the red canvas loader and creates and enables the green one
var element = $('div').canvasLoader({
    color: '#0f0'
});
```

### Modify options after canvas loader is created

The options for an canvas loader instance will be available and can easily be modified:

```javascript
var element = $('div').canvasLoader({
    color: '#f00' // main options
}, 'fallback1', 'fallback2');

// change property of main options
element.canvasLoader.options[0].color = '#0f0';

// replace first fallback options
element.canvasLoader.options[1] = {
    shape: 'oval'
};

// remove the last fallback
element.canvasLoader.options.pop();  // returns the string 'fallback2'

// attach an further fallback options
element.canvasLoader.options.push('fallback1');
```

The options property of the _canvasLoader_ is an array containing the unmodified instantiating arguments.

*The changes on the options does not affect currently running canvas loaders.*

### Support for deferred and promise objects

If there is a promise object provided, then the canvas loader will starts immediately and will be removed right after the promise is resolved or rejected:

```javascript
// Provide the promise during initialization
$('div').canvasLoader({
    start: promise
});

// Provide the promise for an already created canvas loader
element.canvasLoader(promise);
```

### Special behavior on body element

If the canvas loader is attached to the body element, then it will be fixed to the screen center also during scrolling.

```javascript
$('body').canvasLoader();
```

### Current module version

This snipped will give you the current module version:

```javascript
console.log($.fn.canvasLoader.version);
```

## Options

### start

A boolean value which will enable the loader during initialization or keep it disabled. The default value is _true_.

This option can also take an promise object. In that case the loader will start immediately and will stop right after the promise is resolved or rejected.

### shape

The shape of the loader. Can be one of the following: oval, spiral, square, rect, roundRect

This option will directly be forwarded to [heartcodes CanvasLoader](https://github.com/heartcode/CanvasLoader).

### color

The hexadecimal color of the loader.

This option will directly be forwarded to [heartcodes CanvasLoader](https://github.com/heartcode/CanvasLoader).

### diameter

The diameter of the loader.

This option will directly be forwarded to [heartcodes CanvasLoader](https://github.com/heartcode/CanvasLoader).

### density

The density of the loader.

This option will directly be forwarded to [heartcodes CanvasLoader](https://github.com/heartcode/CanvasLoader).

### range

The range of the loader.

This option will directly be forwarded to [heartcodes CanvasLoader](https://github.com/heartcode/CanvasLoader).

### speed

The speed of the loader.

This option will directly be forwarded to [heartcodes CanvasLoader](https://github.com/heartcode/CanvasLoader).

### fps

The frames per second of the loader.

This option will directly be forwarded to [heartcodes CanvasLoader](https://github.com/heartcode/CanvasLoader).

### Dynamic options

The options _shape_, _color_, _diameter_, _density_, _range_, _speed_ and _fps_ can also be functions which take the current element as parameter and need to return the requested option value.

```javascript
$('div').canvasLoader({
    color: function(element){
        var whatColor = Math.random() * 10 > 5;
        return whatColor ? '#f00' : '#0f0';
    }
});
```

## Predefined global options

There are three predefined global options:

### defaults

This options are the default ones for all canvas loader instances. If there are no special options provided then this will be used.

```javascript
// manipulate the default options
$.fn.canvasLoader.options.defaults.color = '#f00';
```

### attr

The *attr* options will check the current element if there are data attributes provided for the canvas loader.

The naming for the attributes are the same as for the options itself prefixed by the string 'data-canvas-loader-':

```html
<div class="attr-canvas-loader" data-canvas-loader-color="#f00"></div>
```

To use this syntax you need to provide the options name on instance creation:

```javascript
$('.attr-canvas-loader').canvasLoader('attr', {
    color: '#f00'  // fallback, in case the color attribute does not exists
});
```

The options set *attr* supports the options _shape_, _color_, _diameter_, _density_, _range_, _speed_ and _fps_;

### css

The *css* options will extract the loader options from the style definition of the current element.

The following css properties will be wrapped into loader options:

```css
.css-canvas-loader {
    font-family: oval;     /* matches shape */
    color: #f00;           /* matches color */
    line-height: 103px;    /* matches diameter */
    letter-spacing: 33px;  /* matches density */
    word-spacing: 1.2px;   /* matches range */
    font-size: 8px;        /* matches speed */
    text-indent: 25px;     /* matches fps */
}
```

To use this syntax you need to provide the options name on instance creation:

```javascript
$('.css-canvas-loader').canvasLoader('css', {
    color: '#f00'  // fallback, in case the color attribute does not exists
});
```

The options set *css* supports the options _shape_, _color_, _diameter_, _density_, _range_, _speed_ and _fps_;