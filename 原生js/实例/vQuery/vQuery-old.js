function log(message) {
    console.log(message);
}
function addEvent(element, type, fn) {
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
}
function getByClass(parent, className) {
    var elements = parent.getElementsByTagName('*');
    var ret = [];
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].className === className) {
            ret.push(elements[i]);
        }
    }
    return ret;
}
function appendArr(arr1, arr2) {
    var i = 0;
    for (i = 0; i < arr2.length; i++) {
        arr1.push(arr2[i]);
    }
    return arr1;
}
function getIndex(element) {
    var aBrother = element.parentNode.children;
    var i = 0;
    for (i = 0; i < aBrother.length; i++) {
        if (aBrother[i] === element) {
            return i;
        }
    }
}
function style(oElement, attr, value) {
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
}
function doMove(oElement, oAttr, fnCallback) {
    clearInterval(oElement.timer);
    oElement.timer = setInterval(function () {
        var bStop = true;
        for (var property in oAttr) {
            var iCur = parseFloat(style(oElement, property));
            if (property === 'opacity') {
                iCur = parseInt(iCur.toFixed(2) * 100);
            }
            var iSpeed = (oAttr[property] - iCur) / 6;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

            if (iCur != oAttr[property]) {
                bStop = false;
                style(oElement, property, iCur + iSpeed);
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

function vQuery(vArg) {
    this.elements = [];

    switch(typeof vArg) {
        case 'function': addEvent(window, 'load', vArg);
            break;
        case 'string':
            switch(vArg.charAt(0)) {
                case '#': // id
                    this.elements.push(document.getElementById(vArg.substring(1)));
                    break;
                case '.': // clss
                    this.elements = getByClass(document, vArg.substring(1));
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
vQuery.prototype = {

    constructor: vQuery,

    click: function (fn) {
        var i = 0;
        for (i = 0; i < this.elements.length; i++) {
            addEvent(this.elements[i], 'click', fn);
        }
        return this;
    },
    show: function () {
        var i = 0;
        for (i = 0; i < this.elements.length; i++) {
            this.elements[i].style.display = 'block';
        }
        return this;
    },
    hide: function () {
        var i = 0;
        for (i = 0; i < this.elements.length; i++) {
            this.elements[i].style.display = 'none';
        }
        return this;
    },
    hover: function (fnOver, fnOut) {
        var i = 0;
        for (i = 0; i < this.elements.length; i++) {
            addEvent(this.elements[i], 'mouseover', fnOver);
            addEvent(this.elements[i], 'mouseout', fnOut);
        }
        return this;
    },
    css: function (attr, value) {
        var oFirstElement = this.elements[0];
        if (arguments.length === 2) {
            var i = 0;
            for (i = 0; i < this.elements.length; i++) {
                style(this.elements[i], attr, value);
            }
        } else {
            if (typeof attr === 'string') {
                return oFirstElement.currentStyle ? oFirstElement.currentStyle[attr] : getComputedStyle(oFirstElement, false)[attr];
            } else {
                for (i = 0; i < this.elements.length; i++) {
                    var key = '';
                    for (key in attr) {
                        style(this.elements[i], key, attr[key]);
                    }
                }
            }
        }
        return this;
    },
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
    toggle: function () {
        var _arguments = arguments;
        var i
        for (i = 0; i < this.elements.length; i++) {
            (function (obj) {
                var count = 0;
                addEvent(obj, 'click', function () {
                   _arguments[count++%_arguments.length]();
                });
            })(this.elements[i]);
        }
        return this;
    },
    eq: function (n) {
        return $(this.elements[n]);
    },
    find: function (str) {
        var ret = [];
        var i = 0;
        for (i = 0; i< this.elements.length; i++) {
            switch(str.charAt(0)) {
                case '.': 
                    ret = ret.concat(getByClass(this.elements[i], str.substring(1)));
                    break;
                default: 
                    appendArr(ret, this.elements[i].getElementsByTagName(str));
            }
        }
        var newVQuery = $();
        newVQuery.elements = ret;
        return newVQuery;
    },
    index: function () {
        return getIndex(this.elements[0]);
    },
    bind: function (sEv, fn) {
        var i = 0;
        for (i = 0; i < this.elements.length; i++) {
            addEvent(this.elements[i], sEv, fn);
        }
    },
    extend: function (name, fn) {
        vQuery.prototype[name] = fn;
    },
    animate: function (oAttr) {
        var i = 0;
        for (i = 0; i < this.elements.length; i++) {
            doMove(this.elements[i], oAttr);
        }
    }
}

function $(vArg) {
    return new vQuery(vArg);
}

