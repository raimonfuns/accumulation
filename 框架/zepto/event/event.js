//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  var _zid = 1, undefined,
      slice = Array.prototype.slice,
      isFunction = $.isFunction,
      isString = function(obj){ return typeof obj == 'string' },
      handlers = {},//_zid: events    事件缓存池
      specialEvents={},
      focusinSupported = 'onfocusin' in window,      //是否支持即将获取焦点时触发函数   onfocusin focus不支持冒泡
      focus = { focus: 'focusin', blur: 'focusout' },    //焦点修正
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }    // mouseenter  mouseleave不冒泡的修正 ，mouseover mouseout功能一样且支持冒泡

    //此处标准浏览器，click、mousedown、mouseup、mousemove抛出的就是MouseEvents，应该也是对低版本IE等某些浏览器的修正
  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'


    /**
     * 取元素标识符，没有设置一个返回
     * @param element
     * @returns {*|number}
     */
  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }

    /**
     *  查找元素上事件响应函数集合
     * @param element
     * @param event
     * @param fn
     * @param selector
     * @returns {Array}
     */
  function findHandlers(element, event, fn, selector) {
    //解析命名空间事件名
    event = parse(event)

        //
    if (event.ns) var matcher = matcherFor(event.ns)

        //找到响应函数集合
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e) //判断事件类型是否相同
        && (!event.ns || matcher.test(handler.ns)) //判断事件命名空间是否相同 RegExp.prototype.test = function(String) {};
        && (!fn       || zid(handler.fn) === zid(fn))  // zid(handler.fn)返回handler.fn的标识，没有加一个，判断fn标识符是否相同
        && (!selector || handler.sel == selector)  //返回 handler，  判断selector是否相同
    })
  }

    /**
     * 解析事件类型
     * @param event  'click'
     * @returns {{e: * 事件类型 , ns: string 命名空间}}
     */
  function parse(event) {
        //如果有.分隔，证明有命名空间
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }

    /**
     * 生成命名空间的正则对象
     * @param ns
     * @returns {RegExp}
     */
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

    /**
     * 事件捕获
     * 对focus和blur事件且浏览器不支持focusin focusout，通过设置捕获来模拟冒泡
     * @param handler
     * @param captureSetting
     * @returns {*|boolean|boolean}
     */
  function eventCapture(handler, captureSetting) {
        //如果是focus和blur事件且浏览器不支持focusin focusout时，
        //设置为可捕获，间接达到冒泡的目的
    return handler.del &&
      (!focusinSupported && (handler.e in focus)) ||
      !!captureSetting
  }

    /**
     *  修正事件类型 focus->focusIn blur->focusOut mouseenter->mouseover  mouseleave->mouseout
     * @param type   事件类型
     * @returns {*|boolean|*|*}
     */
  function realEvent(type) {
        //hover[type] mouseenter和mouseleave 转换成   mouseover和mouseout
        // focus[type]  focus blur  修正为  focusin  focusout
    return hover[type] || (focusinSupported && focus[type]) || type
  }


    /**
     * 增加事件底层方法
     * @param element
     * @param events  字符串 如‘click'
     * @param fn
     * @param data
     * @param selector
     * @param delegator
     * @param capture
     */
  function add(element, events, fn, data, selector, delegator, capture){
        //zid Zepto会在elemnt上扩展一个标识属性_zid
        // 读取元素上已绑定的事件处理函数
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))

        // \s 匹配空格
    events.split(/\s/).forEach(function(event){
        //如果是ready事件
      if (event == 'ready') return $(document).ready(fn)

        //解析事件   {e: * 事件类型 , ns: string 命名空间}
      var handler   = parse(event)
        //保存fn,下面为了处理mouseenter, mouseleave时，对fn进行了修改

      //存储fn响应函数
      //存储selector
      handler.fn    = fn
      handler.sel   = selector

      // emulate mouseenter, mouseleave
        // 模仿 mouseenter, mouseleave

        //如果事件是mouseenter, mouseleave，模拟mouseover mouseout事件处理
      if (handler.e in hover) fn = function(e){
//          relatedTarget 事件属性返回与事件的目标节点相关的节点。
//            对于 mouseover 事件来说，该属性是鼠标指针移到目标节点上时所离开的那个节点。
//            对于 mouseout 事件来说，该属性是离开目标时，鼠标指针进入的节点。
//            对于其他类型的事件来说，这个属性没有用。
        var related = e.relatedTarget

        //不存在，表明不是mouseover、mouseout事件，
          //related !== this && !$.contains(this, related))  当related不在事件对象event内   表示事件已触发完成，不是在move过程中，需要执行响应函数
        if (!related || (related !== this && !$.contains(this, related)))
            //执行响应函数
          return handler.fn.apply(this, arguments)
      }

      //事件委托
      handler.del   = delegator
      var callback  = delegator || fn
      handler.proxy = function(e){
        //修正event
        e = compatible(e)

          //如果是阻止所有事件触发
        if (e.isImmediatePropagationStopped()) return
        e.data = data //缓存数据
         //执行回调函数，context：element，arguments：event,e._args(默认是undefind，trigger()时传递的参数）
        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))

          //当事件响应函数返回false时，阻止浏览器默认操作和冒泡
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }

      //设置事件响应函数的索引,删除事件时，根据它来删除  delete handlers[id][handler.i]
      handler.i = set.length

        //缓存到handlers[id]里    set = handlers[id]
      set.push(handler)

        //元素支持DOM2级事件绑定
      if ('addEventListener' in element)
      //绑定事件
      //DOM源码
