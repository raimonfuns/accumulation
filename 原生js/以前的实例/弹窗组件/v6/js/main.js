require.config({
    paths: {
        'jquery': "jquery-1.7.1.min"
    }
});
require(['jquery', 'window'], function ($, w) {
    $('#btn').click(function () {
        new w.Window().alert({
            content: "welcome!",
            handle: function () {
                alert("you click the button");
            },
            width: 300,
            height: 150,
            y: 50
        });
    });
});