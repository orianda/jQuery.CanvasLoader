(function ($) {
    "use strict";

    /**
     * Generate unique ids
     * @type {Function}
     */
    var uid = (function () {
        var uid = 0;
        return function () {
            return uid++;
        };
    }());

    /**
     * Is value an valid one?
     * @param {*} value
     * @returns {boolean}
     */
    function isValid(value) {
        return !(typeof value === 'undefined' || value === null || typeof value === 'number' && isNaN(value));
    }

    /**
     * Is the value an object?
     * @param {*} value
     * @returns {boolean}
     */
    function isObject(value) {
        return typeof value === 'object' && value !== null;
    }

    /**
     * Is value an promise object?
     * @param {*} value
     * @returns {boolean}
     */
    function isPromise(value) {
        return isObject(value) && typeof value.then === 'function';
    }

    /**
     * Get option of an options set
     * @param {string} name
     * @param {Array} configs
     * @param {jQuery} element
     * @returns {*}
     */
    function getOption(name, configs, element) {
        var config, value, i, l;
        for (i = 0, l = configs.length; i < l; i++) {
            config = isObject(configs[i]) ? configs[i] : $.fn.canvasLoader.options[configs[i]];
            if (config) {
                value = typeof config[name] === 'function' ? config[name](element) : config[name];
                if (isValid(value)) {
                    window.console && window.console.log('success');
                    return value;
                }
            }
        }
        return undefined;
    }

    /**
     * Adds an CanvasLoader overlay to the element
     * This module takes multiple options arguments. The first is the major one,
     * if it misses needed properties, then the next options will be searched for.
     * If the next also misses the required property, then the third will be used and so on.
     *
     * @param {Object|string} [options] Options object or composition name
     * @param {boolean|promise} [options.start] Set to false to prevent autostart or provide an promise object,
     * to automatically stop the pending when the promise resolves or rejects.
     * @param {Function|string} [options.shape]
     * @param {Function|string} [options.color]
     * @param {Function|number} [options.diameter]
     * @param {Function|number} [options.density]
     * @param {Function|number} [options.range]
     * @param {Function|number} [options.speed]
     * @param {Function|number} [options.fps]
     * @param {Object|string} [fallback1] See option argument
     * @param {Object|string} [fallback2] See option argument
     * @return {jQuery}
     */
    $.fn.canvasLoader = function (options, fallback1, fallback2) {
        var collection = this;

        if (!window.CanvasLoader) {
            if (window.console) {
                window.console.error('CanvasLoader library missing!');
            }
            return collection;
        }

        /**
         * Destroy existing canvas loader setups
         */
        collection.trigger('destroy.canvasLoader');

        /**
         * Setup loader for each element
         */
        collection.each(function () {
            var capsule = $(this),
                position = capsule.css('position'),
                overlay,
                animator,
                id = 'canvasLoader' + uid();

            /**
             * Start canvas loader by event
             */
            capsule.on('start.canvasLoader', function () {
                if (capsule.find('> .canvasLoader').length) {
                    return;
                }

                if (position === 'static') {
                    capsule.css('position', 'relative');
                }

                overlay = $('<div id="' + id + '" class="canvasLoader"></div>').appendTo(capsule);

                window.console && window.console.log('get color', getOption('color', collection.canvasLoader.options, capsule));
                animator = new window.CanvasLoader(id);
                animator.setShape(getOption('shape', collection.canvasLoader.options, capsule));
                animator.setColor(getOption('color', collection.canvasLoader.options, capsule));
                animator.setDiameter(getOption('diameter', collection.canvasLoader.options, capsule));
                animator.setDensity(getOption('density', collection.canvasLoader.options, capsule));
                animator.setRange(getOption('range', collection.canvasLoader.options, capsule));
                animator.setSpeed(getOption('speed', collection.canvasLoader.options, capsule));
                animator.setFPS(getOption('fps', collection.canvasLoader.options, capsule));
                animator.show();

                overlay.find('> div').css({
                    marginLeft: animator.getDiameter() / -2,
                    marginTop: animator.getDiameter() / -2
                });
            });

            /**
             * Stop canvas loader by event
             */
            capsule.on('stop.canvasLoader', function () {
                if (overlay && animator) {
                    animator.kill();
                    overlay.remove();
                    capsule.css({position: position});
                    overlay = animator = null;
                }
            });

            /**
             * Cleanup canvas loader instance
             */
            capsule.on('destroy.canvasLoader', function () {
                capsule.trigger('stop.canvasLoader');
                capsule.off('.canvasLoader');
            });
        });

        /**
         * Overwrite module function in order to change the habits
         * @param {boolean|promise} on
         * @returns {jQuery}
         */
        collection.canvasLoader = function (on) {
            if (isPromise(on)) {
                collection.canvasLoader(true);
                on.then(function () {
                    collection.canvasLoader(false);
                }, function () {
                    collection.canvasLoader(false);
                });
            } else {
                collection.trigger((on ? 'start' : 'stop') + '.canvasLoader');
            }
            return collection;
        };

        /**
         * Make options available for manipulations
         */
        collection.canvasLoader.options = Array.prototype.slice.call(arguments);
        collection.canvasLoader.options.push($.fn.canvasLoader.options.defaults);

        /**
         * Initialize canvas loader
         */
        return collection.canvasLoader(getOption('start', collection.canvasLoader.options, collection));
    };

    /**
     * Namespace for custom defined options compositions
     * @type {Object}
     */
    $.fn.canvasLoader.options = {};

    /**
     * Modules default options
     * @type {Object}
     */
    $.fn.canvasLoader.options.defaults = {
        start: true,
        shape: 'spiral',
        color: '#000',
        diameter: 70,
        density: 70,
        range: 0.7,
        speed: 2,
        fps: 24
    };

    /**
     * Options to retrieve the configuration from css properties
     * @type {Object}
     */
    $.fn.canvasLoader.options.css = {
        shape: function (element) {
            return element.css('font-family');
        },
        color: function (element) {
            return element.css('color');
        },
        diameter: function (element) {
            return parseFloat(element.css('line-height'));
        },
        density: function (element) {
            return parseFloat(element.css('letter-spacing'));
        },
        range: function (element) {
            return parseFloat(element.css('font-weight'));
        },
        speed: function (element) {
            return parseFloat(element.css('font-size'));
        },
        fps: function (element) {
            return parseFloat(element.css('text-indent'));
        }
    };

    /**
     * Options to retrieve the configuration from data attributes of the element
     * @type {Object}
     */
    $.fn.canvasLoader.options.data = {
        shape: function (element) {
            return element.data('canvas-loader-shape');
        },
        color: function (element) {
            return element.data('canvas-loader-color');
        },
        diameter: function (element) {
            return parseFloat(element.data('canvas-loader-diameter'));
        },
        density: function (element) {
            return parseFloat(element.data('canvas-loader-density'));
        },
        range: function (element) {
            return parseFloat(element.data('canvas-loader-range'));
        },
        speed: function (element) {
            return parseFloat(element.data('canvas-loader-speed'));
        },
        fps: function (element) {
            return parseFloat(element.data('canvas-loader-fps'));
        }
    };

    /**
     * Version of the canvas loader module
     * @type {string}
     */
    $.fn.canvasLoader.version = '{{version}}';

})(jQuery);