//         @param {string} type
//        @param {EventListener|Function} listener
//        @param {boolean} [useCapture]     是否使用捕捉，默认 false
//        EventTarget.prototype.addEventListener = function(type,listener,useCapture) {};
        //realEvent(handler.e)  修正后的事件类型
        //handler.proxy 修正为代理上下文的事件响应函数
        // eventCapture(handler, capture)
        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
    })
  }

    /**
     *  删除事件,   对应add
     * @param element
     * @param events
     * @param fn
     * @param selector
     * @param capture  是否捕获
     */
  function remove(element, events, fn, selector, capture){
    var id = zid(element)  //找到元素标识
    ;(events || '').split(/\s/).forEach(function(event){ //events多个以空格分隔
            //遍历事件响应函数集合
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]      //删除缓存在handlers的响应函数
      if ('removeEventListener' in element)
         //调用DOM原生方法删除事件
         //DOM源代码
//          /**
//           @param {string} type
//           @param {EventListener|Function} listener
//           @param {boolean} [useCapture]
//           */
//          EventTarget.prototype.removeEventListener = function(type,listener,useCapture) {};
          //realEvent(handler.e) 修正事件类型     handler.proxy  代理的事件响应函数     eventCapture(handler, capture)修正的是否捕获
          //与增加事件底层函数 add最后一行    element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))  呼应
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  //此处不清楚要干嘛，将事件两个核心底层方法封装到event对象里，方便做Zepto插件事件扩展？
  $.event = { add: add, remove: remove }

    /**
     * 代理
     * (function,context),(context,name)
     * @param fn
     * @param context
     * @returns {*}
     */
  $.proxy = function(fn, context) {
    var args = (2 in arguments) && slice.call(arguments, 2)   //如果传了第3个参数，取到第3个参数以后（包含第3个参数）所有的参数数组，挺好的判断技巧
    if (isFunction(fn)) {   //fn是函数
        //采用闭包，以context调用函数。
        // args.concat(slice.call(arguments)) 将传参挪到前面  如传递给$.proxy(fn,context,3,4);  
        // 坑！这里的arguments是proxyFn的参数数组，而不是$.proxy
      var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
      // 标记函数
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (isString(context)) {     //context是字符串, 实际传参(context,name)
      if (args) {                       //修正传参，再以$.proxy调用
        args.unshift(fn[context], fn)   // unshift  往数组开头添加新的项
        return $.proxy.apply(null, args)
      } else {
        return $.proxy(fn[context], fn)
      }
    } else {
      throw new TypeError("expected function")   //抛出异常:要求的函数类型错误
    }
  }

    /**
     * 绑定事件,应直接采用on
     * 源自1.9版本前jquery的绑定事件的区分：
     bind()是直接绑定在元素上

     .live()则是通过冒泡的方式来绑定到元素上的。更适合列表类型的，绑定到document DOM节点上。和.bind()的优势是支持动态数据。

     .delegate()则是更精确的小范围使用事件代理，性能优于.live()

     .on()则是1.9版本整合了之前的三种方式的新事件绑定机制
     * @param event
     * @param data
     * @param callback
     * @returns {*}
     */
  $.fn.bind = function(event, data, callback){
    return this.on(event, data, callback)
  }

    /**
     *  解绑事件,应直接用off
     * @param event
     * @param callback
     * @returns {*}
     */
  $.fn.unbind = function(event, callback){
    return this.off(event, callback)
  }
    /**
     * 绑定一次性事件
     * @param event
     * @param selector
     * @param data
     * @param callback
     * @returns {*}
     */
  $.fn.one = function(event, selector, data, callback){
    return this.on(event, selector, data, callback, 1)
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,//匹配 大写字母A-Z开头/returnValue/layerX/layerY用于createProxy(),过滤event对象的属性
      eventMethods = {
        preventDefault: 'isDefaultPrevented',//是否已调用preventDefault()    preventDefault      阻止浏览器的默认动作
        stopImmediatePropagation: 'isImmediatePropagationStopped', //是否已调用stopImmediatePropagation()，stopImmediatePropagation DOM3提出的阻止任何事件触发
        stopPropagation: 'isPropagationStopped' //是否已调用stopPropagation()  stopPropagation阻止冒泡
      }

    /**
     * 修正event对象
     * @param event   代理的event对象
     * @param source  原生event对象
     * @returns {*}
     */
  function compatible(event, source) {

    //event.isDefaultPrevented   是否已调用了preventDefault方法

    //event是代理事件对象时，赋值给source
    //如果没有调用过preventDefault方法
    if (source || !event.isDefaultPrevented) {
      source || (source = event)

      //遍历，代理preventDefault  stopImmediatePropagation   stopPropagation等方法
      $.each(eventMethods, function(name, predicate) {
        var sourceMethod = source[name]
        event[name] = function(){          //扩展event对象，代理preventDefault  stopImmediatePropagation   stopPropagation方法 ，兼容浏览器不支持，同时做其他事情
        this[predicate] = returnTrue     //如果执行了3方法，原生事件对象isDefaultPrevented  isImmediatePropagationStopped  isPropagationStopped 三方法标记true
          return sourceMethod && sourceMethod.apply(source, arguments)  //且调用原生方法
        }
        event[predicate] = returnFalse   //扩展原生事件对象  isDefaultPrevented  isImmediatePropagationStopped  isPropagationStopped三方法，默认返回false。
      })

        //如果浏览器支持  defaultPrevented DOM3 EVENT提出的能否取消默认行为
      if (source.defaultPrevented !== undefined ? source.defaultPrevented :
          'returnValue' in source ? source.returnValue === false :
          source.getPreventDefault && source.getPreventDefault())
        event.isDefaultPrevented = returnTrue    //默认可以取消
    }

        //返回修正对象
    return event
  }

    /**
     * 创建事件代理
     * @param event Event对象
     * @returns {*}
     */
  function createProxy(event) {
    var key, proxy = { originalEvent: event } //存储原始event
    for (key in event)
     //复制event属性至proxy，ignoreProperties里包含的属性除外
    if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    return compatible(proxy, event)
  }

    /**
     * 小范围冒泡绑定事件,应直接采用on
     */
  $.fn.delegate = function(selector, event, callback){
    return this.on(event, selector, callback)
  }
    /**
     *  解绑事件,应直接用off
     */
  $.fn.undelegate = function(selector, event, callback){
    return this.off(event, selector, callback)
  }

    /**
     *  冒泡到document.body绑定事件,应直接采用on
     * @param event
     * @param callback
     * @returns {*}
     */
  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
    /**
     *  在doument.body解绑事件,应直接用off
     */
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

    /**
     * 扩展Zepto on监听事件方法
     * 元素上绑定一个或多个事件的事件处理函数
     * 注意： 方法参数不应超过5个，超过5个，应该用arguments。5个是惯例。if或for或闭包嵌套层也不应超过5层
     * @param event 事件集 字符串/
     * @param selector 子选择器
     * @param data  event.data
     * @param callback          事件响应函数
     * @param one        内部用， $.fn.one用。标记一次性事件
     * @returns {*}
     */
  $.fn.on = function(event, selector, data, callback, one){
    var autoRemove, delegator, $this = this

      //event是对象{click:fn},支持这种方式我觉得没多大用
     if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.on(type, selector, data, fn, one)
      })
      return $this
    }

    //函数重载
    //选择器非字符串  callback非方法
    //未传data    on('click','.ss',function(){})
    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = data, data = selector, selector = undefined
      //data传了function    或未传
      if (callback === undefined || data === false)
      callback = data, data = undefined

      //callback传了false，转换成false函数
    if (callback === false) callback = returnFalse

      //遍历元素，
    return $this.each(function(_, element){
        //如果是一次性，先删掉事件，再执行事件
      if (one) autoRemove = function(e){
        remove(element, e.type, callback)
        return callback.apply(this, arguments)
      }

        //传递了选择器
      if (selector) delegator = function(e){
          //以element元素为容器，以事件源为起点，往上冒泡找到匹配selector的元素
          // match  响应函数对应的事件源
        var evt, match = $(e.target).closest(selector, element).get(0)
          //    selector能找到，且不是容器，即不是绑定事件的上下文，即$('.parent').on('click','.son',fn)形式。开始处理委托。
          if (match && match !== element) {

          //createProxy(e) 创建event代理对象  currentTarget指向selector元素，liveFired指向绑定事件的容器element
          evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})

           //执行事件响应函数
           //autoRemove触发一次事件响应函数后自动销毁。 callback触发事件响应函数
           // [evt].concat(slice.call(arguments, 1))响应函数的参数数组
          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
        }
      }

      add(element, event, callback, data, selector, delegator || autoRemove)
    })
  }

    /**
     * 移除事件响应函数
     * @param event
     * @param selector
     * @param callback
     * @returns {*}
     */
  $.fn.off = function(event, selector, callback){
    var $this = this

     //是对象，遍历移除
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.off(type, selector, fn)
      })
      return $this
    }

      // 是函数
    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = selector, selector = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(){
        //元素遍历移除
      remove(this, event, callback, selector)
    })
  }

    /**
     * 触发事件
     * @param event 事件类型
     * @param args
     * @returns {*}
     */
  $.fn.trigger = function(event, args){
    //修正event为事件对象
    event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)

    //传参
    event._args = args

    return this.each(function(){
      // handle focus(), blur() by calling them directly
      //如果事件是focus blur，直接执行
      if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
      // items in the collection might not be DOM elements
      // 支持浏览器原生触发事件API
      // EventTarget.prototype.dispatchEvent = function(event) {};
      else if ('dispatchEvent' in this) this.dispatchEvent(event)

      //模拟触发事件
      else $(this).triggerHandler(event, args)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
    /**
     * 触发事件，不能冒泡
     * @param event  event对象
     * @param args 传参
     * @returns {*}
     */
  $.fn.triggerHandler = function(event, args){
    var e, result
    this.each(function(i, element){
        //修正事件对象
      e = createProxy(isString(event) ? $.Event(event) : event)
      e._args = args
      e.target = element


      //找到此元素上此事件类型上的事件响应函数集，遍历，触发
      $.each(findHandlers(element, event.type || event), function(i, handler){
          //调用 handler.proxy执行事件
        result = handler.proxy(e)

          //如果event调用了immediatePropagationStopped()，终止后续事件的响应
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

   // shortcut methods for `.bind(event, fn)` for each event type
    /**
     * 给常用事件生成便捷方法
     * @param event
     * @param args
     * @returns {*}
     */
  ;('focusin focusout focus blur load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return (0 in arguments) ?
          //有callback回调，是绑定事件，否则，触发事件  ，
          // 不用on？on才通用啊 ,bind也是调用on
          //$.fn.bind = function(event, data, callback){
//             return this.on(event, data, callback)
//           }
        this.bind(event, callback) :
        this.trigger(event)
    }
  })

    /**
     *  创建Event对象
     * @param type
     * @param props 扩展到Event对象上的属性
     * @returns {*}
     * @constructor
     */
  $.Event = function(type, props) {
      //当type是个对象时
    if (!isString(type)) props = type, type = props.type


      //对应 specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'
      //创建event对象，如果是click,mousedown,mouseup mousemove，创建为MouseEvent对象,bubbles设为冒泡
      //TODO: 为什么要把这些事件单独拎出来？
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true

      // (name == 'bubbles') ? (bubbles = !!props[name])如果是冒泡，确保是true/false    浏览器只识别true、false， !!props[name]明确进行类型转换
       // event[name] = props[name] props属性扩展到event对象上
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])

      //初始化event对象，type为事件类型，如click，bubbles为是否冒泡，第三个参数表示是否可以用preventDefault方法来取消默认操作
      //初始化event对象，type：事件类型   如click  bubbles能否  true:   能否使用preventDefault取消浏览器默认操作
      //附上DOM源码
      /*
      @browser Gecko
      @param {string} eventTypeArg
      @param {boolean} canBubbleArg
      @param {boolean} cancelableArg
      */
    //Event.prototype.initEvent = function(eventTypeArg,canBubbleArg,cancelableArg) {};
      event.initEvent(type, bubbles, true)

      //添加isDefaultPrevented方法，event.defaultPrevented返回一个布尔值,表明当前事件的默认动作是否被取消,也就是是否执行了 event.preventDefault()方法.
    return compatible(event)
  }

})(Zepto)