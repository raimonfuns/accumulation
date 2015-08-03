define(['jquery'], function ($) {
    function Window() {
        this.config = {
            width: 300,
            height: 150,
            title: "系统消息",
            content: "",
            hasCloseBtn: false,
            handle4AlertBtn: null,
            handle4CloseBtn: null
        }
    }

    Window.prototype = {
        alert: function (config) {
            var CONFIG = $.extend(this.config, config),
                boundingBox = $(
                    '<div class="window_boundingBox">' + 
                        '<div class="window_header">' + CONFIG.title + '</div>' +
                        '<div class="window_body">' + CONFIG.content + '</div>' +
                        '<div class="window_footer"><input class="window_alertBtn" type="button" value="确定"></div>' + 
                    '</div>'
                ),
                btn = boundingBox.find('.window_alertBtn');
            boundingBox.appendTo('body');
            btn.click(function () {
                CONFIG.handle4AlertBtn && CONFIG.handle4AlertBtn();
                boundingBox.remove();
            });
            boundingBox.css({
                width: this.config.width + "px",
                height: this.config.height + "px",
                left: (this.config.x || ($(window).width() - this.config.width) / 2) + "px",
                top: (this.config.y || ($(window).height() - this.config.height) / 2) + "px"
            });
            if (CONFIG.hasCloseBtn) {
                var closeBtn = $('<span class="window_closeBtn">X</span>');
                closeBtn.appendTo(boundingBox);
                closeBtn.click(function () {
                    CONFIG.handle4CloseBtn && CONFIG.handle4CloseBtn();
                    boundingBox.remove();
                });
            }
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