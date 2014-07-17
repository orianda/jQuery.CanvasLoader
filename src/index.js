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
     * Adds an CanvasLoader overlay to the element
     * @param {Object} [options]
     * @param {string} [options.shape]
     * @param {string} [options.color]
     * @param {number} [options.diameter]
     * @param {number} [options.density]
     * @param {number} [options.range]
     * @param {number} [options.speed]
     * @param {number} [options.fps]
     * @return {jQuery}
     */
    $.fn.canvasLoader = function (options) {
        var collection = this;

        /**
         * Extend given options by default ones
         * @type {Object}
         */
        options = $.extend({}, $.fn.canvasLoader.options, options);

        /**
         * Setup loader for each element
         */
        this.each(function () {
            var capsule = $(this),
                position = capsule.css('position'),
                overlay,
                animator,
                id = 'canvasLoader' + uid();

            if (!window.CanvasLoader) {
                if (window.console) {
                    window.console.error('CanvasLoader Library missing!');
                }
                return;
            }

            if (capsule.find('> .canvasLoader').length) {
                return;
            }

            if (position === 'static') {
                capsule.css('position', 'relative');
            }

            overlay = $('<div id="' + id + '" class="canvasLoader"></div>').appendTo(capsule);

            animator = new window.CanvasLoader(id);
            animator.setShape(options.shape);
            animator.setColor(options.color);
            animator.setDiameter(options.diameter);
            animator.setDensity(options.density);
            animator.setRange(options.range);
            animator.setSpeed(options.speed);
            animator.setFPS(options.fps);
            animator.show();

            overlay.find('> div').css({
                marginLeft: options.diameter / -2,
                marginTop: options.diameter / -2
            });

            /**
             * Stop canvas loader by event
             */
            capsule.one('stop.canvasLoader', function () {
                animator.kill();
                overlay.remove();
                capsule.css({position: position});
            });
        });

        /**
         * Reinitialize canvas loader by event
         */
        this.on('start.canvasLoader', function () {
            $(collection).canvasLoader(options);
        });

        /**
         * Switching canvas loader on or off
         * @param {boolean} on
         * @returns {jQuery}
         */
        this.canvasLoader = function (on) {
            return collection.trigger((on ? 'start' : 'stop') + '.canvasLoader');
        };

        /**
         * Make options available for manipulations
         * @type {Object}
         */
        this.canvasLoader.options = options;

        return this;
    };

    /**
     * Modules default options
     * @type {Object}
     */
    $.fn.canvasLoader.options = {
        shape: 'spiral',
        color: '#000',
        diameter: 70,
        density: 70,
        range: 0.7,
        speed: 2,
        fps: 24
    };

    /**
     * Version of the canvas loader module
     * @type {string}
     */
    $.fn.canvasLoader.version = '{{version}}';

})(jQuery);