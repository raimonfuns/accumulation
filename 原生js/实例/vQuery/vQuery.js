var vQuery = function (vArg) {
    return new vQuery.fn.init(vArg);
}

vQuery.fn = vQuery.prototype = {
    
    constructor: vQuery,

    // 初始化，简单选择器
    init: function (vArg) {
        this.elements = [];

        switch(typeof vArg) {
            case 'function': vQuery.addEvent(window, 'load', vArg);
                break;
            case 'string':
                switch(vArg.charAt(0)) {
                    case '#': // id
                        this.elements.push(document.getElementById(vArg.substring(1)));
                        break;
                    case '.': // clss
                        this.elements = vQuery.getByClass(document, vArg.substring(1));
                        break;
                    default: // tagName
                        this.elements = document.getElementsByTagName(vArg);
                        break;
                }
                break;
            case 'object': 
                this.elements.push(vArg);
                break;
        }
    }
    
}

// 拓展方法
vQuery.extend = vQuery.fn.extend = function () {
    var arg = arguments;
    var length = arg.length;
    if (length === 1 && typeof arg[0] === 'object') {
        for (var name in arg[0]) {
            this[name] = arg[0][name];
        }
    } else if (length === 2) {
        this[arg[0]] = arg[1];
    }
}

// 给vQuery拓展方法
vQuery.extend({
    // 检测类型
    type: function (item) {
        return Object.prototype.toString.call(item).slice(8, -1).toLowerCase();
    },
    // 绑定事件
    addEvent: function (element, type, fn) {
        if (element.addEventListener) {
            element.addEventListener(type, function (ev) {
                if (fn.call(element) === false) {
                    ev.stopPropagation();
                    ev.preventDefault();
                }
            }, false);  
        } else {
            element.attachEvent('on' + type, function () {
                if (fn.call(element) === false) {
                    event.cancelBubble = true;
                    return false;
                }
            });
        }
    },
    // 通过class选择
    getByClass: function (str, root, tag) {
        if(root){
            root = typeof root == "string" ? document.getElementById(root) : root;
        } else {
            root = document.body;
        }
        tag = tag || "*";
        var els = root.getElementsByTagName(tag),arr = [];
        for(var i = 0,n = els.length; i < n; i++){
            for(var j = 0,k = els[i].className.split(" "), l = k.length; j < l; j++){
                if(k[j] == str){
                    arr.push(els[i]);
                    break;
                }
            }
        }
        return arr;
    },
    // 合并数组
    appendArr: function (arr1, arr2) {
        var i = 0;
        for (i = 0; i < arr2.length; i++) {
            arr1.push(arr2[i]);
        }
        return arr1;
    },
    // 获得元素在其同辈元素的位置
    getIndex: function (oElement) {
        var aBrother = oElement.parentNode.children;
        var i = 0;
        for (i = 0; i < aBrother.length; i++) {
            if (aBrother[i] === oElement) {
                return i;
            }
        }
    },
    // 操作style
    style: function (oElement, attr, value) {
        if (arguments.length === 2) {
            return oElement.currentStyle ? oElement.currentStyle[attr] : getComputedStyle(oElement, false)[attr];
        } else if (arguments.length === 3) {
            switch(attr) {
                case 'width':
                case 'height':
                case 'top':
                case 'left':
                case 'right':
                case 'bottom':
                    oElement.style[attr] = value + 'px';
                    break;
                case 'opacity':
                    oElement.style.filter = 'alpha(opacity:' + value + ')';
                    oElement.style.opacity = value / 100;
                    break;
                default:
                    oElement.style[attr] = value;
                    break;
            }
        }
    },
    // 运动
    doMove: function (oElement, oAttr, fnCallback) {
        clearInterval(oElement.timer);
        oElement.timer = setInterval(function () {
            var bStop = true;
            for (var property in oAttr) {
                var iCur = parseFloat(vQuery.style(oElement, property));
                if (property === 'opacity') {
                    iCur = parseInt(iCur.toFixed(2) * 100);
                }
                var iSpeed = (oAttr[property] - iCur) / 6;
                iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

                if (iCur != oAttr[property]) {
                    bStop = false;
                    vQuery.style(oElement, property, iCur + iSpeed);
                } 
            }
            if (bStop) {
                clearInterval(oElement.timer);
                if (fnCallback) {
                    fnCallback.apply(this, arguments); 
                }   
            }
        }, 30);
    }
});

