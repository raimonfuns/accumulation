;(function($) {
    var _zid = 1,
        undefined,
        slice = Array.prototype.slice,
        isFunction = $.isFunction,
        isString = function(obj) {
            return typeof obj == 'string'
        },
        handlers = {},
        specialEvents = {},
        focusinSupported = 'onfocusin' in window,
        focus = {
            focus: 'focusin',
            blur: 'focusout'
        },
        hover = {
            mouseenter: 'mouseover',
            mouseleave: 'mouseout'
        }
        //特殊事件
    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

    //取element的唯一标示符，如果没有，则设置一个并返回 ,保证-zid的唯一性
    function zid(element) {
            return element._zid || (element._zid = _zid++)
        }
        //查找绑定在元素上的指定类型的事件处理函数集合
    function findHandlers(element, event, fn, selector) {
            event = parse(event)
            if (event.ns) var matcher = matcherFor(event.ns)
            return (handlers[zid(element)] || []).filter(function(handler) {
                //判断事件命名空间是否相同
                //注意函数是引用类型的数据zid(handler.fn)的作用是返回handler.fn的标示符，如果没有，则给它添加一个，
                //这样如果fn和handler.fn引用的是同一个函数，那么fn上应该也可相同的标示符，
                //这里就是通过这一点来判断两个变量是否引用的同一个函数
                return handler && (!event.e || handler.e == event.e) &&
                    (!event.ns || matcher.test(handler.ns)) && (!fn || zid(handler.fn) === zid(fn)) && (!selector || handler.sel == selector)
            })
        }
        //解析事件类型，返回一个包含事件名称和事件命名空间的对象
    function parse(event) {
            var parts = ('' + event).split('.')
            return {
                e: parts[0],
                //name space
                ns: parts.slice(1).sort().join(' ')
            }
        }
        //生成命名空间的正则
    function matcherFor(ns) {
            return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
        }
        //通过给focus和blur事件设置为捕获来达到事件冒泡的目的
    function eventCapture(handler, captureSetting) {
            return handler.del &&
                (!focusinSupported && (handler.e in focus)) ||
                !!captureSetting
        }
        //修复不支持mouseenter和mouseleave的情况
    function realEvent(type) {
        return hover[type] || (focusinSupported && focus[type]) || type
    }

    function add(element, events, fn, data, selector, delegator, capture) {
        //取到元素的zid
        var id = zid(element),
            set = (handlers[id] || (handlers[id] = [])) //元素上已经绑定的所有事件处理函数，如果没有赋值一个新数组

        events.split(/\s/).forEach(function(event) {
            //如果是绑定dom ready事件
            if (event == 'ready') return $(document).ready(fn)
                //解析事件类型，返回一个包含事件名称和事件命名空间的对象
            var handler = parse(event)
                // //保存fn,下面为了处理mouseenter, mouseleave时，对fn进行了修改
            handler.fn = fn
            handler.sel = selector
                // emulate mouseenter, mouseleave
                // 模仿 mouseenter, mouseleave
            if (handler.e in hover) fn = function(e) {
                /*
                          relatedTarget为事件相关对象，只有在mouseover和mouseout事件时才有值
                          mouseover时表示的是鼠标移出的那个对象，mouseout时表示的是鼠标移入的那个对象
                          当related不存在，表示事件不是mouseover或者mouseout,mouseover时!$.contains(this, related)当相关对象不在事件对象内
                          且related !== this相关对象不是事件对象时，表示鼠标已经从事件对象外部移入到了对象本身，这个时间是要执行处理函数的
                          当鼠标从事件对象上移入到子节点的时候related就等于this了，且!$.contains(this, related)也不成立，这个时间是不需要执行处理函数的
                      */
                var related = e.relatedTarget
                if (!related || (related !== this && !$.contains(this, related)))
                    return handler.fn.apply(this, arguments)
            }
            handler.del = delegator //事件委托
            var callback = delegator || fn
            handler.proxy = function(e) {
                    e = compatible(e)
                        //这个event对象执行过阻止冒泡方法stopImmediatePropagation，这里直接返回。
                    if (e.isImmediatePropagationStopped()) return
                    e.data = data
                        //调用之前传入的回调函数
                    var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
                        //当事件处理函数返回false时，阻止默认操作和冒泡
                    if (result === false) e.preventDefault(), e.stopPropagation()
                    return result
                }
                //设置处理函数的在函数集中的位置,remove的时候要用到
            handler.i = set.length
                //将函数存入函数集中，引用类型，你懂的，handlers里面也有了
            set.push(handler)
            if ('addEventListener' in element)
            //realEvent(handler.e) 处理事件类型，eventCapture绑定事件类型，是捕获还是冒泡
                element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
        })
    }

    //删除绑定在元素上的指定类型的事件监听函数，可同时删除多种事件类型指定的函数，用数组或者还空格的字符串即可，同add
    function remove(element, events, fn, selector, capture) {
        //取到元素的zid
        var id = zid(element);
        (events || '').split(/\s/).forEach(function(event) {
            findHandlers(element, event, fn, selector).forEach(function(handler) {
                //删除handlers 对应这个元素（通过zid关联的），对应的索引的callback。
                //var a=[1,2,3,4,5]  delete a[0]，delete a[3]====>[2,3,5]
                delete handlers[id][handler.i]
                    //移除元素上绑定的事件
                if ('removeEventListener' in element)
                    element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
            })
        })
    }

    $.event = {
            add: add,
            remove: remove
        }
        //看到他 就想起了bind
    $.proxy = function(fn, context) {
        var args = (2 in arguments) && slice.call(arguments, 2)
        if (isFunction(fn)) {
            var proxyFn = function() {
                return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments)
            }
            proxyFn._zid = zid(fn)
            return proxyFn
        } else if (isString(context)) {
            if (args) {
                args.unshift(fn[context], fn)
                return $.proxy.apply(null, args)
            } else {
                return $.proxy(fn[context], fn)
            }
        } else {
            throw new TypeError("expected function")
        }
    }

    $.fn.bind = function(event, data, callback) {
        return this.on(event, data, callback)
    }
    $.fn.unbind = function(event, callback) {
        return this.off(event, callback)
    }

    $.fn.one = function(event, selector, data, callback) {
        return this.on(event, selector, data, callback, 1)
    }

    var returnTrue = function() {
            return true
        },
        returnFalse = function() {
            return false
        },
        ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
        eventMethods = {
            //是否调用过preventDefault方法
            preventDefault: 'isDefaultPrevented',
            //取消执行其他的事件处理函数并取消事件冒泡.如果同一个事件绑定了多个事件处理函数, 在其中一个事件处理函数中调用此方法后将不会继续调用其他的事件处理函数.
            stopImmediatePropagation: 'isImmediatePropagationStopped', //是否调用过stopImmediatePropagation方法，
            stopPropagation: 'isPropagationStopped' //是否调用过stopPropagation方法
        }

        //主要是在event和source做相关的处理
    function compatible(event, source) {
        //存在source 或者 event的isDefaultPrevented不存在
        if (source || !event.isDefaultPrevented) {
            source || (source = event)
            $.each(eventMethods, function(name, predicate) {
                //source['preventDefault']、source['stopImmediatePropagation']、source['stopPropagation']
                var sourceMethod = source[name]
                    //event['preventDefault']、event['stopImmediatePropagation']、event['stopPropagation']
                event[name] = function() {
                        //this['isDefaultPrevented']this['isImmediatePropagationStopped']this['isPropagationStopped']
                        //一旦调用过，event对象相应的值就会发生变化, 之前是returnFalse，现在是returnTrue
                        this[predicate] = returnTrue
                        return sourceMethod && sourceMethod.apply(source, arguments)
                    }
                    //event['isDefaultPrevented']、event['isImmediatePropagationStopped']、event['isPropagationStopped']
                event[predicate] = returnFalse
            })

            if (source.defaultPrevented !== undefined ? source.defaultPrevented :
                'returnValue' in source ? source.returnValue === false :
                source.getPreventDefault && source.getPreventDefault())

                event.isDefaultPrevented = returnTrue
        }
        return event
    }

    function createProxy(event) {
        var key, proxy = {
            originalEvent: event //保存原始event
        }
        for (key in event)
            //不是需要忽略的
            if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key] //复制event属性至proxy

        return compatible(proxy, event)
    }

    $.fn.delegate = function(selector, event, callback) {
        return this.on(event, selector, callback)
    }
    $.fn.undelegate = function(selector, event, callback) {
        return this.off(event, selector, callback)
    }
    $.fn.live = function(event, callback) {
        //委托到body上
        $(document.body).delegate(this.selector, event, callback)
        return this
    }
    $.fn.die = function(event, callback) {
        $(document.body).undelegate(this.selector, event, callback)
        return this
    }
    $.fn.on = function(event, selector, data, callback, one) {
        var autoRemove, delegator, $this = this
            //如果是{'click':function(){},'touchmove':function(){}}
            //此时event是Object
        if (event && !isString(event)) {
            $.each(event, function(type, fn) {
                $this.on(type, selector, data, fn, one)
            })
            return $this
        }

        if (!isString(selector) && !isFunction(callback) && callback !== false)
            callback = data, data = selector, selector = undefined

        if (isFunction(data) || data === false)
            callback = data, data = undefined

        if (callback === false) callback = returnFalse

        return $this.each(function(_, element) {
            //如果是一次性事件
            if (one) autoRemove = function(e) {
                    //移除该事件
                    remove(element, e.type, callback)
                        //执行回调
                    return callback.apply(this, arguments)
                }
                //事件委托，这里是事件冒泡到element元素上
            if (selector) delegator = function(e) {
                //事件触发元素e.target的祖先级元素
                var evt, match = $(e.target).closest(selector, element).get(0)
                    //找到了 并且不是element本身
                if (match && match !== element) {
                    //创建一个event对象
                    evt = $.extend(createProxy(e), {
                            currentTarget: match,//匹配到的元素
                            liveFired: element//委托的元素
                        })
                        //(autoRemove || callback)不是一次性事件，就调用callback，
                        // [evt].concat(slice.call(arguments, 1))拼接参数数组。
                    return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
                }
            }
            add(element, event, callback, data, selector, delegator || autoRemove)
        })
    }
    $.fn.off = function(event, selector, callback) {
        var $this = this
        if (event && !isString(event)) {
            $.each(event, function(type, fn) {
                $this.off(type, selector, fn)
            })
            return $this
        }

        if (!isString(selector) && !isFunction(callback) && callback !== false)
            callback = selector, selector = undefined

        if (callback === false) callback = returnFalse
            
        return $this.each(function() {
            remove(this, event, callback, selector)
        })
    }
    $.fn.trigger = function(event, args) {
        event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
        event._args = args
        return this.each(function() {
            // handle focus(), blur() by calling them directly
            if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
                // items in the collection might not be DOM elements
            else if ('dispatchEvent' in this) this.dispatchEvent(event)
            else $(this).triggerHandler(event, args)
        })
    }

    // triggers event handlers on current element just as if an event occurred,
    // doesn't trigger an actual event, doesn't bubble
    //触发元素上绑定的指定类型的事件，但是不冒泡
    $.fn.triggerHandler = function(event, args) {
        var e, result
        this.each(function(i, element) {
            e = createProxy(isString(event) ? $.Event(event) : event)
            e._args = args
            e.target = element
                //遍历元素上绑定的指定类型的事件处理函数集，按顺序执行，如果执行过stopImmediatePropagation方法，
                //那么e.isImmediatePropagationStopped()就会返回true,再外层函数返回false
                //each里的回调函数指定返回false时，会跳出循环，这样就达到的停止执行回面函数的目的
            $.each(findHandlers(element, event.type || event), function(i, handler) {
                //直接调用handler.proxy发方法，没有经过浏览器，所以很多浏览器的行为不会发生。
                // $("input").triggerHandler('focus');
                // 此时input上的focus事件触发，但是input不会获取焦点。因为这里直接取到绑定到该元素对应的focus事件，然后调用
                //$("input").trigger('focus');
                // 此时input上的focus事件触发，input获取焦点。这里最后会dispatchEvent，会触发浏览器相关行为
                result = handler.proxy(e)
                    //如果这个对象调用了ImmediatePropagationStopped方法
                if (e.isImmediatePropagationStopped()) return false
            })
        })
        return result
    }

    // shortcut methods for `.bind(event, fn)` for each event type
    ;
    ('focusin focusout focus blur load resize scroll unload click dblclick ' +
        'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
        'change select keydown keypress keyup error').split(' ').forEach(function(event) {
            $.fn[event] = function(callback) {
                return (0 in arguments) ?
                    //多个参数
                    this.bind(event, callback) :
                    //没有参数 直接调用
                    this.trigger(event)
            }
        })
        //根据参数创建一个event对象
    $.Event = function(type, props) {
        //当type是个对象时
        if (!isString(type)) props = type, type = props.type
            //创建一个event对象，如果是click,mouseover,mouseout时，创建的是MouseEvent,bubbles为是否冒泡
        var event = document.createEvent(specialEvents[type] || 'Events'),
            bubbles = true
            //确保bubbles的值为true或false,并将props参数的属性扩展到新创建的event对象上
        if (props)
            for (var name in props)(name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
                //初始化event对象，type为事件类型，如click，bubbles为是否冒泡，第三个参数表示是否可以用preventDefault方法来取消默认操作
        event.initEvent(type, bubbles, true)
        return compatible(event)
    }

})(Zepto); 

zepto event