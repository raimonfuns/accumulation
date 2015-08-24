function log(value) {
	console.log(value);
}

function type(item) {
    return Object.prototype.toString.call(item).slice(8,-1).toLowerCase();
}

// 判断arr是否为一个数组，返回一个bool值
// Array.isArray方法不支持ie9以下
function isArray(arr) {
    var str = Object.prototype.toString.call(arr).slice(8,-1).toLowerCase();
    if (str == "array") { return true; }
    else { return false; }
}

// 判断fn是否为一个函数，返回一个bool值
function isFunction(fn) {
    return typeof fn === 'function';
}

function isEmpty(s) {
    return /^\s*$/.test(s);
}

// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象可以是对象或数组
function cloneObject(src) {
	// 
	if ( typeof src !== 'object' || 
		 typeof src === 'function' || 
		 typeof src === 'date' || 
		 src instanceof Date ||
		 src === null) {
		return src;
	}

	// Array
	if (isArray(src)) {
		var newArray = [];
		for (var i = 0; i < src.length; i++) {
			newArray[i] = arguments.callee(src[i]);
		}
		return newArray;
	}

	var myNewObj = new Object();
	for (var i in src) {
		if (src.hasOwnProperty(i)) {
			myNewObj[i] = arguments.callee(src[i]);
		}
	}
	return myNewObj;
}


// 数组去重
// ie6-ie8不支持indexOf
// function uniqArray(arr) {
// 	if (!isArray(arr)) {
// 		log("error! input must be an array.");
// 		return false;
// 	}
// 	var newArr = [];
// 	for (var i in arr) {
// 		if (newArr.indexOf(arr[i]) === -1) {
// 			newArr.push(arr[i]);
// 		} 
// 	}
// 	return newArr;
// }

function uniqArray(arr) {
	if (!isArray(arr)) { return false; }
	var obj = {};
	var newArr = [];
	for (var i in arr) {
		if (!obj[arr[i]]) {
			obj[arr[i]] = arr[i];
			newArr.push(arr[i]);
		} 
	}
	obj = null;
	return newArr;
}

// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
// 先暂时不要简单的用一句正则表达式来实现
// return str.replace(/^\s+|\s+$/g,'');
// ie7-ie6不能用[]访问下标，否则得到的全部是undefined，得用substring
function trim(str) {
	if (typeof str !== 'string') { return false; }
	var arr = [];
	for (var i = 0; i < str.length; i++) {
		var code = str.charCodeAt(i); // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码
		if (code === 32 || code === 12288 || code === 9) { //半角空格 32，全角空格 12288，tab 9
			arr[i] = "";
		} else {
			arr[i] = str.substring(i, i + 1);
		}
	}
	return arr.join("");
}

// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参赛传递
function each(arr, fn) {
	if (!isArray(arr) && !isArraylike(arr)) { return false; }
	if (typeof fn !== 'function') { return false; }
    for (var i = 0; i < arr.length; i++) {
    	fn(i, arr[i]);
    }
}

// 获取一个对象里面第一层元素的数量，返回一个整数
function getObjectLength(obj) {
	if (Object.keys) { //能力检测
		return Object.keys(obj).length;
	}
	var length = 0;
	for (var i in obj) {
		if (obj.hasOwnProperty(i)) {
			length ++;
		}
	}
	return length;
}

// 判断是否为邮箱地址
function isEmail(emailStr) {
    return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(emailStr);
}

// 判断是否为手机号
function isMobilePhone(phone) {
    return /^1[3|5|7|8|][0-9]{9}$/.test(phone);
}

// 获得element的所有className
function getClassNames(element) {
	if (!element) { return false; }
	return trim(element.className).replace(/\s+/g,' ').split(' ');
}

// 为element增加一个样式名为newClassName的新样式
// 不能最大响度重用，局限性很大，弃用
// function addClass(element, newClassName) {
// 	if (!element || !newClassName) { return false; }
//     element.className += (element.className ? ' ' : '') + newClassName;
// }

