require.config({
    paths: {
        'jquery': 'jquery-1.7.1.min',
        'jqueryUI': 'jquery-ui.min'
    }
});
require(['jquery', 'window'], function ($, w) {
    $('#a').click(function () {
        var win = new w.Window();
        win.alert({
            title: "提示",
            content: "welcome!",
            text4AlertBtn: "OK",
            dragHandle: ".window_header",
            handle: function () {
                alert("you click the button");
            },
            width: 300,
            height: 150,
            y: 50,
            hasCloseBtn: true,
            skinClassName: "window_skin_a",
            handler4AlertBtn: function () { alert("you click the alert button"); },
            handler4CloseBtn: function () { alert("you click the close button"); }
        }).on("alert", function () { 
            alert("this second alert handler"); 
        }).on("close", function () { 
            alert("this second close handler");
        });
    });
    
    $('#b').click(function () {
        new w.Window().confirm({
            width: 300,
            height: 150,
            y: 50,
            title: "系统消息",
            content: "您确定要删除这个文件吗？",
            dragHandle: ".window_header",
            // skinClassName: "window_skin_a",
            text4ConfirmBtn: "是",
            text4CancelBtn: "否",
        }).on("comfirm", function () { 
            alert("确定"); 
        }).on("cancel", function () { 
            alert("取消");
        });
    });
});