/**
 * 颜色选择器回调函数
 * @author 非反革命|zhaobo@staff.sina.com.cn
 * @example
 */

$Import("kit.extra.language");
STK.register("common.skin.provColorPicker", function($) {
	//---常量定义区----------------------------------
	var lang = $.kit.extra.language;
	var TEMPLATE = lang('<div style="display:none;z-index:10001;" class="choose_side_bg">' +
					'<div node-type="color_list" class="color_list">' +
					'   <a node-type="setColor" action-type="setColor" action-data="color=black&hex=000000" href="#"><span style="background:black"></span></a>' +
					'   <a node-type="setColor" action-type="setColor" action-data="color=gray&hex=808080" href="#"><span style="background:gray"></span></a>' +
					'   <a node-type="setColor" action-type="setColor" action-data="color=pink&hex=ff6666" href="#"><span style="background:pink"></span></a>' +
					'   <a node-type="setColor" action-type="setColor" action-data="color=purple&hex=9900cc" href="#"><span style="background:purple"></span></a>' +
					'   <a node-type="setColor" action-type="setColor" action-data="color=blue&hex=0080ff" href="#"><span style="background:blue"></span></a>' +
					'   <a node-type="setColor" action-type="setColor" action-data="color=white&hex=ffffff" href="#"><span style="background:white"></span></a>' +
					'   <a node-type="setColor" action-type="setColor" action-data="color=red&hex=ff0000" href="#"><span style="background:red"></span></a>' +
					'   <a node-type="setColor" action-type="setColor" action-data="color=orange&hex=ff6600" href="#"><span style="background:orange"></span></a>' +
					'   <a node-type="setColor" action-type="setColor" action-data="color=yellow&hex=ffcc00" href="#"><span style="background:yellow"></span></a>' +
					'   <a node-type="setColor" action-type="setColor" action-data="color=green&hex=009900" href="#"><span style="background:green"></span></a>' +
					'</div>' +
					'<p class="btn"><a action-type="okBtn" class="W_btn_a" href="#"><span>#L{确定}</span></a></p>' +
				'</div>');
	//-------------------------------------------
	return function(opts) {
		var that = {}, node, DEvent, DOM, initialized = false, selectedObj, opened = false, panelHeight = 0;
		$.custEvent.define(that, ['selected']);
		var parseDOM = function(){
			var _html = $.core.util.easyTemplate(TEMPLATE).toString();
			node = $.core.dom.insertHTML(document.body,_html);
			DOM = $.kit.dom.parseDOM($.builder(node).list);
			panelHeight = $.core.dom.getSize(node).height;
			DEvent = $.core.evt.delegatedEvent(node);
		};
		var bindDOMFuns = {
			setColorClick : function(obj){
				var el = obj.el;
				$.foreach(DOM['setColor'], function(val, i){
					$.core.dom.removeClassName(val, "current");
				});
				$.core.dom.addClassName(el, "current");
				selectedObj = [obj.data.color, obj.data.hex];
				$.preventDefault();
				return false;
			},
			okClick : function(){
				if(!selectedObj) return;
				$.custEvent.fire(that, 'selected', selectedObj);
				hide();
				$.preventDefault();
				return false;
			},
			bodyClick : function(event){
				if(!opened) return;
				event = $.fixEvent(event);
				if(!$.contains(node, event.target) && !$.contains(opts.target , event.target)) {
					$.log("provColorPicker hide");
					hide();
				}
			}
		};
		var show = function(opts){
			$.log("show");
			setTimeout(function(){
				if(opened) return;
				node.style.left = opts[0]+"px";
				node.style.top = opts[1] - panelHeight +"px";
				node.style.display = "";
				opened = true;
			}, 10);
		};
		var getDisplayStatus = function(){
			$.log("getDisp");
			return node.style.display != "none";
		};
		var hide = function(){
			node.style.display = "none";
			opened = false;
		};
		var bindDOM = function(){
			DEvent.add("setColor", "click", bindDOMFuns.setColorClick)
			DEvent.add("okBtn", "click", bindDOMFuns.okClick)
			$.addEvent(document, "click", bindDOMFuns.bodyClick);
		};
		var init = function(){
			parseDOM();
			bindDOM();
			initialized = true;
		};
		var destroy = function(){
			DEvent.remove("setColor", "click");
			DEvent.remove("okBtn", "click");
			$.removeEvent(document, "click", bindDOMFuns.bodyClick);
		};
		init();
		that.show = show;
		that.hide = hide;
		that.getDisplayStatus = getDisplayStatus;
		that.destroy = destroy;
		//-------------------------------------------
		return that;
	};
});
