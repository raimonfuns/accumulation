require.config({
    paths: {
        'jquery': 'jquery-1.7.1.min',
        'jqueryUI': 'jquery-ui.min'
    }
});
require(['jquery', 'window'], function ($, w) {
    $('#btn').click(function () {
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
});