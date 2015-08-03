require.config({
    paths: {
        'jquery': "jquery-1.7.1.min"
    }
});
require(['window'], function (w) {
    new w.Window().alert();
});