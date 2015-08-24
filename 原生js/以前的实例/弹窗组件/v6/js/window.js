define(['jquery'], function ($) {
    function Window() {
        this.config = {
            width: 300,
            height: 150,
            content: "",
            handle: null
        }
    }

    Window.prototype = {
        alert: function (config) {
            var CONFIG = $.extend(this.config, config);
            var boundingBox = $('<div class="window_boundingBox"></div>');
            boundingBox.appendTo('body');
            boundingBox.html(CONFIG.content);
            var btn = $('<input type="button" value="确定">');
            btn.appendTo(boundingBox);
            btn.click(function () {
                CONFIG.handle && CONFIG.handle();
                boundingBox.remove();
            });
            boundingBox.css({
                width: this.config.width + "px",
                height: this.config.height + "px",
                left: (this.config.x || ($(window).width() - this.config.width) / 2) + "px",
                top: (this.config.y || ($(window).height() - this.config.height) / 2) + "px"
            });
        },
        confirm: function () {

        },
        prompt: function () {

        }
    }

    return {
        Window: Window
    }
});