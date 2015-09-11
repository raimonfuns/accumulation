define(function(require, exports, module){
	var login = require('script/common/login');
	var login_piece = require('views/mold/common/login_piece');
	var format = require('script/extends/jquery.format');

	//console.log(swig.render($('#test').html(),{name:'tony'})); 
	login.getUserInfo(function(info){
		if (info.result&&info.data.info.svip) {
			info.data.info.expiredDate=format('Y-m-d',info.data.info.expiredDate);
		};
		$('.login-box').append(login_piece(info));
		//console.log(swig.run(tpl,info));
	});
});