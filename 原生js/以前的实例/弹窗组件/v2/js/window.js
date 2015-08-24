define(['jquery'], function ($) {
    function Window() {

    }

    Window.prototype = {
        alert: function () {
            alert('hi');
        },
        confirm: function () {

        },
        prompt: function () {

        }
    }

    return {
        Window: Window
    }
});