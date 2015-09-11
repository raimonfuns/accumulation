define(function(require, exports, module){
	//var $ = require('../lib/jquery.min.js');
    function slide(obj){
		var opt={
			slideId:'',
            sign:'curr',
			step:1,
			autoPlay:true,
			speed:500,
			playTime:3000
		};
        $.extend(true,opt,obj);
		var getSlide=$(opt.slideId),
			getList=getSlide.children('.slide-list')||getSlide.children(':first'),
			getBtn=getSlide.children('.slide-btn')||getSlide.children(':last'),
			getLiTag=getList.children(),
            getBtnTag=getBtn.children(),
			liWidth = getLiTag.outerWidth(true),
			liLength = getLiTag.length;
            getList.width(liWidth * liLength),
            moveSize = liWidth * opt.step,
            p=0,autoPlay=null,delay=null,delayTime=200;

        function movePosition(p) {
            getList.animate({marginLeft: -p*moveSize}, opt.speed);
            if (getBtnTag) {
                getBtnTag.removeClass(opt.sign);
                getBtnTag.eq(p).addClass(opt.sign);
            };
        }

        function cyclePlay(){
            p++;
            if (p>liLength-1) p=0;
            movePosition(p);
        }

        if (opt.autoPlay) {
            autoPlay = setInterval(cyclePlay, opt.playTime);
        };

        getBtnTag.hover(function(){
            var _this=$(this);
            if (delay) clearTimeout(delay);
            delay=setTimeout(function(){
                if (opt.autoPlay) clearInterval(autoPlay);
                p=_this.index();
                movePosition(p);
            },delayTime);
        },function(){
            if (delay) clearTimeout(delay);
            delay=setTimeout(function(){
                if (opt.autoPlay) {
                    clearInterval(autoPlay);
                    autoPlay = setInterval(cyclePlay, opt.playTime);
                }
            },delayTime);
        });
	}
    module.exports=slide;
});