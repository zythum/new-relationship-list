/**
 * @author Lianyi | lianyi@staff.sina.com.cn
 * 左导通用绑定鼠标事件 
 */
$Import('kit.dom.parseDOM');
$Import('common.layer.leftNavPopup');

STK.register('comp.leftNav.appMore', function($){
	return function(node , dEvt){
		var that		= {},
			mouseOverTimer;
		
		var argsCheck = function(){
			if(!$.isNode(node)) {
				throw "左导自定义应用需要传入节点对象";
				return true;				
			}
			if (!dEvt) {
				throw "左导自定义应用需要传入delegate对象";
				return true;
			}
		};
		
		var parseDOM = function() {
			var ls = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(ls.list);
		};
		
		var bindDOMFuns = {
			showPopup : function(rec) {
				if(rec.data.name){
					var el = $.E("leftNav_moreBtn_" + rec.data.name);
					if(el.style.display != 'none') {
						return;
					}
					var param = {
						attachment : rec.el
					};
					switch(rec.data.name){
						case 'assigned':
							param.align = 'bl';
							param.fixedX = 37;
							param.fixedY = 27;
							break;
						case 'myapps':
							param.align = 'bl';
							param.fixedX = 37;
							param.fixedY = 26;
							break;
						case 'mygames':
							param.align = 'bl';
							param.fixedX = 37;
							param.fixedY = 26;
							break;
					}
					$.common.layer.leftNavPopup(el, param);
				}
			},
			morePopup : function(rec){
				clearTimeout(mouseOverTimer);
				mouseOverTimer = setTimeout(function() {
					bindDOMFuns.showPopup(rec);
				} , 300);
			},
			cancelMorePopup : function() {
				clearTimeout(mouseOverTimer);
			}
		};
						
		var bindDOM = function() {
			dEvt.add("more", "mouseover", bindDOMFuns.morePopup);
			dEvt.add("more", "mouseout", bindDOMFuns.cancelMorePopup);
		};
		
		var destroy = function() {
			dEvt && dEvt.destroy();
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