// 问：既然在模块内引用依赖文件需要使用require语法，那么这里的deps参数有什么作用的???
// 答：经过提取操作后，构建工具就可以调用任何 JS 压缩工具来进行压缩了，require 参数也可以被压缩成任意字符。
// https://github.com/seajs/seajs/issues/426、
// 下面是测试
define(['a', 'b'], function (raimon) {
    var a = raimon('a');
    var b = raimon('b');

    (function () {
        a.alertA();
        b.alertB();
    })();
});
// 结论：require可以随意压缩