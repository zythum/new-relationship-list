/**
 * 加载js并监听结果
 * @id STK.core.io.scriptLoader
 * @alias STK.core.io.scriptLoader
 * @param {Object} oOpts 附加参数
 * @return {Element} scriptLoader的句柄对象
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * STK.core.io.scriptLoader('http://js.wcdn.cn/t3/platform/_html/json.js', {
 * 'onComplete': function(oData, sVarName){
 * console.dir(oData);
 * },
 * 'varname': 'json'
 * });
 */

$Import('core.obj.parseParam');
$Import('core.dom.removeNode');
$Import('core.util.getUniqueKey');
$Import('core.func.empty');
$Import('core.util.URL');
STK.register('core.io.scriptLoader', function($){
	var entityList = {};
	var default_opts = {
		'url': '',
		'charset': 'UTF-8',
		'timeout': 30 * 1000,
		'args': {},
		'onComplete': $.core.func.empty,
		'onTimeout': null,
		'isEncode' : false,
		'uniqueID': null
	};
	
	return function(oOpts){
		var js, requestTimeout;
		var opts = $.core.obj.parseParam(default_opts, oOpts);
		
		if (opts.url == '') {
			throw 'scriptLoader: url is null';
		}
		
		
		var uniqueID = opts.uniqueID || $.core.util.getUniqueKey();
		
		
		js = entityList[uniqueID];
		if (js != null && $.IE != true) {
			$.core.dom.removeNode(js);
			js = null;
		}
		if (js == null) {
			js = entityList[uniqueID] = $.C('script');
		}
		
		js.charset = opts.charset;
		js.id = 'scriptRequest_script_' + uniqueID;
		js.type = 'text/javascript';
		if (opts.onComplete != null) {
			if ($.IE) {
				js['onreadystatechange'] = function(){
					if (js.readyState.toLowerCase() == 'loaded' || js.readyState.toLowerCase() == 'complete') {
						try{
							clearTimeout(requestTimeout);
							document.getElementsByTagName("head")[0].removeChild(js);
							js['onreadystatechange'] = null;
						}catch(exp){
							
						}
						opts.onComplete();
					}
				};
			}
			else {
				js['onload'] = function(){
					try{
						clearTimeout(requestTimeout);
						$.core.dom.removeNode(js);
					}catch(exp){}
					opts.onComplete();
				};
				
			}
			
		}
		
		js.src = STK.core.util.URL(opts.url,{
			'isEncodeQuery' : opts['isEncode']
		}).setParams(opts.args);
		
		document.getElementsByTagName("head")[0].appendChild(js);
		
		if (opts.timeout > 0 && opts.onTimeout != null) {
			requestTimeout = setTimeout(function(){
				try{
					document.getElementsByTagName("head")[0].removeChild(js);
				}catch(exp){
					
				}
				opts.onTimeout();
			}, opts.timeout);
		}
		return js;
	};
});
