define(function(require, exports, module){
	require('script/common/login_topbar');
	require('script/common/login_piece');
	require('script/extends/jquery.datepicker');
	//var dialog = require("script/extends/dialog/dialog");
	var format=require("script/extends/jquery.format");
	var pages=require('script/common/paging');
	var record_consume=require('views/mold/logic/record/record_consume');

	var now=new Date();
	$("#end-date").datepicker().val(format('Y-m-d',Date.parse(now)));
	now.setMonth(now.getMonth()-1);
	$("#start-date").datepicker().val(format('Y-m-d',Date.parse(now)));
	

	function getConsumeList() {
		pages({
			url:'/service/web/payhistory/list',
			/*url:'../../script/logic/record/test.json',*/
			cistern:'.consume-pages',
			param:{
				start:$("#start-date").val(),
				end:$("#end-date").val()
			},
	        callback:function(json){
	        	if (json.result&&json.data.list.length!=0) {
					$('#record-table tbody').html(record_consume(json));
				};
	        }
		});
	}
	getConsumeList();
	$('#consume-btn').click(function(){
		getConsumeList();
	});
		


});