// 移除element中的样式oldClassName
// 不能最大响度重用，局限性很大，弃用
// function removeClass(element, oldClassName) {
// 	if (!element || !oldClassName) { return false; }
//     var classes = getClassNames(element);
// 	var length = classes.length;

// 	for (var i = 0; i < length; i++) {
// 		if (classes[i] === oldClassName) {
// 			classes.splice(i, 1);
// 		}
// 	}

// 为element增加一个样式名为newClassName的新样式
function addClass(element, className) {
    if (!new RegExp("(^|\\s+)" + className).test(element.className)) {
        element.className += (element.className.length ? " " : "") + className;
    }
}

// 移除element中的样式oldClassName
function removeClass(element, className) {
    element.className = element.className.replace(new RegExp("(^|\\s+)" + className), "");
}

// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode) {
    if (!element || !siblingNode) { return false; }
    if (element.parentNode === siblingNode.parentNode) { return true; }
    return false;
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
// 暂时不支持IE6-IE8
function getPosition(element) {
	var actualTop = element.offsetTop;
	var actualLeft = element.offsetLeft;
　　var current = element.offsetParent;
　　while (current !== null){
　　　　actualTop += current.offsetTop;
		actualLeft += current.offsetLeft;
　　　　current = current.offsetParent;
　　}
	if(document.body.scrollTop){
		var elementScrollTop = document.body.scrollTop;
		var elementScrollLeft = document.body.scrollLeft
	}else{
		var elementScrollTop = document.documentElement.scrollTop;
		var elementScrollLeft = document.documentElement.scrollLeft; 
	}
　　return {
		left: actualLeft - elementScrollLeft,
		top: actualTop - elementScrollTop
	}
}

// 可以通过id获取DOM对象，通过#标示
function $(selector) {
	if (!selector) { return false; }
	if (typeof selector !== 'string') { return selector; }
	var args = selector.split(' '),
		length = args.length,
		parent = length === 2 ? document.getElementById(args[0].substring(1)) : document;
	selector = length === 1 ? args[0] : args[1];
	
	if (length === 0) {
		return false;
	} else {
		// #id
		if (selector.charAt(0) === '#' && selector.length >= 2) {
			return document.getElementById(selector.substring(1));
		
		// .class
		} else if (selector.charAt(0) === '.' && selector.length >= 2) {
			 return getByClassName(selector.substring(1), parent)[0];
		
		// [data-log]
		} else if (selector.charAt(0) === '[' && selector.charAt( selector.length-1 ) === ']' && selector.length >= 3){
			var equalIndex = selector.indexOf('=');
			
			// [data-date=2015]
			if ( equalIndex !== -1) {
				return getElementByAttrValue(selector.substring(1, equalIndex), selector.substring(equalIndex + 1, selector.length-1));
			}
			return getElementByAttr(selector.substring(1, selector.length-1));
		
		// a
		} else if (/^[a-zA-Z]+$/.test(selector)) {
			return parent.getElementsByTagName(selector)[0];
		} else if (selector === document) {
			return document;
		}
	}
}

// 给一个element绑定一个针对event事件的响应，响应函数为listener
function addEvent(element, type, listener) {
	if (element.addEventListener) {
        element.addEventListener(type, listener, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + type, listener);
    } else {
        element['on' + type] = listener;
    }
}

// 移除element对象对于event事件发生时执行listener的响应
// 当listener为空时，移除所有响应函数 ???
function removeEvent(element, type, listener) {
    if (element.removeEventListener) {
        element.removeEventListener(type, listener, false);
    } else if (element.detachEvent) {
        element.detachEvent('on' + type, listener);
    } else {
        element['on' + type] = null;
    }
}

// 实现对click事件的绑定
function addClickEvent(element, listener) {
    addEvent(element, 'click', listener);
}

// 实现对于按Enter键时的事件绑定
function addEnterEvent(element, listener) {
    // $.on(element, 'keypress')
}

