var klass = require('./klass');

exports.add = function (klasses) {
    klasses.forEach(function (item, index) {
        var _klass = item;
        var teacherName = item.teacherName;
        var student = item.students;
    });
    klass.add(teacherName, student);
}

url.resolve('http://imooc.com/', '/course/list')