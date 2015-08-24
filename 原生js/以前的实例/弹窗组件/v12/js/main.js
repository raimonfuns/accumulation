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
        });

        win.on("alert", function () { alert("you click the alert button"); });
        win.on("alert", function () { alert("this second alert handler"); });
        win.on("alert", function () { alert("this third alert handler"); });
        win.on("close", function () { alert("you click the close button"); });
        win.on("close", function () { alert("this second close handler"); });
    });
});