define(function(require,exports,module){
	require("http://vipweb.bs2.yy.com/jquery-datepicker.min.js");

	$.datepicker.setDefaults({
		changeYear: true,
		changeMonth: true,
		showMonthAfterYear: true,
		monthNamesShort:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
		dayNamesMin:['日','一','二','三','四','五','六'],
		dateFormat: "yy-mm-dd",
		maxDate:null,
		yearRange: "2014:2050",
		showOn: "button",
	    buttonImageOnly: true,
	    buttonText: ""
	});
});