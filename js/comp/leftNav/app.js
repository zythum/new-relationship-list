/**
 * @author Lianyi | lianyi@staff.sina.com.cn
 * 左导(用户自定义应用模块) 
 */
$Import('comp.leftNav.appMore');
$Import('module.imgDynamicDownload');

STK.register('comp.leftNav.app', function($){
	return function(node){
		var that = {} , delegate , appMore;

		var argsCheck = function(){
			if(!$.isNode(node)) {
				throw "左导自定义应用需要传入节点对象";
				return true;				
			}
		};

		var bindDOMFuns = {
			mouseoverNode : function (evt) {
				$.module.imgDynamicDownload(node);
				$.removeEvent(node, 'mouseover', bindDOMFuns.mouseoverNode);
			}
		};

		var parseDOM = function() {
			delegate = $.delegatedEvent(node);		
		};

		var bindDOM = function() {
			appMore = $.comp.leftNav.appMore(node , delegate);
			$.addEvent(node, 'mouseover', bindDOMFuns.mouseoverNode);
		};
		
		var destroy = function() {
			//appMore.destroy();
		};
		
		var init = function() {
			var code = argsCheck();
			if(code) {
				return;				
			}
			parseDOM();
			bindDOM();
		};
		
		init();
		
		that.destroy = destroy;
		
		return that;
	}
});