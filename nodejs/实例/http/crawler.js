var http = require('http');
var cheerio = require('cheerio');
var url = 'http://www.imooc.com/learn/348';

function fileterCharters(html) {
    var $ = cheerio.load(html);
    var chapters = $('.learnchapter');
    var courseData = [];

    chapters.each(function (item) {
        var chapter = $(this);
        var chaptersTitle = chapter.find('strong').text();
        var videos = chapter.find('.video').children('li');
        var chapterData = {
            chaptersTitle: chaptersTitle,
            videos: []
        };

        videos.each(function (item) {
            var video = $(this).find('.studyvideo');
            var videoTitle = video.text();
            var id = video.attr('href').split('video/')[1];

            chapterData.videos.push({
                title: videoTitle,
                id: id
            });
        });

        courseData.push(chapterData);
    });

    return courseData;
} 

function printCourseInfo(courseData) {
    courseData.forEach(function (item) {
        var chaptersTitle = item.chaptersTitle;

        console.log(chaptersTitle + '\n');

        item.videos.forEach(function (video) {
            console.log('   [' + video.id + '] ' + video.title + '\n');
        });
    });
}

http.get(url, function (res) {
    var html = '';

    res.on('data', function (data) {
        html += data;
    })

    res.on('end', function () {
        var courseData = fileterCharters(html);
        printCourseInfo(courseData);
    })
}).on('error', function () {
    console.log('获取课程数据出错！');
});