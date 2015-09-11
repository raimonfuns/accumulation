define(function(require, exports, module){
	require('script/common/login_topbar');
	require('script/common/login_piece');
	var ad = require('script/extends/jquery.slide');
	var task=require('views/mold/logic/index/task');

	ad({
		slideId:'#ad-slide',
		sign:'curr'
	});
 	
 	function maxList(list,n){
 		var newList=[];
 		for (var i = 0; i < n; i++) {
 			newList.push(list[i]);
 		};
 		return newList;
 		newList=null;
 	}
	
	$.ajax({
		url:'/service/web/tasksystem/tasklist',
		/*url:'../../script/logic/index/test.json',*/
		type: 'GET',
		cache: false,
		data:{type:6},
		dataType: 'json',
		success: function(json) {
			if (json.result&&json.data.length!=0) {
				json.data=maxList(json.data,3);
				$('.task-ul').html(task(json));
			};
		}
	}); 

});