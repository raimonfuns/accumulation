require.config({
    paths: {
        'jquery': "jquery-1.7.1.min"
    }
});
require(['jquery', 'window'], function ($, w) {
    $('#btn').click(function () {
        new w.Window().alert("welcome!");
    });
});