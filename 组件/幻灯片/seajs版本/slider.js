define(function(require, exports, module) {
    var $ = require('jquery');
    require('jquery.easing');

    // $.fn.slider = function (config) {
    //     config = config || {};
    //     config.element = this;
    //     new Slider(config);
    // }

    function Slider(config) {
        this.cfg = {
            element: '#slider1',
            trigger: '.tab li',
            panels: '.content li',
            next: '.next',
            prev: '.prev',
            triggerType: 'click',
            delay: 0,
            autoPlay: true,
            interval: 3000,
            activeTriggerClass: 'active',
            effect: 'left',
            loop: false,
            duration: 500,
            easing: 'linear'
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
            $.fx.speeds['duration'] = this.cfg.duration;
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
            // 修复IE8不支持bind
            if(!('bind' in Function.prototype)) {
                Function.prototype.bind = function() {
                    var fnToBind = this;
                    var context = arguments[0];
                    var args = Array.prototype.slice.call(arguments, 1);
                    return function() {
                        fnToBind.apply(context, args);
                    }
                }
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
            this.contentBox.css({width: this.width * this.contentItems.length, position: 'absolute'}); // 设置content的宽度
            this.cfg.effect == 'left' ? this.contentItems.css('float', 'left') : null;
            if (this.cfg.effect == 'fade') {
                this.contentItems.css({position: 'absolute', zIndex: -1}).hide().eq(0).css('zIndex', 0).stop().fadeIn(0);
            }
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
                    this.contentItems.filter(function () {
                        return $(this).css('display') == 'list-item';
                    }).css('zIndex', -1).stop().fadeOut('duration');
                    this.contentItems.eq(this.index).css('zIndex', 0).stop().fadeIn({duration: 'duration', queue: false});     
                         
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