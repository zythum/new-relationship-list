/**
 * @author liusong@staff.sina.com.cn
 */

STK.register('common.trans.map',function($){
		var t = $.kit.io.inter();
		var g = t.register;
		g('getInternalInfo', {'url':'http://api.weibo.com/2/location/geocode/is_domestic.json', 'method': 'get', 'varkey': 'callback', 'requestMode': 'jsonp'});	// URL OK	
		return t;
});