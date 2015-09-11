define(function(require,exports,module){
	require('script/common/login_topbar');
	var login = require('script/common/login');
	var login_piece = require('views/mold/logic/showprivi/login_piece');

	console.log(login_piece);
	login.getUserInfo(function(info){
		$('.login-box').append(login_piece(info));
	});

	var ua = navigator.userAgent.toLowerCase();
	var isLowversion = ua.match(/(msie 9.0|msie 8.0|msie 7.0|msie 6.0)/i) != null;

	$.fn.extend({
		onAnimateEnd:function(c){
			$(this).on('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationend',function(){
				if (c) c();
			});
		}
	});


	if (isLowversion) {
		$('.center-icon,.revolve-icon').show();
	}else{
		var image=new Image();
		image.src='http://file.do.yy.com/group3/M00/A1/BF/tz0GSFXr5o2ARDk7AADwS3kpBc4564.png';
		if (image.complete) {
			startUp();
		}else{
			image.onload=function(){
				startUp();
			}	
		};


		
		function startUp() {
			var center1=$('.center-01'),
				center2=$('.center-02'),
				center3=$('.center-03'),
				idenEven=$('.identity-box .revolve-icon:even'),
				idenOdd=$('.identity-box .revolve-icon:odd');
				addEven=$('.addition-box .revolve-icon:even'),
				addOdd=$('.addition-box .revolve-icon:odd'),
				intNote=$('.interact-box .revolve-icon');
			var addHeight=$('.addition-box').offset().top-100;
			var intHeight=$('.interact-box').offset().top-100;

			function firstRun() {
				center1.show().addClass('animate drop').onAnimateEnd(function(){
					center1.removeClass('animate drop');
					idenEven.show().addClass('animate enlarge').onAnimateEnd(function(){
						idenEven.removeClass('animate enlarge');
						idenOdd.show().addClass('animate enlarge').onAnimateEnd(function(){
							idenOdd.removeClass('animate enlarge')
						});
					});
				});
			}

			firstRun();

			$(window).scroll(function(){
				var _this=$(this);
				var scrollTop = _this.scrollTop();
			　　var scrollHeight = $(document).height();
			　　var windowHeight = _this.height();
				if (_this.scrollTop()<addHeight&&center1.is(':hidden')) {
					firstRun();
				};

				if (scrollTop>=addHeight&&scrollTop<intHeight&&center2.is(':hidden')) {
					center2.show().addClass('animate rise').onAnimateEnd(function(){
						center2.removeClass('animate rise');
						addEven.show().addClass('animate enlarge').onAnimateEnd(function(){
							addEven.removeClass('animate enlarge');
							addOdd.show().addClass('animate enlarge').onAnimateEnd(function(){
								addOdd.removeClass('animate enlarge')
							});
						});
					});
					
				};

				if ((scrollTop>=intHeight||scrollTop+windowHeight==scrollHeight)&&center3.is(':hidden')) {
					center3.show().addClass('animate shift').onAnimateEnd(function(){
						center3.removeClass('animate shift');
						intNote.show().addClass('animate enlarge').onAnimateEnd(function(){
							intNote.removeClass('animate enlarge');
						});
					});
				};

				if (scrollTop<addHeight&&center3.is(':visible')) $('.center-03,.interact-box .revolve-icon').hide();
				if (scrollTop==0&&center2.is(':visible')) $('.center-02,.addition-box .revolve-icon').hide();
				if (scrollTop>addHeight&&center1.is(':visible')) $('.center-01,.identity-box .revolve-icon').hide();
			});

			$('.revolve-icon').hover(function(){
				$(this).addClass('turn');
			},function(){
				$(this).removeClass('turn');
			});
		}
	};
});