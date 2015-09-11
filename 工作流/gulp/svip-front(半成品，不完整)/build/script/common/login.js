define(function(require, exports, module) {
	require.async('http://res.udb.duowan.com/lgn/js/oauth/udbsdk/pcweb/udb.sdk.pcweb.popup.min.js');
	var userinfo,userLogo,userZZInfo;

	$.ajax({
		url: "/service/web/index/vinfo",
		type: 'GET',
		cache: false,
		dataType: 'json',
		success: function(json) {
			userinfo = json;
		}
	});

	function getUserInfo(callback){
		if (typeof callback === "function") {
			if (!userinfo) {
				window.setTimeout(function() {
					getUserInfo(callback)
				}, 30);
			} else {
				callback(userinfo);
			}
		}
	}

	exports.getUserInfo=getUserInfo;

	function getHost(url) {
		var host = "null";
		if (typeof url == "undefined" || null == url) url = window.location.href;
		var regex = /.*\:\/\/([^\/]*).*/;
		var match = url.match(regex);
		if (typeof match != "undefined" && null != match) host = match[1];
		return host;
		host=regex=match=null;
	}

	var host = "http://" + getHost();
	window.showUdbLogin = exports.showUdbLogin = function() {
		UDB.sdk.PCWeb.popupOpenLgn(host + '/service/web/auth/prelogin', host + '/service/web/auth/udblogin', host + '/service/web/auth/fail');
	}
	window.udbLogout = exports.udbLogout = function() {
		$.getScript(host + "/service/web/auth/logout");
	}
	window.udb_callback = exports.udb_callback = function(cookieURL) {
		UDB.sdk.PCWeb.writeCrossmainCookieWithCallBack(cookieURL,
			function() {
				if (document.location.href.indexOf("/login") >= 0) {
					document.location = "/index";
					return false;
				} else {
					if (typeof window.onLoginSuccess == "function") {
						onLoginSuccess();
					} else {
						document.location.reload();
					}
				}

			}
		);
	}
});