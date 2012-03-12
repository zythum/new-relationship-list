/**
 * browser test
 * @id STK.core.util.bLength
 * @alias STK.core.util.bLength
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.util.browser.IE = true;
 * STK.core.util.browser.MOZ = true;
 */
STK.register('core.util.browser', function($){
	var ua = navigator.userAgent.toLowerCase();
	var external = window.external || '';
	var core, m, extra, version, os;

	var numberify = function(s) {
		var c = 0;
		return parseFloat(s.replace(/\./g, function() {
			return (c++ == 1) ? '' : '.';
		}));
	};
	try{
        if ((/windows|win32/i).test(ua)) {
            os = 'windows';
        } else if ((/macintosh/i).test(ua)) {
            os = 'macintosh';
        } else if ((/rhino/i).test(ua)) {
            os = 'rhino';
        }

		if((m = ua.match(/applewebkit\/([^\s]*)/)) && m[1]){
			core = 'webkit';
			version = numberify(m[1]);
		}else if((m = ua.match(/presto\/([\d.]*)/)) && m[1]){
			core = 'presto';
			version = numberify(m[1]);
		}else if(m = ua.match(/msie\s([^;]*)/)){
			core = 'trident';
			version = 1.0;
			if ((m = ua.match(/trident\/([\d.]*)/)) && m[1]) {
				version = numberify(m[1]);
			}
		}else if(/gecko/.test(ua)){
			core = 'gecko';
			version = 1.0;
			if((m = ua.match(/rv:([\d.]*)/)) && m[1]){
				version = numberify(m[1]);
			}
		}

		if(/world/.test(ua)){
			extra = 'world';
		}else if(/360se/.test(ua)){
			extra = '360';
		}else if((/maxthon/.test(ua)) || typeof external.max_version == 'number'){
			extra = 'maxthon';
		}else if(/tencenttraveler\s([\d.]*)/.test(ua)){
			extra = 'tt';
		}else if(/se\s([\d.]*)/.test(ua)){
			extra = 'sogou';
		}
	}catch(e){}
	
	var ret = {
		'OS':os,
		'CORE':core,
		'Version':version,
		'EXTRA':(extra?extra:false),
		'IE': /msie/.test(ua),
		'OPERA': /opera/.test(ua),
		'MOZ': /gecko/.test(ua) && !/(compatible|webkit)/.test(ua),
		'IE5': /msie 5 /.test(ua),
		'IE55': /msie 5.5/.test(ua),
		'IE6': /msie 6/.test(ua),
		'IE7': /msie 7/.test(ua),
		'IE8': /msie 8/.test(ua),
		'IE9': /msie 9/.test(ua),
		'SAFARI': !/chrome\/([\d.]*)/.test(ua) && /\/([\d.]*) safari/.test(ua),
		'CHROME': /chrome\/([\d.]*)/.test(ua),
		'IPAD':/\(ipad/i.test(ua),
		'IPHONE':/\(iphone/i.test(ua),
		'ITOUCH':/\(itouch/i.test(ua),
		'MOBILE':/mobile/i.test(ua)
	};
	return ret;
});
