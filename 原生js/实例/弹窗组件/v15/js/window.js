define(['widget', 'jquery', 'jqueryUI'], function (widget, $, $UI) {
    function Window() {
        this.config = {
            width: 300,
            height: 150,
            title: "系统消息",
            content: "",
            text4AlertBtn: "确定",
            hasCloseBtn: false,
            hasMask : true,
            isDraggable: true,
            dragHandle: null,
            skinClassName: null,
            handler4AlertBtn: null,
            handler4CloseBtn: null
        };
        this.handlers = {};
    }

    Window.prototype = $.extend({}, new widget.Widget(), {
        renderUI: function () {
            this.boundingBox = $(
                '<div class="window_boundingBox">' + 
                    '<div class="window_header">' + this.config.title + '</div>' +
                    '<div class="window_body">' + this.config.content + '</div>' +
                    '<div class="window_footer"><input class="window_alertBtn" type="button" value="' + this.config.text4AlertBtn + '"></div>' + 
                '</div>'
            );
            if (this.config.hasMask) {
                this._mask = $('<div class="window_mask"></div>');
                this._mask.appendTo('body');
            }
            if (this.config.hasCloseBtn) {
                this.boundingBox.append('<span class="window_closeBtn">X</span>');
            }
            this.boundingBox.appendTo('body');
        },
        bindUI: function () {
            var that = this;
            this.boundingBox.delegate('.window_alertBtn', 'click', function() {
                that.fire("alert");
                that.destroy();
            }).delegate('.window_closeBtn', 'click', function() {
                that.fire("close");
                that.destroy();
            });
            if (this.config.handler4AlertBtn) {
                this.on("alert", this.config.handler4AlertBtn);
            }
            if (this.config.handler4CloseBtn) {
                this.on("close", this.config.handler4CloseBtn);
            }
        },
        syncUI: function () {
            this.boundingBox.css({
                width: this.config.width + "px",
                height: this.config.height + "px",
                left: (this.config.x || ($(window).width() - this.config.width) / 2) + "px",
                top: (this.config.y || ($(window).height() - this.config.height) / 2) + "px"
            });
            if (this.config.skinClassName) {
                this.boundingBox.addClass(this.config.skinClassName);
            }
            if (this.config.isDraggable) {
                if (this.config.dragHandle) {
                    this.boundingBox.draggable({handle: this.config.dragHandle});
                } else {
                    this.boundingBox.draggable();
                }
            }
        },
        destructor: function () {
            this._mask && this._mask.remove();
        },
        alert: function (config) {
            $.extend(this.config, config);
            this.render();
            return this;
        },
        confirm: function () {

        },
        prompt: function () {

        }
    });

    return {
        Window: Window
    }
});