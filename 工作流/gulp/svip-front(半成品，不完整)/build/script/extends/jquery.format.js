/**
 * @param  {[type]} format [想要格式化成什么样的]
 * @param  {[type]} stamp  [时间戳，可选]
 * @return {[type]}        [按指定格式返回时间]
 */
define(function(require, exports, module){

	function format(format, stamp){

	    var D = stamp || new Date(), format = format || 'Y-m-d H:i:s', week = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'], dd = {};
	    if(/^\d+$/.test(D)){
	        if(D.toString().length == 10) D *= 1000;
	        D = new Date(D);
	    }
	    dd = {
	        'year' : D.getYear(),
	        'month' : D.getMonth() + 1,
	        'date' : D.getDate(),
	        'day' : week[D.getDay()],
	        'hours' : D.getHours(),
	        'minutes' : D.getMinutes(),
	        'seconds' : D.getSeconds()
	    };
	    dd.g = dd.hours > 12 ? Math.ceil(dd.hours / 2) : dd.hours;
	    
	    var oType = {
	        'Y' : D.getFullYear(),
	        'y' : dd.year,
	        'm' : dd.month < 10 ?  '0' + dd.month : dd.month,
	        'n' : dd.month,
	        'd' : dd.date < 10 ? '0' + dd.date : dd.date,
	        'j' : dd.date,
	        'D' : dd.day,
	        'H' : dd.hours < 10 ? '0' + dd.hours : dd.hours,
	        'h' : dd.g < 10 ? '0' + dd.g : dd.g,
	        'G' : dd.hours,
	        'g' : dd.g,
	        'i' : dd.minutes < 10 ? '0' + dd.minutes : dd.minutes,
	        's' : dd.seconds < 10 ? '0' + dd.seconds : dd.seconds
	    };
	    for(var i in oType){
	        format = format.replace(i, oType[i]);
	    }
	    
	    return format;

	}
	module.exports=format;
});