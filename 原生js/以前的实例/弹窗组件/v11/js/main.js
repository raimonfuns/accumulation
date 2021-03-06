require.config({
    paths: {
        'jquery': 'jquery-1.7.1.min',
        'jqueryUI': 'jquery-ui.min'
    }
});
require(['jquery', 'window'], function ($, w) {
    $('#btn').click(function () {
        new w.Window().alert({
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
            handle4AlertBtn: function () {
                alert("you click the alert button");
            },
            handle4CloseBtn: function () {
                alert("you click the close button");
            }
        });
    });
});