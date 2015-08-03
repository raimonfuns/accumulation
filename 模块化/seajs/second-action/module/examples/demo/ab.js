define(function (require) {
    var $ = require('jquery');
    var a = require('./a');
    var b = require('./b');

    $(function () {
        a.alertA();
        b.alertB();
    });
});