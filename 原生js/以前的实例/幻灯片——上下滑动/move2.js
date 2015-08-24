function getStyle(obj, name) {
    if (obj.currentStyle) {
        return obj.currentStyle[name];
    }
    else
    {
        return getComputedStyle(obj, false)[name];
    }
}

function startMove(obj, options, callback) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var stopFlag = true;

        for (var attr in options) {
            var cur = 0;
        
            if (attr === 'opacity') {
                cur = Math.round(parseFloat(getStyle(obj, attr))*100);
            } else {
                cur = parseInt(getStyle(obj, attr));
            }
            
            var speed = (options[attr]-cur)/6;
            speed = speed>0 ? Math.ceil(speed) : Math.floor(speed);
            
            if (cur != options[attr]) {
                stopFlag = false;
            }
            
            if (attr === 'opacity') {
                obj.style.filter = 'alpha(opacity:'+(cur+speed)+')';
                obj.style.opacity = (cur+speed)/100;
            } else {
                obj.style[attr] = cur+speed+'px';
            }
        }

        if (stopFlag) {
            clearInterval(obj.timer);

            if(callback) {
                callback();
            }
        }
    }, 30);
}