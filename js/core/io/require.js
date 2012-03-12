/**
 *	author Robin Young |yonglin@staff.sina.com.cn
 */

$Import('core.io.scriptLoader');
$Import('core.arr.foreach');
$Import('core.arr.indexOf');

STK.register('core.io.require', function($){
	var baseURL = 'http://js.t.sinajs.cn/STK/js/';
	
	var checkNS = function(obj, NS){
		var NSList = NS.split('.');
		var step = obj;
		var k = null;
		while(k = NSList.shift()){
			step = step[k];
			if(step === undefined){
				return false;
			}
		}
		return true;
	};
	
	var loadingList = [];
	
	var loadSource = function(url){
		if($.core.arr.indexOf(url, loadingList) !== -1){
			return false;
		}
		loadingList.push(url);
		$.core.io.scriptLoader({'url' : url, 'callback' : function(){
			$.core.arr.foreach(loadingList, function(value, index){
				if(value === url){
					loadingList.splice(index, 1);
					return false;
				}
			});
		}});
		return false;
	};
	
	var require = function(dependList, fn, data){
		var tm = null;
		
		for(var i = 0, len = dependList.length; i < len; i += 1){
			var item = dependList[i];
			if(typeof item === 'string'){
				if(!checkNS($, item)){
					loadSource(baseURL + item.replace(/\./ig,'/') + '.js');
				}
			} else {
				if(!checkNS(window, item['NS'])){
					loadSource(item['url']);
				}
			}
		}
		var checkDepend = function(){
			for(var i = 0, len = dependList.length; i < len; i += 1){
				var item = dependList[i];
				if(typeof item === 'string'){
					if(!checkNS($, item)){
						tm = setTimeout(checkDepend, 25);
						return false;
					}
				} else {
					if(!checkNS(window, item['NS'])){
						tm = setTimeout(checkDepend, 25);
						return false;
					}
				}
			}
			clearTimeout(tm);
			fn.apply({},[].concat(data));
		};
		tm = setTimeout(checkDepend, 25);
		
	};
	
	require.setBaseURL = function(url){
		if(typeof url !== 'string'){
			throw '[STK.kit.extra.require.setBaseURL] need string as frist parameter';
		}
		baseURL = url;
	};
	return require;
	
});