// 给vQuery.fn拓展方法
vQuery.fn.extend({
    // 点击
    click: function (fn) {
        var i = 0;
        for (i = 0; i < this.elements.length; i++) {
            vQuery.addEvent(this.elements[i], 'click', fn);
        }
        return this;
    },
    // 显示
    show: function () {
        var i = 0;
        for (i = 0; i < this.elements.length; i++) {
            this.elements[i].style.display = 'block';
        }
        return this;
    },
    // 隐藏
    hide: function () {
        var i = 0;
        for (i = 0; i < this.elements.length; i++) {
            this.elements[i].style.display = 'none';
        }
        return this;
    },
    // 鼠标hover
    hover: function (fnOver, fnOut) {
        var i = 0;
        for (i = 0; i < this.elements.length; i++) {
            vQuery.addEvent(this.elements[i], 'mouseover', fnOver);
            vQuery.addEvent(this.elements[i], 'mouseout', fnOut);
        }
        return this;
    },
    // 操作css
    css: function (attr, value) {
        var oFirstElement = this.elements[0];
        if (arguments.length === 2) {
            var i = 0;
            for (i = 0; i < this.elements.length; i++) {
                vQuery.style(this.elements[i], attr, value);
            }
        } else {
            if (vQuery.type(attr) === 'string') {
                return oFirstElement.currentStyle ? oFirstElement.currentStyle[attr] : getComputedStyle(oFirstElement, false)[attr];
            } else {
                for (i = 0; i < this.elements.length; i++) {
                    var key = '';
                    for (key in attr) {
                        vQuery.style(this.elements[i], key, attr[key]);
                    }
                }
            }
        }
        return this;
    },
    // 操作属性
    attr: function (attr, value) {
        if (arguments.length === 1) {
            return this.elements[0][attr];
        } else if (arguments.length === 2) {
            var i = 0;
            for (i = 0; i < this.elements.length; i++) {
                this.elements[i][attr] = value;
            }
        }
        return this;
    },
    // 事件切换 
    toggle: function () {
        var _arguments = arguments;
        var i
        for (i = 0; i < this.elements.length; i++) {
            (function (obj) {
                var count = 0;
                vQuery.addEvent(obj, 'click', function () {
                   _arguments[count++%_arguments.length]();
                });
            })(this.elements[i]);
        }
        return this;
    },
    // 按index选择元素
    eq: function (n) {
        return $(this.elements[n]);
    },
    // 查找元素
    find: function (str) {
        var ret = [];
        var i = 0;
        for (i = 0; i< this.elements.length; i++) {
            switch(str.charAt(0)) {
                case '.': 
                    ret = ret.concat(vQuery.getByClass(this.elements[i], str.substring(1)));
                    break;
                default: 
                    vQuery.appendArr(ret, this.elements[i].getElementsByTagName(str));
            }
        }
        var newVQuery = $();
        newVQuery.elements = ret;
        return newVQuery;
    },
    // 元素位置
    index: function () {
        return vQuery.getIndex(this.elements[0]);
    },
    // 绑定事件
    bind: function (sEv, fn) {
        var i = 0;
        for (i = 0; i < this.elements.length; i++) {
            vQuery.addEvent(this.elements[i], sEv, fn);
        }
    },
    // 动画
    animate: function (oAttr) {
        var i = 0;
        for (i = 0; i < this.elements.length; i++) {
            vQuery.doMove(this.elements[i], oAttr);
        }
    }
});

vQuery.fn.init.prototype = vQuery.fn;
window.$ = vQuery;