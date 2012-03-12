$Import("core.obj.parseParam");
$Import('core.str.parseURL');
$Import('core.json.queryToJson');
$Import('core.json.jsonToQuery');
STK.register('core.util.URL', function($){
	/**
	 * @example
	 *	alert(
	 *		STK.core.util.URL('http://abc.com/a/b/c.php?a=1&b=2#a=1').
	 *		setParam('a', 'abc').
	 *		setHash('a', 67889).
	 *		setHash('a1', 444444)
	 *	);
	 *	// http://abc.com/a/b/c.php?a=abc&b=2#a=67889&a1=444444
	 * @author FlashSoft | fangchao@staff.sina.com.cn
	 */
	return function(sURL,args){
		var opts = $.core.obj.parseParam({
			'isEncodeQuery'	 : false,
			'isEncodeHash'	 : false
		},args||{});
		var that = {};
		var url_json = $.core.str.parseURL(sURL);
		
		
		var query_json = $.core.json.queryToJson(url_json.query);
		
		var hash_json = $.core.json.queryToJson(url_json.hash);
		
		
		
		that.setParam = function(sKey, sValue){
			query_json[sKey] = sValue;
			return this;
		};
		that.getParam = function(sKey){
			return query_json[sKey];
		};
		that.setParams = function(oJson){
			for (var key in oJson) {
				that.setParam(key, oJson[key]);
			}
			return this;
		};
		that.setHash = function(sKey, sValue){
			hash_json[sKey] = sValue;
			return this;
		};
		that.getHash = function(sKey){
			return hash_json[sKey];
		};
		that.valueOf = that.toString = function(){
			var url = [];
			var query = $.core.json.jsonToQuery(query_json, opts.isEncodeQuery);
			var hash = $.core.json.jsonToQuery(hash_json, opts.isEncodeQuery);
			if (url_json.scheme != '') {
				url.push(url_json.scheme + ':');
				url.push(url_json.slash);
			}
			if (url_json.host != '') {
				url.push(url_json.host);
				if(url_json.port != ''){
					url.push(':');
					url.push(url_json.port);
				}
			}
			url.push('/');
			url.push(url_json.path);
			if (query != '') {
				url.push('?' + query);
			}
			if (hash != '') {
				url.push('#' + hash);
			}
			return url.join('');
		};
		
		return that;
	};
});
