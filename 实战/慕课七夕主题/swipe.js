/////////
//页面滑动
/////////

/**
 * [Swipe description]
 * @param { HTMLelement } container [页面容器节点]
 * @param { object } options [参数]
 */
function Swipe(container) {
    // 获取第一个子节点
    var element = container.find(':first');

    // 滑动对象
    var swipe = {};

    // 所有li
    var slides = element.find(">");
    
    // 获取容器尺寸
    var width = container.width();
    var height = container.height();

    // 设置li页面总宽度
    element.css({
        width: (slides.length * width) + 'px',
        height: height + 'px'
    });

    // 设置每一个页面li的宽度
    $.each(slides, function (index) {
        var slide = slides.eq(index);
        slide.css({
            width: width + 'px',
            height: height + 'px'
        });
    });

    /**
     * 监控完成移动
     * @param { number } x [移动距离]
     * @param { number } speed [移动速度]
     */
    swipe.scrollTo = function (x, speed) {
        // 执行动画移动
        element.css({
            'transition-timing-function': 'linear',
            'transition-duration'       : speed + 'ms',
            'transform'                 : 'translate3d(-' + x + 'px, 0px, 0px)'
        });
        return this;
    }
    return swipe;
}