function delegateEvent(element, tag, eventName, listener) {
    addEvent(element, eventName, function (e) {
    	var target = getEventTarget(e);
    	if (target.tagName.toLowerCase() === tag.toLowerCase()) {
    		listener(e);
    	}
    });
}

function getEventTarget(e) {
	e = e || window.event;
	return e.target || e.srcElement;
}

// addEvent(element, event, listener) -> $.on(element, event, listener);
// 把上面几个函数和$做一下结合，把他们变成$对象的一些方法
$.on = addEvent;
$.un = removeEvent;
$.click = addClickEvent;
$.enter = addEnterEvent;
$.delegate = delegateEvent;

// 根据类名获取元素，可以传入父元素
function getByClassName(className, parentNode) {
	var oParent = parent ? parentNode : document;
	var eles = [];
	elements = oParent.getElementsByTagName('*');

	for (var i = 0; i < elements.length; i++) {
		if (elements[i].className === className) {
			eles.push(elements[i]);
		}
	}

	return eles;
}

// 根据类名获取元素，可以传入父元素id和标签类型
function getElementsByClassName(str, root, tag) {
    if (root) {
        root = typeof root == "string" ? document.getElementById(root) : root;
    } else {
        root = document.body;
    }
    tag = tag || "*";
    var eles = root.getElementsByTagName(tag),
        arr = [];
    for (var i = 0, n = eles.length; i < n; i++) {
        for (var j = 0, k = eles[i].className.split(" "), l = k.length; j < l; j++) {
            if (k[j] == str) {
                arr.push(eles[i]);
                break;
            }
        }
    }
    return arr;
}

function getElementByAttr(attr, parent) {
	var oParent = parent ? document.getElementById(parent) : document;
	var eles = [];
	elements = oParent.getElementsByTagName('*');

	for (var i = 0, len = elements.length; i < len; i++) {
		if (elements[i].hasAttribute(attr)) {
			return elements[i];
		}
	}
}

function getElementByAttrValue(attr, value, parent) {
	var oParent = parent ? document.getElementById(parent) : document;
	var eles = [];
	elements = oParent.getElementsByTagName('*');

	// IE7- 不支持hasAttribute，这是代替的方法
	if (!window.Element || !window.Element.prototype || !window.Element.prototype.hasAttribute) {

		// IE7- execute here
		(function (elements) {
		    function hasAttribute (attrName) {
		        return typeof this[attrName] !== 'undefined';
		    }

		    for (var i = 0, len = elements.length; i < len; i++) {
				elements[i].hasAttribute = hasAttribute;
			}
		}(elements));
	}

	for (var i = 0, len = elements.length; i < len; i++) {
		if (elements[i].hasAttribute(attr)) {
			if (elements[i].getAttribute(attr) === value) {
				return elements[i];
			}
		}
	}
}

//为IE浏览器，返回-1或者版本号
function isIE () {
    if (window.ActiveXObject === undefined) return -1;
    if (!document.querySelector) return 'IE7';
    if (!document.addEventListener) return 'IE8';
    if (!window.atob) return 'IE9';
    if (!document.__proto__) return 'IE10';
    return 11;
}

// 设置cookie
function setCookie(cookieName, cookieValue, expiredays) {
   	var times = new Date();
    times.setTime(times.getTime() + expiredays);
    if(expiredays == 0){
        document.cookie = cookieName + "=" + cookieValue + ";";
    }else{
        document.cookie = cookieName + "=" + cookieValue + "; expires=" + times.toGMTString();
    }
}

// 获取cookie值
function getCookie(cookieName) {
    var arr = document.cookie.match(new RegExp("(^| )" + cookieName + "=([^;]*)(;|$)")); 
    if(arr != null) return unescape(arr[2]); return null;
}

