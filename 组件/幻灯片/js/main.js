require.config({
    paths: {
        'jquery': 'jquery-1.7.1.min',
        'jquery.easing': 'jquery.easing.1.3'
    }
});
require(['jquery', 'slider'], function ($, s) {
    $(function () {
        // 幻灯片1
        new s.Slider({
        	element: '#slider1'
        });

        // 幻灯片2
        new s.Slider({
        	element: '#slider2',
        	triggerType: 'hover',
        	delay: 200,
        	autoPlay: true,
        	interval: 3000,
        	loop: true
        });  

        // 幻灯片2
        new s.Slider({
            element: '#slider3',
            triggerType: 'hover',
            delay: 200,
            autoPlay: true,
            interval: 3000,
            effect: 'fade'            
        });  
    }); 
});