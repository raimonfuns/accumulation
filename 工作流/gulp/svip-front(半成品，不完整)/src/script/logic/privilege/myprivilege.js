define(function(require,exports,module){
	require('script/common/login_topbar');
	require('script/common/login_piece');
	require('script/extends/jquery.datepicker');

	var login = require('script/common/login');

	var template = require('script/lib/template.min');

	var dialog = require('script/extends/dialog/dialog');

	$("#supportTime").datepicker();
	$("#channelTime").datepicker();

	function errorAlert(msg){
		// alert(msg);
		dialog.showMsgBox(msg);
	}

	function initOpenClose(target){
		var $target = $(target);
		$target.on("click",".pri-updown-icon",function(){
			var $this = $(this);
			//打开频道选择
			if($this.hasClass("down")){
				$target.find(".pri-select-channel-wrap").animate({
					height: $target.data("height")
				},500,function(){
					$this.removeClass("down").addClass("up");
				});
			}
			//关闭频道选择
			else if($this.hasClass("up")){
				//隐藏频道列表
				var $priContentWrap = $this.closest(".pri-content-wrap");
				$priContentWrap.find(".pri-updown-gray-icon").removeClass("up").addClass("down");
				$priContentWrap.find(".pri-channel-list-wrap").hide();
				$target.find(".pri-select-channel-wrap").animate({
					height: 0
				},500,function(){
					$this.removeClass("up").addClass("down");
				});
			}
		});
	}
	//打开关闭频道推荐
	initOpenClose(".pri-support-content-wrap");
	initOpenClose(".pri-channel-content-wrap");

	//获取频道列表，svip到5才调用
	// function initChannel(){
	// 	$.ajax({
	// 		url:"/service/web/support/channels",
	// 		cache:false,
	// 		dataType:'json',
	// 		success:function(rsp){
	// 			var _channelHtml = template("channelTpl",rsp);
	// 			$channelListWrap.find(".pri-channel-list").html(_channelHtml);
	// 			$supportChannelListWrap.find(".pri-channel-list").html(_channelHtml);
	// 			getSubChannel(rsp.data[0].sid,function(rsp){
	// 				var _subchannelHtml = template("subchannelTpl",rsp);
	// 				$channelListWrap.find(".pri-subchannel-list").html(_subchannelHtml);
	// 				$supportChannelListWrap.find(".pri-subchannel-list").html(_subchannelHtml);
	// 			});
	// 		}
	// 	});
	// };
	
	// function getSubChannel(sid,callback){
	// 	$.ajax({
	// 		url:"/service/web/support/subchannels",
	// 		cache:false,
	// 		data:{
	// 			sid:sid
	// 		},
	// 		dataType:'json',
	// 		success:function(rsp){
	// 			callback && callback(rsp);
	// 		}
	// 	})
	// }

	var $channelListWrap = $(".channel-list-wrap"),
		$supportChannelListWrap = $(".support-channel-list-wrap");
	//点击大频道拉取子频道，点击子频道，显示选择的频道跟子频道的名字跟id
	// $channelListWrap.on("click",".pri-channel-list a",function(){
	// 	var $li = $(this).parent();
	// 	if($li.hasClass("active")){
	// 		return ;
	// 	}
	// 	$li.addClass("active").siblings().removeClass("active");
	// 	getSubChannel($(this).data("sid"),function(){
	// 		var _subchannelHtml = template("subchannelTpl",rsp);
	// 		$channelListWrap.find(".pri-subchannel-list").html(_subchannelHtml);
	// 	});
	// }).on("click",".pri-subchannel-list a",function(){
	// 	var $this = $(this);
	// 	var $target = $this.closest(".pri-select-channel-wrap").find(".pri-channel-name");
	// 	$target.data("sid",$this.data("sid")).data("ssid",$this.data("ssid"));
	// 	var _channelName = $this.closest(".pri-subchannel-list").siblings(".pri-channel-list").find("li.active").data("name");
	// 	$target.text(_channelName+"(ID:"+$this.data("sid")+")"+$this.data("name")+"(ID:"+$this.data("ssid")+")");
	// });
	// //点击大频道拉取子频道，点击子频道，显示选择的频道跟子频道的名字跟id
	// $supportChannelListWrap.on("click",".pri-channel-list a",function(){
	// 	var $li = $(this).parent();
	// 	if($li.hasClass("active")){
	// 		return ;
	// 	}
	// 	$li.addClass("active").siblings().removeClass("active");
	// 	getSubChannel($(this).data("sid"),function(){
	// 		var _subchannelHtml = template("subchannelTpl",rsp);
	// 		$supportChannelListWrap.find(".pri-subchannel-list").html(_subchannelHtml);
	// 	});
	// }).on("click",".pri-subchannel-list a",function(){
	// 	var $this = $(this);
	// 	var $target = $this.closest(".pri-select-channel-wrap").find(".pri-channel-name");
	// 	$target.data("sid",$this.data("sid")).data("ssid",$this.data("ssid"));
	// 	var _channelName = $this.closest(".pri-subchannel-list").siblings(".pri-channel-list").find("li.active").data("name");
	// 	$target.text(_channelName+"(ID:"+$this.data("sid")+")"+$this.data("name")+"(ID:"+$this.data("ssid")+")");
	// });

	//点击显示或者隐藏频道
	$(".pri-select-channel-wrap").on("click",".pri-updown-gray-icon",function(){
		var $this = $(this);
		//打开频道选择
		if($this.hasClass("down")){
			$this.parent().siblings(".pri-channel-list-wrap").show();
			$this.removeClass("down").addClass("up");
		}
		//关闭频道选择
		else if($this.hasClass("up")){
			$this.parent().siblings(".pri-channel-list-wrap").hide();
			$this.removeClass("up").addClass("down");
		}
	});

	//点击频道推荐 的 推广按钮
	$(".pri-channel-ok").click(function(){
		var _imid = $("#channelImid").val();
		var _sid = $("#channelSid").val();
		var _ssid = $("#channelSSid").val();
		var _title = $("#channelTitle").val();
		var _img = $("#uploadImage").attr("src");
		var _date = $("#channelTime").val();
		if(!_imid){
			errorAlert("请填写主播的yy号");
			return ;
		}
		if(!_sid){
			errorAlert("请填写频道号");
			return ;
		}
		if(!_ssid){
			errorAlert("请填写子频道号");
			return ;
		}
		$.ajax({
			url:"/service/web/wonder/setRec",
			cache:false,
			data:{
				imid: _imid,
				imgUrl: _img,
				title: _title,
				sid: _sid,
				ssid: _ssid,
				start:_date+" 00:00:00",
				end:_date+" 23:59:59"
			},
			dataType:'json',
			success:function(rsp){
				dialog.showMsgBox(rsp.desc);
			}
		});
	});
	//点击撑场设置 的 确定按钮
	$(".pri-support-ok").click(function(){
		var _sid = $("#channelSid").val();
		var _ssid = $("#channelSSid").val();
		var _time = $("#supportTimeTail").val();

		$.ajax({
			url:"/service/web/support/setsupport",
			cache:false,
			data:{
				sid:$channelName.data("sid"),
				ssid:$channelName.data("ssid"),
				start:date+" "+_time,
				end:date+" "
			},
			dataType:'json',
			success:function(rsp){
				if(rsp.result){

				}
				else{
					errorAlert(rsp.desc);
				}
			}
		})
	});

	template.helper("getPrivilegeValue",function(type,info){
		if(!info.allCurrentPrivileges){
			return "暂无";
		}
		for(var i=info.allCurrentPrivileges.length - 1; i>=0 ; i--){
			if(type == info.allCurrentPrivileges[i].type){
				return $.parseJSON(info.allCurrentPrivileges[i].config).count;
			}
		}
		return "暂无";
	});

	login.getUserInfo(function(info){
		console.log(info);
		if(info.result){
			var svipInfo = info.data.info;
			svipInfo.privileges = info.data.privileges;
			$(".current-svip-stage-wrap").html(template("svipStageTpl",svipInfo));
			$(".next-svip-stage-wrap").html(template("nextGradePriTypeTpl",svipInfo.privileges));

			//到达相应的svip等级才显示频道跟撑场设置
			//5级显示撑场设置
			// svipInfo.svipStage.stage_id = 6;
			if(svipInfo.svip && svipInfo.svipStage.stage_id >= 5){
				// initChannel();
				$(".pri-box4").show();
				//6级显示频道推荐
				if(svipInfo.svipStage.stage_id >= 6){
					$(".pri-box3").show();
				}
			}
		}
	});

	//特权领取
	$(".pri-draw-content-wrap").on("click","a",function(){
		var pid = $(this).data("pid");
		$.ajax({
			url:"/service/web/prividraw/draw",
			cache:false,
			data:{
				priviId:pid
			},
			dataType:'json',
			success:function(rsp){
				errorAlert(rsp.desc);
			}
		})
	});

	//推荐历史
	$("#channelHistory").click(function(){
		$.ajax({
			url:"/service/web/wonder/myRec",
			cache:false,
			dataType:'json',
			success:function(rsp){

			}
		});
	});
	//撑场历史
	$("#supportHistory").click(function(){
		$.ajax({
			url:"/service/web/wonder/myRec",
			cache:false,
			dataType:'json',
			success:function(rsp){
				
			}
		});
	});

	window.uploadHandler = function(rsp){
		if(rsp.result){
			$("#uploadImage").attr("src",rsp.data);
			$(".pre-image-container").show();
		}
		else{
			alert(rsp.desc);
		}
	}

	$(".pri-img-close-icon").click(function(){
		$(".pre-image-container").hide();
	});

	$("#uploadImgBtn").on("change",function(){
		$("#imgUploadForm").submit();
	});
});