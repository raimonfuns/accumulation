define(function(require, exports, module){
	var login = require('script/common/login');
	var login_top = require('views/mold/common/login_top');
	
	//console.log(swig.render($('#test').html(),{name:'tony'})); 
	login.getUserInfo(function(info){
		$('.nav-main').append(login_top(info));
		//console.log(swig.run(tpl,info));
	});

});