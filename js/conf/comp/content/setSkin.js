/**
 * 模板管理
 * @author 非反革命|zhaobo@staff.sina.com.cn
 * @example
 * @history
 * 2011.10.21 zhaobo REQ-9439 商务模板需求
 */
$Import('kit.extra.language');
$Import('common.depand.setSkin');
$Import('common.skin.business');
STK.register('comp.content.setSkin', function($) {
	return function(node) {
		var sizzle = $.core.dom.sizzle;
		var setSkin = sizzle('[node-type="set_skin"]', node)[0];
		var require = $.common.depand.setSkin;
		var skinManager;
		var locked = false;
		var asynSetSkin = require.bind('asyn_skinManager', function(skinId){
			locked = false;
			skinId = typeof skinId !== "string" ? undefined : skinId;
			skinManager = skinManager || $.common.skin.skinManager();
			skinManager.show(skinId=="setskin" ? undefined : skinId);
		}, {'onTimeout': function(){locked = false;}});
		
		var setSkinFunc = function(skinId){
			if(locked){ return; }
			locked = true;
			asynSetSkin(skinId);
		};
		
		var setSkinFuncHandle = function(skinId){
			$.preventDefault();
			setSkinFunc(skinId);
		};
		
		$.addEvent(setSkin, "click", setSkinFuncHandle);          //注册发微博点击事件
		
		if(window.location.href.match(/setskin/)){
			setSkinFunc("setskin");
		}else{
			var params = window.location.search.replace("?", "");
			params = $.core.json.queryToJson(params);
			if(params.skinId){
				//modify by zhaobo 201110211555 REQ-9439
				//modify by lianyi 201110251606 validate legal business skin 
				var isBusiness = params.skinId.match(/skin3/) && window.$CONFIG && window.$CONFIG['skin'] == params.skinId; 
				if (isBusiness){
					$.common.skin.business({pid:params.skinId});
				}else{
					setSkinFunc(params.skinId);
				}
			}
		}

		var that = {};
		that.destroy = function() {
			$.removeEvent(setSkin, "click", setSkinFuncHandle);
			publish.destroy();
		};
	};
});