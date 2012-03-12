/**
 * make an jsonp request
 * @id STK.core.io.jsonp
 * @alias STK.core.io.jsonp
 * @param {Object} 	{
		'url': '',
		'charset': 'UTF-8',
		'timeout': 30 * 1000,
		'args': {},
		'onComplete': null,
		'onTimeout': null,
		'responseName': null,
		'varkey':null
		'onFail': null
		
	};
 * @return {Void} 
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.io.jsonp({
	'url':'/jsonp.php',
	'args':{'id':123,'test':'true'},
	});
 */
$Import('core.obj.parseParam');
$Import('core.io.scriptLoader');
$Import('core.util.getUniqueKey');
STK.register('core.io.jsonp', function($){
	
	return function(oOpts){
		var opts = $.core.obj.parseParam({
			'url': '',
			'charset': 'UTF-8',
			'timeout': 30 * 1000,
			'args': {},
			'onComplete': null,
			'onTimeout': null,
			'responseName': null,
			'isEncode' : false,
			'varkey': 'callback'
		}, oOpts);
		// -1为默认, 1为完成, 2为超时
		var funcStatus = -1;
		
		var uniqueID = opts.responseName || ('STK_' + $.core.util.getUniqueKey());
		
		opts.args[opts.varkey] = uniqueID;
		
		var completeFunc = opts.onComplete;
		var timeoutFunc = opts.onTimeout;
		
		
		window[uniqueID] = function(oResult) {
			if(funcStatus != 2 && completeFunc != null) {
				funcStatus = 1;
				completeFunc(oResult);
			}
		};
		opts.onComplete = null;
		opts.onTimeout = function() {
			if(funcStatus != 1 && timeoutFunc != null) {
				funcStatus = 2;
				timeoutFunc();
			};
		};
		
		return $.core.io.scriptLoader(opts);
	};
});