// cookie函数
// author: 曹刘阳
var Cookie = {
    // 读取
    read : function(name){
        var cookieStr = "; "+document.cookie+"; ";
        var index = cookieStr.indexOf("; "+name+"=");
        if (index!=-1){
            var s = cookieStr.substring(index+name.length+3,cookieStr.length); // '; name=raimonfuns; age=24; ''
            return unescape(s.substring(0, s.indexOf("; ")));
        }else{
            return null;
        }
    },
    // 设置
    set : function(name,value,expires){
        var expDays = expires*24*60*60*1000;
        var expDate = new Date();
        expDate.setTime(expDate.getTime()+expDays);
        var expString = expires ? "; expires="+expDate.toGMTString() : "";
        var pathString = ";path=/";
        document.cookie = name + "=" + escape(value) + expString + pathString;
    },
    // 删除
    del : function(name){
        var exp = new Date(new Date().getTime()-1);
        var s=this.read(name);
        if(s!=null) {document.cookie= name +
        "="+s+";expires="+exp.toGMTString()+";path=/"};
    }
}

// cookie函数
// author: blue
function setCookie(name, value, iDay) {
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + iDay);
    document.cookie = name + '=' + value + ';expires=' + oDate;
}
setCookie('user', 'raimon', 365);
setCookie('password', '123123', 7);

function getCookie(name) {
    var arr1 = document.cookie.split('; ');
    for (var i = 0; i < arr1.length; i++) {
        var arr2 = arr1[i].split('=');
        if (arr2[0] === name) {

            return arr2[1];
        }
    }
    return '';
}    
function removeCookie(name) {
    setCookie(name, 1, -1);
}



$.on = function (selector, type, listener) {
    addEvent($(selector), type, listener);
};

$.click = function (selector, listener) {
    addClickEvent($(selector), listener);
} 
//当回调函数不是匿名函数时才可以用
$.un = function (selector, type, listener) {
    removeEvent($(selector), type, listener);
}

$.delegate = function (selector, tag, type, listener) {
    delegateEvent($(selector), tag, type, listener);
}

function isArraylike( obj ) {
	var length = obj.length,
		type = typeof obj;

	if (isArray(obj)) {
		return false;
	}

	return  type === "array" || 
			type !== "function" &&
		  ( length === 0 ||
			typeof length === "number" && 
			length > 0 && 
			( length - 1 ) in obj );
}

// 获取css样式
function getStyle(element, cssPropertyName) {
    if (window.getComputedStyle) {
        return getComputedStyle(element, false)[cssPropertyName]
    } else {
        cssPropertyName = cssPropertyName.replace(/\-([a-zA-Z])/g, function( $, $1 ){
            return $1.toUpperCase();
        });
        return element.currentStyle[cssPropertyName];
    }
}

// 深拷贝
function deepClone(item) {
    if (!item) { return item; }
    var type = Object.prototype.toString.call(item).slice(8, -1).toLowerCase(),
        result;
 
    if ( type === 'object') {
        result = {};
        for (var i in item) {
            result[i] = deepClone(item[i]);
        }
    } else if ( type === 'array') {
        result = [];
        for (var i = 0; i < item.length; i++) {
             result[i] = deepClone(item[i]);
        }
    } else {
        result = item;
    }
    return result;
} 

function extend(subClass,superClass){
    var F = function () {};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    subClass.superclass = superClass.prototype;
    if(superClass.prototype.constructor == Object.prototype.constructor){
        superClass.prototype.constructor = superClass;
    }
}
Array.prototype.each = function(fun){
    for(var i = 0,n = this.length;i<n;i++){
        fun(this[i],i);
    }
}
Array.prototype.clone = function(){
    var o = [];
    this.each(function(v,k){
        o[k] = v;
    });
    return o;
}
Array.prototype.map = function(fun){
    var o = [];
    this.each(function(v,k){
        o[k] = fun(v,k);
    });
    return o;
}
//因为IE 中delete 是保留字，所以方法名改用Delete
Array.prototype.Delete = function(a){
    var o = this.clone();
    for(var i=o.length,n=0;i>n;i--){
        if(o[i] == a){
            o.splice(i,1);
        }
    }
    return o;
}