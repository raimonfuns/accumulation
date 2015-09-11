define(function(require, exports, module){
	require('script/common/login_topbar');
	require('script/common/login_piece');
	var dialog = require("script/extends/dialog/dialog");
	var template = require('script/lib/template.min');
	var pages=require('script/common/paging');

	function log(value) {
		console.log(value);
	}

	/*
     *******************************
     * 全局变量
     *******************************
     */
    //选项卡index
    var tabIndex = 0;
	/*
     *******************************
     * 任务列表
     *******************************
     */
    function initTable(url, type) {
    	if (type == 1) {
    		pages({
				url: url,
				cistern:'.task-paging',
		        callback:function(json){   
	    			updateTable(json, 1);
		        }
			});
    	} else if (type == 2) {
    		$.ajax({
	            url: url,
	            type: "GET",
	            dataType: "json",
	            cache: false,
	            success: function(json){
	                updateTable(json, 2);
	            }
	        });
    	}
			
	}

	initTable('/service/web/support/tasklist', 1);

	function updateTable(json, type) {
		// 测试数据
		var json = {
			result: true,
			data: {
				list: [
					{
						task_name: '2080新手任务',
						task_id: 1000,
						sid: 2080,
						ssid: 1000,
						url: 'http://baidu.com',
						task_status: -1,
						taskStatus: -1

					},
					{
						task_name: '2081撑场任务',
						task_id: 1001,
						sid: 2081,
						ssid: 1000,
						url: 'http://baidu.com',
						task_status: 0,
						taskStatus: 0

					},
					{
						task_name: '2082撑场任务',
						task_id: 1002,
						sid: 2082,
						ssid: 1000,
						url: 'http://baidu.com',
						task_status: 2,
						taskStatus: 2

					},
					{
						task_name: '2081撑场任务',
						task_id: 1001,
						sid: 2081,
						ssid: 1000,
						url: 'http://baidu.com',
						task_status: 3,
						taskStatus: 3

					},
					{
						task_name: '2082撑场任务',
						task_id: 1002,
						sid: 2082,
						ssid: 1000,
						url: 'http://baidu.com',
						task_status: -1,
						taskStatus: -1

					},
					{
						task_name: '2081撑场任务',
						task_id: 1001,
						sid: 2081,
						ssid: 1000,
						url: 'http://baidu.com',
						task_status: -1,
						taskStatus: -1

					},
					{
						task_name: '2082撑场任务',
						task_id: 1002,
						sid: 2082,
						ssid: 1000,
						url: 'http://baidu.com',
						task_status: -1,
						taskStatus: -1

					},
					{
						task_name: '2082撑场任务',
						task_id: 1002,
						sid: 2082,
						ssid: 1000,
						url: 'http://baidu.com',
						task_status: -1,
						taskStatus: -1

					}
				]
			}
		};     	
		if (json.result) {
			json.data.type = type;
		} else {
			json.data.list = null;
		}
		var result = template('tplTaskList', json.data);
		$('#task-list-wrap').html(result);
	}

	// 切换列表
	$('.task-nav-ul').on('click', 'li', function () {
		var	index = $(this).index();
		if (tabIndex == index) return false;
		$(this).addClass('curr').siblings().removeClass('curr');
		tabIndex = index;
		index == 0 ? initTable('/service/web/support/tasklist', 1) : 					// 撑场任务
		index == 1 ? initTable('/service/web/tasksystem/tasklist?type=6', 2) : 	// 新手任务
		index == 2 ? initTable('/service/web/support/finishedTask', 1) : 				// 已完成的撑场任务
					 initTable('/service/web/tasksystem/mytask', 2);				// 我的任务
	});
	/*
     *******************************
     * 全局变量
     *******************************
     */
    var $taskListWrap = $('#task-list-wrap');

	/*
     *******************************
     * 展开收起效果
     *******************************
     */
	$taskListWrap.on('click', '.table-row', function () {
		var $this = $(this);
		if ($this.find('i').is('.up')) {
			$this.find('i').removeClass('up').addClass('dw');
			$this.next().hide();
		}else{
			$(this).parent().find('i').removeClass('up').addClass('dw').end().find('.table-note').hide();
			$(this).find('i').removeClass('dw').addClass('up');
			$this.next().show();
		};
	});

	/*
     *******************************
     * 领取任务
     *******************************
     */
    // 撑场任务
    $taskListWrap.on('click', '.getType1TaskBtn', function () {
    	var $this = $(this);
    	var taskId = $this.data('task-id');
    	var sid = $this.data('task-sid');
    	var ssid = $this.data('task-ssid');
    	$.ajax({
            url: '/service/web/support/gottask',
            type: "GET",
            dataType: "json",
            data: {taskId: taskId},
            success: function(rsp){
            	rsp.result = true;
            	if (rsp.result) {
            		$this.replaceWith('<a class="goToTask" href="yy://pd-[sid=' + sid + '&subid=' + ssid + '">前往</a>');
            	} else {
            		dialog.showMsgBox(rsp.desc);
            	}
            }
        });
    	return false;
    });

    // 新手任务
    $taskListWrap.on('click', '.getType2TaskBtn', function () {
    	var $this = $(this);
    	var taskId = $this.data('task-id');
    	var url = $this.data('task-url');
    	$.ajax({
            url: '/service/web/support/gottask',
            type: "GET",
            dataType: "json",
            data: {taskId: taskId},
            success: function(rsp){
            	rsp.result = true;
            	if (rsp.result) {
            		$this.replaceWith('<a class="goToTask" href="' + url + '" target="_blank">前往</a>');
            	} else {
            		dialog.showMsgBox(rsp.desc);
            	}
            }
        });
    	return false;
    });

    /*
     *******************************
     * 前往任务取消冒泡
     *******************************
     */
    $taskListWrap.on('click', '.goToTask', function (e) {
    	e.stopPropagation();
    });

});