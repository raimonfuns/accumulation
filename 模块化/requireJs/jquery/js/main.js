require.config({
    paths: {
        "jquery": "http://libs.baidu.com/jquery/2.1.1/jquery.min"
    },
    shim: {
        "jquery.say": ["jquery"]
    }
});

require(["jquery"], function ($) {
    $(function () {
        // alert("jquery载入成功");
    });
});

require(["jquery", "jquery.say"], function ($) {
    $(function () {
        alert("jquery载入成功");
        $().sayName();
    });
});