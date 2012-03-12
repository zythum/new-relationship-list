/**
 * make an ajax request
 * @id STK.core.io.ajax
 * @alias STK.core.io.ajax
 * @param {Object} 	{
		'url': '',
		'charset': 'UTF-8',
		'timeout': 30 * 1000,
		'args': {},
		'onComplete': null,
		'onTimeout': null,
		
		'onFail': null,
		'method': 'get', // post or get
		'asynchronous': true,
		'contentType': 'application/x-www-form-urlencoded',
		'responseType': 'text'// xml or text or json
	};
 * @return {Void} 
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.io.ajax({
	'url':'/ajax.php',
	'args':{'id':123,'test':'true'},
	});
 */

$Import('core.io.getXHR');
$Import('core.obj.parseParam');
$Import('core.util.URL');
$Import('core.json.jsonToQuery');
$Import('core.func.empty');
STK.register('core.io.ajax', function($){
	return function(oOpts){
		var opts = $.core.obj.parseParam({
			'url': '',
			'charset': 'UTF-8',
			'timeout': 30 * 1000,
			'args': {},
			'onComplete': null,
			'onTimeout': $.core.func.empty,
			'uniqueID': null,
			
			'onFail': $.core.func.empty,
			'method': 'get', // post or get
			'asynchronous': true,
			'header' : {},
			'isEncode' : false,
			'responseType': 'json'// xml or text or json
		}, oOpts);
		
		if (opts.url == '') {
			throw 'ajax need url in parameters object';
		}
		
		var tm;
		
		var trans = $.core.io.getXHR();
		
		var cback = function(){
			if (trans.readyState == 4) {
				clearTimeout(tm);
				var data = '';
				if (opts['responseType'] === 'xml') {
						data = trans.responseXML;
				}else if(opts['responseType'] === 'text'){
						data = trans.responseText;
				}else {
					try{
						if(trans.responseText && typeof trans.responseText === 'string'){
							data = eval('(' + trans.responseText + ')');
						}else{
							data = {};
						}
					}catch(exp){
						data = opts['url'] + 'return error : data error';
						// throw opts['url'] + 'return error : syntax error';
					}

				}
				if (trans.status == 200) {
					if (opts['onComplete'] != null) {
						opts['onComplete'](data);
					}
				}else if(trans.status == 0){
					//for abort;
				} else {
					if (opts['onFail'] != null) {
						opts['onFail'](data, trans);
					}
				}
			}
			else {
				if (opts['onTraning'] != null) {
					opts['onTraning'](trans);
				}
			}
		};
		trans.onreadystatechange = cback;
		
		if(!opts['header']['Content-Type']){
			opts['header']['Content-Type'] = 'application/x-www-form-urlencoded';
		}
		if(!opts['header']['X-Requested-With']){
			opts['header']['X-Requested-With'] = 'XMLHttpRequest';
		}
		
		if (opts['method'].toLocaleLowerCase() == 'get') {
			var url = $.core.util.URL(opts['url'],{
				'isEncodeQuery' : opts['isEncode']
			});
			url.setParams(opts['args']);
			url.setParam('__rnd', new Date().valueOf());
			trans.open(opts['method'], url, opts['asynchronous']);
			try{
				for(var k in opts['header']){
					trans.setRequestHeader(k, opts['header'][k]);
				}
			}catch(exp){
			
			}
			trans.send('');
			
		}
		else {
			trans.open(opts['method'], opts['url'], opts['asynchronous']);
			try{
				for(var k in opts['header']){
					trans.setRequestHeader(k, opts['header'][k]);
				}
			}catch(exp){
			
			}
			trans.send($.core.json.jsonToQuery(opts['args'],opts['isEncode']));
		}
		if(opts['timeout']){
			tm = setTimeout(function(){
				try{
					trans.abort();
				}catch(exp){
					
				}
				opts['onTimeout']({}, trans);
				opts['onFail'](data, trans);
			}, opts['timeout']);
		}
		return trans;
	};
});
