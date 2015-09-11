define(function(require, exports, module){
	require('script/common/login_topbar');
	require('script/common/login_piece');
	var ad = require('script/extends/jquery.slide');

	/**
	 ***************************
	 * 幻灯片
	 ***************************
	 */	
	ad({
		slideId:'#ad-slide',
		sign:'curr'
	});

	/**
	 ***************************
	 * 尊贵席位
	 ***************************
	 */	
	$.getJSON('/service/web/index/getRankList', {type: 1}, function (rsp) {
		processRankDate('all', rsp.data);	
	});

	/**
	 ***************************
	 * 本月贡献
	 ***************************
	 */	
	$.getJSON('/service/web/index/getRankList', {type: 2}, function (rsp) {
		processRankDate('month', rsp.data);
	});

	// 处理数据
	function processRankDate(type, data) {

		// 占位
		while(data.length < 20) {
			data.push({
				logoUrl: 'http://dl.vip.yy.com/yyvippicture/webvipcom/128.png',
				nickName: '路人甲'
			});
		}


		var $rankList = $(type == 'all' ? '#allListMod' : '#monthListMod').find('.rankList');
		var btnWrap = $('.btnWrap');
		var pagehtmlContent1 = '';
		var pagehtmlContent2 = '';
		var htmlTemp = '';
		$.each(data, function (idx, v) {
			var bgEvenColorClass = (idx + 1) % 2 == 0 ? ' class="even"' : '';
			// var tIcon = idx <= 2 ? '<a href="#" class="icon-t dib"></a>' : '';  // t榜先不做
			if (type == 'all') {
				var iconClass = 'iconLeftList ';
				iconClass +=  idx == 0 ? 'icon-first-diamond' :
						 	  idx == 1 ? 'icon-second-diamond' :
						 	  idx == 2 ? 'icon-third-diamond' : 'icon-normal-diamond';
			} else {
				var iconClass = 'iconRightList ';
				iconClass +=  idx == 0 ? 'icon-first-medal' :
							  idx == 1 ? 'icon-second-medal' :
							  idx == 2 ? 'icon-third-medal' : 'icon-normal-medal';
			}
			htmlTemp =  '<li' + bgEvenColorClass + '>' +
							'<span class="' + iconClass + ' dib">' + (idx + 1) + '</span>' +
							'<span class="dib"><img class="round-portrait" src="' + v.logoUrl + '"></span>' +
							'<span class="userName dib">' + v.nickName + '</span>' +
							// tIcon + 
						'</li>';
			if (idx <= 9) {
				pagehtmlContent1 += htmlTemp;
			} else {
				pagehtmlContent2 += htmlTemp;
			} 
		});
		$rankList.eq(0).html(pagehtmlContent1);
		$rankList.eq(1).hide().html(pagehtmlContent2);
		
		// 如果不超出一页
		if (data.length <= 10) {
			btnWrap.eq(type == 'all' ? 0 : 1).hide();
		}

		// 显示按钮排行榜切换翻页
		btnWrap.delegate('a', 'click', function () {
			var $this = $(this);
			$this.addClass('btn-active').siblings().removeClass('btn-active');
			$this.closest('.rankListMod').find('.rankList').hide().eq($(this).index()).show()
		});
	}
});