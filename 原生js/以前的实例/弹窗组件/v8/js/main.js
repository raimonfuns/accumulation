require.config({
    paths: {
        'jquery': "jquery-1.7.1.min"
    }
});
require(['jquery', 'window'], function ($, w) {
    $('#btn').click(function () {
        new w.Window().alert({
            title: "提示",
            content: "welcome!",
            handle: function () {
                alert("you click the button");
            },
            width: 300,
            height: 150,
            y: 50,
            hasCloseBtn: true,
            handle4AlertBtn: function () {
                alert("you click the alert button");
            },
            handle4CloseBtn: function () {
                alert("you click the close button");
            }
        });
    });
});