/**
* 合并参数
* @id STK.kit.extra.count
* @alias STK.kit.extra.count
* @param 
* @param 
* @author WK | wukan@staff.sina.com.cn
* @example
* $.kit.extra.count('aaaaaa');
*/

STK.register('kit.extra.count',function($){


	function getLength(str){

		//surl为http://t.cn/12345678
		var min = 41,max = 140,surl = 20,tmp = str;
		var urls = str.match(/http:\/\/[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+([-A-Z0-9a-z_\$\.\+\!\*\(\)\/,:;@&=\?\~\#\%]*)*/gi) || [];
		var urlCount = 0;
		for (var i = 0,len = urls.length; i < len; i++) {
			var count = $.core.str.bLength(urls[i]);
			if (/^(http:\/\/t.cn)/.test(urls[i])) {
				continue;
			} else {
				if (/^(http:\/\/)+(t.sina.com.cn|t.sina.cn)/.test(urls[i]) || /^(http:\/\/)+(weibo.com|weibo.cn)/.test(urls[i])) {
					urlCount += count <= min ? count : (count <= max ? surl : (count - max + surl));
				} else {
					urlCount += count <= max ? surl : (count - max + surl);
				}
			}
			tmp = tmp.replace(urls[i], "");
		}
		var result = Math.ceil((urlCount + $.core.str.bLength(tmp)) / 2);
		//$.log('rs = '+result);
		return result;
	};

	return function(str){
		//过滤回车，firefox回车算1字符\n，IE算俩\n\r
		str = str.replace(/\r\n/g,'\n');
		return num = getLength(str);
	};
});

