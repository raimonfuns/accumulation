require.config({
    paths: {
        'jquery': 'http://lib.sinaapp.com/js/jquery/1.9.1/jquery-1.9.1.min'
    },
    shim: {
        'test': {
            exports: "_"
        }
    }
});
require(['jquery'], function ($) {
    $(function () {
        alert('load finished');
    });
});
require(['test'], function (_) {
    _.foo();
});