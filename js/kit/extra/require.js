/**
 * 异步加载管理模块
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 * @example
 * 	//常规用法(推荐)
 * 	var rm = $.kit.extra.require;
 * 	rm.register('xx', ['ex.kit.xx']);
 * 	var myFun = rm.bind('xx', function(a, b){});
 * 	myFun(a, b);
 * 
 */
STK.register('kit.extra.require', function($){
//	$.log = function(str){
//		if ('console' in window) {
//			console.info ? console.info(str) : console.log(str);
//		}
//	};
//	$.log('kit.extra.require 加载！！');
	
	var $CONFIG = window.$CONFIG || {};
	
	var LOADED	= 'loaded',
		WAITING	= 'waiting',
		LOADING	= 'loading';
	
	/**
	 * 依赖状态列表,以depeKey值做Key
	 * { depeKey: { urlList{Array<String>}: [], bindFuns{Array<Function>}: [], unReadyNum{Number}: 0 }, timeoutFuns{Array<Function>: [] }}
	 */
	var depeKeyMap		= {},
	
		/**
		 * 依赖所含URL状态列表,以依赖所包含的文件URL做Key
		 * { url: { depeKeys{Array<String>}: [], state{String}: 'WAITING', retry{Number}: 0 }}
		 */
		depeUrlMap		= {},
		/**
		 * 等待加载的URL队列
		 */
		waitingQueue	= [],
		/**
		 * 正在加载中的URL队列
		 */
		loadingQueue	= [],
		/**
		 * 是否正在主动加载中
		 */
		activeLoading	= false;
	
	/**
	 * 全局配置项
	 */
	var conf = {
		/**
		 * 最大允许并行通道数,默认为4;空闲加载时默认只会加载maxLine-1个文件，预留1个
		 */
		'maxLine': 4,
		/**
		 * 文件加载失败后最大重试次数,默认为1;
		 */
		'maxRetryTimes': 1,
		/**
		 * 基础URL,默认为weiboJS基础路径
		 */
		'baseURL': $CONFIG['jsPath'],
		/**
		 * 文件版本号
		 */
		'version': $CONFIG['version'],
		/**
		 * 文件加载最大超时时间
		 */
		'timeout': 30000,
		/**
		 * {Function} url拼写规则,默认形参顺序(baseURL, url, version),返回realURL{String}
		 */
		'urlRule': null
	};
	
	/**
	 * 检验数组元素是否重复
	 * 注：核心包内unique函数效率太低
	 * @param {Array} arr
	 */
	var isUnique = function(arr){
		var temp = {}, key;
		for(var i = arr.length; i--;){
			key = arr[i];
			if(temp[key]){ return false; }
			temp[key] = 1;
		}
		return true;
	};
	
	/**
	 * 简单的URL验证
	 */
	var isURL = function(url){
		var reg = /^http[s]?:\/\//ig;
		return reg.test(url);
	};
	
	/**
	 * 从加载队列中删除指定url
	 */
	var delLoading = function(url){
		var index = $.core.arr.indexOf(url, loadingQueue);
		if (index !== -1) {
			return loadingQueue.splice(index, 1);
		}
		return false;
	};
	
	/**
	 * 内部默认使用的URL拼写规则(urlRule)
	 */
	var getRealURL = function(url){
		if(typeof conf['urlRule'] === 'function'){
			return conf['urlRule'](conf['baseURL'], url, conf['version']);
		} else {
			url = url.replace(/\./ig,'/');
			return conf['baseURL'] + 'home/js/' + url + '.js?version=' + conf['version'];
		}
	};
	
	/**
	 * 加载器,用于加载指定url的资源
	 */
	var loader = function(url){
//		$.log('loader 开始：'+ url);
		loadingQueue.push(url);
		depeUrlMap[url].state = LOADING;
		var onComplete = function(){
//			$.log('loader 结束[加载成功]：'+ url);
			var depeKeys = depeUrlMap[url].depeKeys,
				depeKeyItem, aKey, funObj;
			delLoading(url);
			depeUrlMap[url].state = LOADED;
			activeLoading && activeLoad();
			//检测依赖关系状态
			for(var i = depeKeys.length; i--;){
				aKey = depeKeys[i];
				depeKeyItem = depeKeyMap[aKey];
				depeKeyItem.unReadyNum -= 1;
				//如果当前依赖关系已经没有待加载的文件了，则认为依赖已经Ready
				if (depeKeyItem.unReadyNum) { return; }
				while (depeKeyMap[aKey].bindFuns.length) {
					funObj = depeKeyItem.bindFuns.shift();
//					$.log('loader 结束 后依赖检测完成：'+ aKey);
					funObj['func'].apply({}, [].concat(funObj['data']));
				}
			}
		};
		
		var onTimeout = function(){
//			$.log('loader 结束[加载失败]：'+ url);
			var depeUrlItem = depeUrlMap[url],
				depeKeyItem, depeKeys, aKey, func;
			delLoading(url);
			depeUrlItem.state = WAITING;
			if (depeUrlItem.retry < conf['maxRetryTimes']) {
				depeUrlItem.retry += 1;
				return loader(url);
			}
			activeLoading && activeLoad();
			depeKeys = depeUrlItem.depeKeys;
			for (var i = depeKeys.length; i--;) {
				aKey = depeKeys[i];
				depeKeyItem =  depeKeyMap[aKey];
				while (depeKeyItem.timeoutFuns.length) {
					func = depeKeyItem.timeoutFuns.shift();
					func.call({}, aKey);
				}
			}
		};
		
		$.core.io.scriptLoader({
			'url'		: isURL(url) ? url : getRealURL(url),
			'timeout'	: conf['timeout'],
			'onComplete': onComplete,
			'onTimeout'	: onTimeout
		});
	};
	
	/**
	 * 异步加载核心函数
	 * @param {String} depeKey
	 * @param {Function} func
	 * @param {Object} data
	 * @param {Object} spec
	 */
	var require = function(depeKey, func, data, spec){
		var depeKeyItem = depeKeyMap[depeKey];
		if (!depeKeyItem) {
			$.log('[STK.kit.extra.require]: The depend ' + depeKey + ' is undefined!');
		}
		if(!depeKeyItem['unReadyNum']){
			$.log('依赖关系已加载完成：'+depeKey);
			return func.apply({}, [].concat(data));
		}
		depeKeyItem['bindFuns'].push({'func': func, 'data': data});
		if (spec && typeof spec['onTimeout'] === 'function') {
			depeKeyItem['timeoutFuns'].push(spec['onTimeout']);
		}
		for(var i = depeKeyItem['urlList'].length; i--;){
			aUrl = depeKeyItem['urlList'][i];
			if (depeUrlMap[aUrl].state === WAITING) {
				depeUrlMap[aUrl].retry = 0;
				loader(aUrl);
			}
		}
	};
	
	/**
	 * 依赖关系注册
	 * @param {String} depeKey
	 * @param {Array} depes
	 * @param {Object} spec
	 */
	var register = function(depeKey, depes, spec){
//		$.log('kit.extra.require 注册register：'+depeKey);
		if (depeKeyMap[depeKey] !== undefined) {
			$.log('[STK.kit.extra.require]: ' + depeKey + ' has been registered!');
		}
		if (!isUnique(depes)) {
			$.log('[STK.kit.extra.require]: The depend URLs is not unique! The depes is [' + depes + ']');
		}
		var aUrl, readyNum = 0;
		spec = $.parseParam({
			'activeLoad': false
		}, spec || {});
		
		for (var i = depes.length; i--;) {
			aUrl = depes[i];
			if (!depeUrlMap[aUrl]) {
				depeUrlMap[aUrl] = { 'depeKeys': [depeKey], 'state': WAITING, 'retry': 0 };
				spec['activeLoad'] && waitingQueue.push(aUrl);
			}
			else {
				depeUrlMap[aUrl].depeKeys.push(depeKey);//如果同一个dependList内有重复的url可能会隐患
				if(depeUrlMap[aUrl].state === LOADED){
					readyNum += 1;
				}
			}
		}
		depeKeyMap[depeKey] = {
			'urlList': depes,
			'bindFuns': [],
			'timeoutFuns': [],
			'unReadyNum': depes.length - readyNum
		};
		return depeKeyMap[depeKey];
	};
	
	/**
	 * 主动加载"待加载"队列内的js
	 */
	var activeLoad = function(){
		if (!waitingQueue.length) {
			activeLoading = false;
			return;
		}
//		$.log('----------------->activeLoad');
		activeLoading = true;
		var freeLine = conf['maxLine'] - 1 - loadingQueue.length, aUrl;
		while (freeLine > 0 && waitingQueue.length) {
			aUrl = waitingQueue.shift();
			if (depeUrlMap[aUrl].state === WAITING) {
				loader(aUrl);
				freeLine -= 1;
			}
		}
	};
	
	/**
	 * 全局配置
	 * @param {Object} spec
	 */
	var config = function(spec){
		conf = $.core.json.merge(conf, spec);
	};
	
	/**
	 * 依赖关系绑定
	 * @param {String} depeKey
	 * @param {Function} func 需要绑定依赖关系的函数
	 * @param {Object} spec
	 * @return {Function} 形参同func
	 */
	var bind = function(depeKey, func, spec){
		if (typeof func !== 'function') {
			throw '[STK.kit.extra.require]: The "func" musts be a Function!';
		}
		return function(data0 /*, data1, data2, data3, ...*/){
			require(depeKey, func, [].slice.call(arguments), spec);
		};
	};
	
	require.bind = bind;
	require.config = config;
	require.register = register;
	require.activeLoad = activeLoad;
	return require;
});