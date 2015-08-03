define(function (require) {
    var a = require('a');
    var b = require('b');

    (function () {
        a.alertA();
        b.alertB();
    })();
});