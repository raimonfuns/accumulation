define(function (require) {
    var b = require('b');
    var alertA = function () {
        alert('a');
    }
    return {
        alertAB: function () {
            alertA();
            b.alertB();
        }
    }
});