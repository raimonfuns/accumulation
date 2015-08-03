define(['widget', 'jquery', 'jqueryUI'], function (widget, $, $UI) {
    function Window() {
        this.config = {
            width: 300,
            height: 150,
            title: "系统消息",
            content: "",
            text4AlertBtn: "确定",
            text4ConfirmBtn: "确定",
            text4CancelBtn: "取消",
            hasCloseBtn: false,
            hasMask : true,
            isDraggable: true,
            dragHandle: null,
            skinClassName: null,
            handler4AlertBtn: null,
            handler4CloseBtn: null,
            handler4ConfirmBtn: null,
            handler4CancelBtn: null,
            text4PromptBtn: "确定",
            isPromptInputPassword: false,
            defaultValue4PromptInput: "",
            maxlength4PromptInput: 10,
            handler4PromptBtn: null
        };
        this.handlers = {};
    }

    Window.prototype = $.extend({}, new widget.Widget(), {
        renderUI: function () {
            var footerContent = "";
            switch(this.config.winType) {
                case "alert": footerContent = '<input type="button" value="' + this.config.text4AlertBtn + '" class="window_alertBtn">';
                    break;
                case "confirm": footerContent = '<input type="button" value="' + this.config.text4ConfirmBtn + '" class="window_confirmBtn"><input type="button" value="' + this.config.text4CancelBtn + '" class="window_cancelBtn">';
                    break;  
                case "prompt":
                        this.config.content += '<p class="window_promptInputWrapper"><input type="' + (this.config.isPromptInputPassword ? "password" : "text") + '" value="' + this.config.defaultValue4PromptInput + '" maxlength="' + this.config.maxlength4PromptInput + '" class="window_promptInput"></p>';
                        footerContent = '<input type="button" value="' + this.config.text4PromptBtn + '" class="window_promptBtn"><input type="button" value="' + this.config.text4CancelBtn + '" class="window_cancelBtn">';
                        break;
            }
            this.boundingBox = $(
                '<div class="window_boundingBox">' + 
                    '<div class="window_header">' + this.config.title + '</div>' +
                    '<div class="window_body">' + this.config.content + '</div>' +
                    '<div class="window_footer">' + footerContent + '</div>' + 
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
            this._promptInput = this.boundingBox.find(".window_promptInput");
        },
        bindUI: function () {
            var that = this;
            this.boundingBox.delegate('.window_alertBtn', 'click', function() {
                that.fire("alert");
                that.destroy();
            }).delegate('.window_closeBtn', 'click', function() {
                that.fire("close");
                that.destroy();
            }).delegate('.window_confirmBtn', 'click', function() {
                that.fire("comfirm");
                that.destroy();
            }).delegate('.window_cancelBtn', 'click', function() {
                that.fire("cancel");
                that.destroy();
            }).delegate('.window_promptBtn', 'click', function() {
                that.fire("prompt", that._promptInput.val());
                that.destroy();
            });
            if (this.config.handler4AlertBtn) {
                this.on("alert", this.config.handler4AlertBtn);
            }
            if (this.config.handler4CloseBtn) {
                this.on("close", this.config.handler4CloseBtn);
            }
            if (this.config.handler4ConfirmBtn) {
                this.on("alert", this.config.handler4ConfirmBtn);
            }
            if (this.config.handler4CancelBtn) {
                this.on("close", this.config.handler4CancelBtn);
            }
            if (this.config.handler4PromptBtn) {
                this.on("prompt", this.config.handler4PromptBtn);
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
            $.extend(this.config, config, {winType: "alert"});
            this.render();
            return this;
        },
        confirm: function (config) {
            $.extend(this.config, config, {winType: "confirm"});
            this.render();
            return this;
        },
        prompt: function (config) {
            $.extend(this.config, config, {winType: "prompt"});
            this.render();
            this._promptInput.focus();
            return this;
        }
    });

    return {
        Window: Window
    }
});