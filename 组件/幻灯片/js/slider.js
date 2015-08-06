define(['widget', 'jquery'], function (widget, $, $UI) {
    function Slider() {
        this.cfg = {
            element: '#slider',
            trigger: '.tab li',
            next: 'next',
            prev: 'prev'
        };
        this.handlers = {};
    }

    function log(value) {
        console.log(value);
    }

    Slider.prototype = $.extend({}, new widget.Widget(), {
        renderUI: function () {
            this.slider = $(this.cfg.element);
            this.width = this.slider.width();
            this.contentBox = this.slider.find('.content');
            this.contentItems = this.slider.find('.content li');
            this.length = this.contentItems.length;
            this.tabItems = this.slider.find(this.cfg.trigger);
            this.next = this.slider.find(this.cfg.next);
            this.prev = this.slider.find(this.cfg.prev);
            this.index = 0;
        },
        bindUI: function () {
            var that = this;
            this.slider.delegate('.next', 'click', function () {
                that.go(that.index = that.checkValid(that.index + 1));
                console.log(that.index);
            });
            this.slider.delegate('.prev', 'click', function () {
                that.go(that.index = that.checkValid(that.index - 1));
                console.log(that.index);
            });
            this.tabItems.click(function () {
                that.go($(this).index());
            });
        },
        syncUI: function () {
            this.contentBox.width(this.width * this.contentItems.length); // 设置content的宽度
        },
        go: function (index) {
            this.contentBox.animate({left: -this.width * index});
        }, 
        checkValid: function (index) {
            return  index >= this.length ? this.length - 1 : index < 0 ? 0 : index;
        }
    });

    return {
        Slider: Slider
    }
});