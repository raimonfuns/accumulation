define(function(require, exports, module){

    function paging(obj){
		var opt={
			url:'',		//请求列表的接口
			cistern:'',	//显示分页的容器
            max:11,		//最多展示的页码，一般不建议修改
            param:{
            	currentPage:1,	//页码
				numPage:10		//一页显示的条数
            }
		};
        $.extend(true,opt,obj);
        
        var reqData=opt.param;
        var isHast = false;

        function request(data,callback){
        	$.ajax({
        		url:opt.url,
        		type:'GET',
        		data:data,
        		dataType:'json',
        		success:function(json){
        			if (json.result) {
		        		treatPaging({
		        			totalPages:json.data.totalPages,
		        			currentPage:json.data.currentPage
		        		});
		        		if (callback) callback(json);
		        	};

        			if (opt.callback) opt.callback(json);
        		}
        	});
        }
        
        request(reqData);

        function treatPaging(object){
        	if (object.totalPages>1) {
	            var pag=require('views/mold/common/paging');
	            function getPages() {
					var arr=[];
					for (var i = 1; i <= object.totalPages; i++) {
						arr.push(i);
					};
					return arr;
					arr=null;
				};
				function ellPages() {
					var arr=[];
					for (var i = 1; i <= opt.max-2; i++) {
						arr.push(i);
					};
					return arr;
					arr=null;
				};
				function ellPart() {
					var arr=[];
					for (var i = 1; i <= Math.floor((opt.max-4)/2); i++) {
						arr.push(i);
					};
					return arr;
					arr=null;
				};
				function setPaging(p){
					$(opt.cistern).html(pag({
						pages:getPages(),
						p:p,
						max:opt.max,
						ell:ellPages(),
						rell:ellPages().reverse(),
						ellPart:ellPart(),
						rellPart:ellPart().reverse(),
						mid:Math.ceil(opt.max/2)
					}));
				};
				setPaging(object.currentPage);
				if(!isHast){
					$(opt.cistern).delegate('.paging>.pag','click',function(){
						var _this=$(this);
						if (!_this.is('.curr')) {
							var p=parseInt(_this.html());
							reqData.currentPage=p;
							request(reqData,function(json){
								setPaging(p);
							});
						};
					});
					$(opt.cistern).delegate('.paging>#prev','click',function(){
						var p=parseInt($(this).siblings('.curr').html())-1;
						reqData.currentPage=p;
						request(reqData,function(json){
							setPaging(p);
						});
					});
					$(opt.cistern).delegate('.paging>#next','click',function(){
						var p=parseInt($(this).siblings('.curr').html())+1;
						reqData.currentPage=p;
						request(reqData,function(json){
							setPaging(p);
						});
					});
					isHast = true;
				}
	        };
        }   
	}
    module.exports=paging;
});