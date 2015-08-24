define(['jquery'], function ($) {
    function Window() {
        this.config = {
            width: 300,
            height: 150,
            y: 50
        }
    }

    Window.prototype = {
        alert: function (content, handle, config) {
            var boundingBox = $('<div class="window_boundingBox"></div>');
            boundingBox.appendTo('body');
            boundingBox.html(content);
            var btn = $('<input type="button" value="确定">');
            btn.appendTo(boundingBox);
            btn.click(function () {
                handle && handle();
                boundingBox.remove();
            });
            $.extend(this.config, config);
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