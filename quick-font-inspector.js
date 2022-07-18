// ==UserScript==
// @name         Quick Font Inspector
// @version      1.0.0
// @description  Press F + S and click on any element to get style info
// @author       Marshall
// @match        *://*/*
// @grant        none
// @run-at       document-body
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('DOMContentLoaded', function() {

        if(typeof jQuery=='undefined') {
            let headTag = document.getElementsByTagName('head')[0];
            let jqTag = document.createElement('script');
            jqTag.type = 'text/javascript';
            jqTag.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
            jqTag.onload = runFontSpec;
            headTag.appendChild(jqTag);
        } else {
             runFontSpec();
        }

        // Start using jquery from here on out because I'm lazy
        function runFontSpec() {

            (function($) {


                $.fn.fontSpecs = function(options) {

                    // Convert rgb to hexidecimal value
                    function rgbToHex(orig){
                        var rgb = orig.replace(/\s/g,'').match(/^rgba?\((\d+),(\d+),(\d+)/i);
                        return (rgb && rgb.length === 4) ? '#' +
                        ('0' + parseInt(rgb[1],10).toString(16)).slice(-2) +
                        ('0' + parseInt(rgb[2],10).toString(16)).slice(-2) +
                        ('0' + parseInt(rgb[3],10).toString(16)).slice(-2) : orig;
                    }

                    // Setting defaults
                    // var settings = $.extend({
                    //     'devSubDomain': ''
                    // }, options);



                    // Styles
                    var fontSpecStyles =
                        '<style>' +
                            '.font-spec {' +
                                'color: #666 !important;' +
                                'padding: 10px !important;' +
                                'font-size: 9px !important;' +
                                'position: absolute !important;' +
                                'max-width: 200px !important;' +
                                'min-width: 100px !important;' +
                                'background: #fff !important;' +
                                'z-index: 1000 !important;' +
                                'text-align: left !important;' +
                                'display: block !important;' +
                                'border-radius: 5px !important;' +
                                'box-shadow: 2px 2px 5px rgba(0, 0, 0, .25) !important;' +
                                'line-height: 1.2 !important;' +
                                'font-family: sans-serif !important;' +
                                'letter-spacing: 0 !important;' +
                            '}' +

                            '.font-spec__colors {' +
                                'margin-bottom: 4px !important;' +
                            '}' +

                            '.font-spec dt {' +
                                'text-transform: uppercase !important;' +
                                'font-weight: bold !important;' +
                                'margin-bottom: 0 !important;' +
                            '}' +

                            '.font-spec__colors + dd dl {' +
                                'padding-left: 6px !important;' +
                            '}' +

                            '.font-spec__colors + dd dt {' +
                                'text-transform: none !important;' +
                            '}' +

                            '.font-spec__color-box {' +
                                'display: inline-block !important;' +
                                'height: 9px !important;' +
                                'width: 9px !important;' +
                                'position: relative !important;' +
                                'top: 1px !important;' +
                                'border-radius: 3px !important;' +
                                'border: 1px solid #666 !important;' +
                            '}' +

                            '.font-spec dl {' +
                                'margin-bottom: 0 !important;' +
                            '}' +

                            '.font-spec dd {' +
                                'margin-bottom: 4px !important;' +
                            '}' +

                            '.font-spec dd:last-child {' +
                                'margin-bottom: 0 !important;' +
                            '}' +
                        '</style>';

                    // Stick styles in head
                    $(fontSpecStyles)
                        .appendTo('head');

                    var keys = {
                        sKey: false,
                        fKey: false,
                    };

                    // Track if F and S key is pressed
                    $(document).on('keydown', function(event) {
                        if (event.key.toLowerCase() === 's') {
                            keys.sKey = true;
                        }

                        if (event.key.toLowerCase() === 'f') {
                            keys.fKey = true;
                        }
                    });

                    $(document).on('keyup', function(event) {
                        if (event.key.toLowerCase() === 's') {
                            keys.sKey = false;
                        }

                        if (event.key.toLowerCase() === 'f') {
                            keys.fKey = false;
                        }
                    });

                    $(document).on('click', function(e) {
                        var eTarget = $(e.target);

                        if (eTarget.closest('.font-spec').length === 0) {
                            $('.font-spec').remove();
                        }

                        // If the F key is pressed render the goodies
                        if (keys.sKey && keys.fKey && eTarget.closest('.font-spec').length === 0) {

                            e.preventDefault();
                            e.stopPropagation();

                            var mouseX = e.pageX;
                            var mouseY = e.pageY;
                            var fontSize = eTarget.css('font-size');
                            var textColor = eTarget.css('color');
                            var fontWeight = eTarget.css('font-weight');
                            var fontStyle = eTarget.css('font-style');
                            var fontFamily = eTarget.css('font-family').split(',');
                            var fontFamilyFirst = fontFamily[0].replace(/"/g, "");

                            var fontSpecHTML =
                                '<div class="font-spec__info">' +
                                    '<dl>' +
                                        '<dt>Font Family:</dt>' +
                                        '<dd>' + fontFamilyFirst + '</dd>' +
                                        '<dt>Font Size:</dt>' +
                                        '<dd>' + fontSize + '</dd>' +
                                        '<dt>Font Weight:</dt>' +
                                        '<dd>' + fontWeight + '</dd>' +
                                        '<dt>Font Style:</dt>' +
                                        '<dd>' + fontStyle + '</dd>' +
                                        '<dt class="font-spec__colors">Color ' +
                                            '<span class="font-spec__color-box" style="background-color:' + textColor + '"></span>:' +
                                        '</dt>' +
                                        '<dd>' +
                                            '<dl>' +
                                                '<dt>Hex:</dt>' +
                                                '<dd>' + rgbToHex(textColor) + '</dd>' +
                                                '<dt>RGB:</dt>' +
                                                '<dd>' + textColor + '</dd>' +
                                        '</dl>' +
                                    '</dl>' +
                                '</div>';

                            // Render and display font spec dialog next to cursor
                            $('<div>')
                                .addClass('font-spec')
                                .css({
                                    'top': mouseY,
                                    'left': mouseX,
                                })
                                .html(fontSpecHTML)
                                .appendTo('body');
                        }
                    });

                };
                $.fn.fontSpecs();
            }(jQuery));
        }
	});
})();