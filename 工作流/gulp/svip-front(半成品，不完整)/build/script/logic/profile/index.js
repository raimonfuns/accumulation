define(function(require, exports, module){
	require('script/common/login_topbar');
	require('script/common/login_piece');
	var login = require('script/common/login');
	var template = require("script/lib/template.min.js");

	$(function () {

		function log(value) {
			console.log('----------------------------------------------');
			console.log('----------------------------------------------');
			console.log(value);
			console.log('----------------------------------------------');
			console.log('----------------------------------------------');
		}

		/**
		 ***************************
		 * 格式化时间
		 ***************************
		 */
		Date.prototype.format =function (format){
			var o = {
			"M+" : this.getMonth() + 1, //month
			"d+" : this.getDate(), //day
			"h+" : this.getHours(), //hour
			"m+" : this.getMinutes(), //minute
			"s+" : this.getSeconds(), //second
			"q+" : Math.floor((this.getMonth() + 3) / 3), //quarter
			"S" : this.getMilliseconds() //millisecond
			}
			if(/(y+)/.test(format)) {
				format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));	// yyyy-mm-dd -> eg: 2015-mm-dd
			}
			for(var k in o) {
				if(new RegExp("("+ k +")").test(format)) {
					format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
				}	
			}
			return format;
		}

		/**
		 ***************************
		 * 初始化页面数据
		 ***************************
		 */
		login.getUserInfo(function (userInfo) {


			data = userInfo.data;
			// log(data);
			// 没有登录时

			if (!data) {
				data = {};
				data.info = {};
				data.privileges = {};
			}

			var isVip = data.info.svip || false;


			// 选取元素
			var $infoNumber = $('.infoNumber');
			// 贡献值
			$infoNumber.eq(0).text(data.info.contributionValue || 0);
			// 全网排名
			$infoNumber.eq(1).text(data.info.rank || 0);
			// 每日成长值加成
			$infoNumber.eq(2).text(data.privileges.extraVipScore || 0);
			// 距下一级还需要值
			$infoNumber.eq(3).text(data.info.needContributionValue4NextGrade || 0);
			// 距xx卡还需要值	
			$infoNumber.eq(4).text(data.info.needContributionValue4NextStage || 0);

			// 不是金钻，把数据设置为0，不往下执行
			if (!isVip) {
				$('.silver .infoDesc').text('距还需贡献值');
				$('#consumeLimit').text(0);
				$('.monthContrib').text(0);
				return false;
			}

			// 下一阶段的名称
			var stageName = ['银卡', '至尊银卡', '金卡', '至尊金卡', '白金卡', '紫金卡'][data.info.svipStage.stage_id];
			
			$('.silver .infoDesc').text(data.info.svipStage.stage_id !== 6 ? '距' + stageName + '还需贡献值' : '已经是最高级别');

			// 金钻等级
			$('#vipLevel').text('vip' + data.info.svipLevel.level_id);		

			// 更新曲线图		
			var vipValueArray  = [0, 480, 1288, 12888, 188888, 1888888, 2000000];
			var lineWidthArray = [0, 112, 218, 331, 435, 520, 604];
			var b = [18, 4, -10, -30, -38, -46]; // 调整值
			var $graphWrap = $('.graphWrap');
			var $line = $graphWrap.find('.line');
			var $vipLevels = $('.vipLevel').find('li');
			var $vipLevelTexts = $('.vipLevelText').find('li');
			var $triangleBox = $('.triangleBox');
			var duration = 800;
			var vipValue = data.info.contributionValue; // 贡献值
			$.each(vipValueArray, function (i, item) {
				if (vipValue >= vipValueArray[i] && vipValue < vipValueArray[i + 1] ) {
					var unitValue = vipValueArray[i + 1] - vipValueArray[i];
					var unitWidth = lineWidthArray[i + 1] - lineWidthArray[i];
					var disValue = vipValue - vipValueArray[i];
					var disWidth = disValue/unitValue * unitWidth;
					var vipWidth = parseInt(lineWidthArray[i] + disWidth);
					
					// 改变黄线的宽度
					$line.animate({
						width: vipWidth 
					}, duration, function () {
						// 点亮vip等级
						$vipLevels.removeClass('goldColor').eq(i).addClass('goldColor');
						$vipLevelTexts.removeClass('goldColor').eq(i).addClass('goldColor');
						$triangleBox.css({bottom: parseInt(0.35 * vipWidth) + b[i]}).show();
					});
						
					return false;
				} else if (vipValueArray[i] == 2000000) {
					// 大于最大值
					$line.animate({
						width: 612
					}, duration, function () {
						$vipLevels.removeClass('goldColor').eq(i).addClass('goldColor');
						$vipLevelTexts.removeClass('goldColor').eq(i).addClass('goldColor');
						$triangleBox.css({bottom: parseInt(0.34 * 612) + b[5]}).show();
					});
				}
			});			

			// 过期时间
			$('.expiredDate').text((new Date(data.info.expiredDate)).format("yyyy-MM-dd"));

			// 最低消费
			$('#consumeLimit').text(data.info.nextSVipStage.consume_limit);

			// 本月贡献值
			$('.monthContrib').text(data.info.currentMonthContributionValue);
		});
		
		/**
		 ***************************
		 * 最新消息
		 ***************************
		 */
		$.getJSON('/service/web/mail/getLastestWebMails', function (rsp) {
			// 测试数据
			// rsp.data = {
			// 	list: [
			// 		{
			// 			m_url: '#',
			// 			m_time: 1415782800,
			// 			m_title: "万万没想到，3周年活动还有第4场，点击查看礼品派送专场>>"
			// 		},
			// 		{
			// 			m_url: '#',
			// 			m_time: 1415782800,
			// 			m_title: "万万没想到，3周年活动还有第4场，点击查看礼品派送专场>>"
			// 		}
			// 	]
			// };

			// 无消息记录
			if (!rsp.data || rsp.data.list.length == 0) {
				$('#msgListWrap').html('<tr><td colspan=3>暂无消息记录</td></tr>');
				return false;
			}

			var htmlContent = '';
			$.each(rsp.data.list, function (idx, v) {
				var dateTime = new Date(v.m_time * 1000); //就得到普通的时间了
				var dateTimeFormat = dateTime.format("yyyy-MM-dd");
				var bgEvenColorClass = (idx + 1) % 2 == 0 ? ' class="even"' : '';
				htmlContent += '<tr' + bgEvenColorClass + '><td>' + dateTimeFormat + '</td><td><a href=' + v.m_url + ' target="_blank">' + v.m_title + '</a></td></tr>';
			});
			$('#msgListWrap').html(htmlContent);
			
		});
		

		/**
		 ***************************
		 * 最新消费(最近一个月)
		 ***************************
		 */
		var end = new Date();
		var start = end.getTime() - 24 * 60 * 60 * 1000 * 30;
		var endTime = end.format("yyyy-MM-dd hh:mm:ss");
		var startTime = new Date(start).format("yyyy-MM-dd hh:mm:ss");
		$.getJSON('/service/web/payhistory/list', {start: startTime, end: endTime, currentPage: 1, numPage: 5}, function (rsp) {
			// 测试数据
			// rsp.data = {
			// 	list: [
			// 		{
			// 			time: 1415782800,
			// 			content: '复活卡充值',
			// 			money: '350.00'
			// 		},
			// 		{
			// 			time: 1415782800,
			// 			content: '复活卡充值',
			// 			money: '350.00'
			// 		}
			// 	]
			// };
			
			// 无消费记录
			if (!rsp.data || rsp.data.list.length == 0) {
				$('#payListWrap').html('<tr><td colspan=3>暂无消费记录</td></tr>');
				return false;
			}

			var htmlContent = '';
			$.each(rsp.data.list, function (idx, v) {
				var dateTime = new Date(v.time * 1000); //就得到普通的时间了
				var dateTimeFormat = dateTime.format("yyyy-MM-dd");
				var bgEvenColorClass = (idx + 1) % 2 == 0 ? ' class="even"' : '';
				htmlContent += '<tr' + bgEvenColorClass + '><td>' + dateTimeFormat + '</td><td>' + v.content + '</td><td>￥' + v.money + '</td></tr>';
			});
			$('#payListWrap').html(htmlContent);
		});

		/**
		 ***************************
		 * 任务中心
		 ***************************
		 */
		$.getJSON('/service/web/support/tasklist', {currentPage: 1, numPage: 3}, function (rsp) {
			// 测试数据
			var rsp = {
				data: {
					list: [
						{
							sid: '2147',
							beginTime: 1415782800,
							taskId: 1000,
							publishImid: '909014859',
							award: '+2'
						},
						{
							sid: '2147',
							beginTime: 1415782800,
							taskId: 1001,
							publishImid: '909014859',
							award: '+2'
						},
						{
							sid: '2147',
							beginTime: 1415782800,
							taskId: 1002,
							publishImid: '909014859',
							award: '+2'
						}
					]
				}
			};
			rsp.data.list = $.map(rsp.data.list, function (item) {

				item.beginTime = new Date(item.beginTime * 1000).format('yyyy-MM-dd hh:mm:ss');
				return item;
			});
			if (rsp.data.list.length != 0) {
				$('.taskList').html(template('tplTaskList', rsp.data));
			} else {
				$('.taskList').html('<p style="text-align: center;">暂时没有任务</p>')
			}

			// 领取任务
			$('.taskList').on('click', '.acceptTaskBtn', function () {
				var taskId = $(this).data('task-id');
				$.getJSON('/service/web/support/gottask', {taskId: taskId}, function (rsp) {
					log(rsp);
				});
			});
		});

	});
});
