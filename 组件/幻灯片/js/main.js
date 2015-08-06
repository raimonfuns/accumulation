require.config({
    paths: {
        'jquery': 'jquery-1.7.1.min'
    }
});
require(['jquery', 'slider'], function ($, s) {
    $(function () {
        (new s.Slider()).render();  
    }); 
});