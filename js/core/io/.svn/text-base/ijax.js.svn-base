$Import("core.obj.parseParam");
$Import("core.func.empty");
$Import("core.io.getIframeTrans");
$Import("core.util.getUniqueKey");
$Import("core.util.URL");

STK.register('core.io.ijax', function($){
	return function(spec){
		var conf, trans, uniqueID, timer, destroy, getData, that;
		
		conf = $.core.obj.parseParam({
			'url'			: '',
			'form'			: null,
			'args'			: {},
			'uniqueID'		: null,
			'timeout'		: 30 * 1000,
			'onComplete'	: $.core.func.empty,
			'onTimeout'		: $.core.func.empty,
			'onFail'		: $.core.func.empty,
			'asynchronous'	: true,
			'isEncode'		: true,
			'abaurl'		: null,
			'responseName'	: null,
			'varkey'		: 'callback',
			'abakey'		: 'callback'
		}, spec);
		
		that = {};
		
		if (conf.url == '') {
			throw 'ijax need url in parameters object';
		}
		if(!conf.form){
			throw 'ijax need form in parameters object';
		}
		
		trans = $.core.io.getIframeTrans();
		
		
		/*----parameters ball shit----*/
		uniqueID = conf.responseName || ('STK_ijax_' + $.core.util.getUniqueKey());
		getData = {};
		getData[conf['varkey']] = uniqueID;
		if(conf.abaurl){
			conf.abaurl = $.core.util.URL(conf.abaurl).setParams(getData);
			getData = {};
			getData[conf['abakey']] = conf.abaurl;
		}
		conf.url = $.core.util.URL(conf.url,{
			'isEncodeQuery' : conf['isEncode']
		}).setParams(getData).setParams(conf.args);
		/*----end parameters ball shit----*/
		
		
		destroy = function(){
			window[uniqueID] = null;
			trans.destroy();
			trans = null;
			clearTimeout(timer);
		};
		
		timer = setTimeout(function(){
			destroy();
			conf.onTimeout();
			conf.onFail();
		}, conf.timeout);
		
		
		window[uniqueID] = function(oResult, query) {
			destroy();
			conf.onComplete(oResult, query);
		};
		
		
		conf.form.action = conf.url;
		conf.form.target = trans.getId();
		conf.form.submit();
		
		that.abort = destroy;
		
		return that;
		
	};
});