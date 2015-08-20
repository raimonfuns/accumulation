/**
 * 多层过滤
 */

// "true"  => true
// "false" => false
// "null"  => null
// "42"    => 42
// "42.5"  => 42.5
// "08"    => "08"
// JSON    => parse if valid
// String  => self
function deserializeValue(value) {
    try {
        return value ?
        value == "true" ||
        (   value == "false" ? false :
            value == "null" ? null :
            +value + "" == value ? +value :
            /^[\[\{]/.test(value) ? $.parseJSON(value) :
            value )
            : value
    } catch(e) {
      return value
    }
}


/**
 * 字符串拼接
 */
classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))

/**
 * 等价switch语句
 */
target =    operatorIndex == 0 ? target.nextSibling :  
            operatorIndex == 1 ? target.firstChild :  
            operatorIndex == 2 ? target :      
            null                             