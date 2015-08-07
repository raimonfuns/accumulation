define(function (require, exports, module) {
    var $ = require('jquery');

    function Slider(config) {
        this.cfg = {
            element: '#slider',
            trigger: '.tab li',
            panels: '.content li',
            next: '.next',
            prev: '.prev',
            triggerType: 'click',
            delay: 0,
            autoPlay: false,
            interval: 2000,
            activeTriggerClass: 'active',
            effect: 'left',
            loop: false,
            duration: 500,
            easing: 'easeInOutQuint'
        };
        $.extend(this.cfg, config);
        this.renderUI();
        this.bindUI();
        this.syncUI();
    }

    Slider.prototype = {
        constructor: Slider,
        renderUI: function () {
            this.slider = $(this.cfg.element);
            this.width = this.slider.width();
            this.contentItems = this.slider.find(this.cfg.panels);
            this.contentBox = this.contentItems.eq(0).parent();
            this.length = this.contentItems.length;
            this.tabItems = this.slider.find(this.cfg.trigger);
            this.next = this.slider.find(this.cfg.next);
            this.prev = this.slider.find(this.cfg.prev);
            this.index = 0;
        },
        bindUI: function () {
            var that = this;
            // 动画duration
            jQuery.fx.speeds['duration'] = this.cfg.duration;
            // 上一页
            this.slider.delegate(this.cfg.next, 'click', function () {
                that.doNext();
            });
            // 下一页
            this.slider.delegate(this.cfg.prev, 'click', function () {
                that.doPrev();
            });
            // tab switch
            if (this.cfg.triggerType === 'hover') { // hover
                this.tabItems['hover'](function () {
                    var $this = $(this),
                        timer = setTimeout(function () {
                        that.go($this.index());
                    }, that.cfg.delay);
                    $this.data('timer', timer);
                }, function () {
                    var $this = $(this);
                    clearTimeout($this.data('timer'));
                    $this.removeData('timer');
                });
            } else { // click
                this.tabItems.on(this.cfg.triggerType, function () {
                    var $this = $(this);
                    setTimeout(function () {
                        that.go($this.index());
                    }, that.cfg.delay);
                });
            }
            // autoPlay
            if (this.cfg.autoPlay) {
                this.autoPlay();
                this.slider.hover(function () {
                    var $this = $(this);
                    clearInterval($this.data('autoPlayTimer'));
                }, function () {
                    that.autoPlay();
                });
            } 
        },
        syncUI: function () {
            this.contentBox.width(this.width * this.contentItems.length); // 设置content的宽度
            this.cfg.effect == 'left' ? this.contentItems.css('float', 'left') : null;
        },
        go: function (index) {
            this.index = index >= this.length ? 0 : index < 0 ? this.length - 1 : index; 
                if (this.cfg.loop && index >= this.length) {
                    var that = this,   
                        $contentFirstItem = this.contentItems.eq(0);
                    this.contentBox.css(this.cfg.effect, -this.width * (index - 2));
                    $contentFirstItem.css(this.cfg.effect, that.width * (that.length - 1)).css('position', 'absolute');
                    this.contentBox.stop().animate({left: -this.width * (index - 1)}, {
                        duration: 'duration',
                        easing: this.cfg.easing,
                        complete: function () {
                            $contentFirstItem.removeAttr('style').css({'float': 'left'});
                            that.contentBox.css(that.cfg.effect, 0);
                        }
                    });
                } else if (this.cfg.loop && index < 0) {
                    var that = this,   
                        $contentLastItem = this.contentItems.last();
                    $contentLastItem.css(this.cfg.effect, -this.width).css('position', 'absolute');
                    this.contentBox.stop().animate({left: this.width}, {
                        duration: 'duration',
                        easing: this.cfg.easing,
                        complete: function () {
                            $contentFirstItem.removeAttr('style').css({'float': 'left'});
                            that.contentBox.css(that.cfg.effect, -that.width * (that.length - 1));
                        }
                    });
                } else if (this.cfg.effect == 'fade') {
                   this.contentItems.hide().eq(this.index).fadeIn('duration');     
                } else {
                    this.contentBox.stop().animate({left: -this.width * this.index}, {duration: 'duration', easing: this.cfg.easing});
                } 
            this.tabItems.removeClass(this.cfg.activeTriggerClass).eq(this.index).addClass(this.cfg.activeTriggerClass);
        }, 
        checkValid: function (index) {
            return  index >= this.length ? 0 : index < 0 ? this.length - 1 : index;
        },
        doNext: function () {
            this.go(this.index + 1);
        },
        doPrev: function () {
            this.go(this.index - 1);
        },
        autoPlay: function () {
            var that = this;
            this.slider.data('autoPlayTimer', setInterval(that.doNext.bind(that), this.cfg.interval)); 
        }
    };

    exports.Slider = Slider;
});