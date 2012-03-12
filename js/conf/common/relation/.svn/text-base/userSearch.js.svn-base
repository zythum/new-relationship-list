/**
 * 用户搜索 
 * 稍改造也可以成为通用下拉列表
 * ChengJian | chengjian2@staff.sina.com.cn
 */

$Import('common.trans.relation');
$Import('kit.dom.parseDOM');
$Import('kit.dom.smartInput');
$Import('common.bubble.myFollowSuggest');
STK.register('common.relation.userSearch', function($){
	return function(node,opts){
		var that	= {},nodes,sugg,searchKeySmart,notice = "";
			opts = opts || {};
			opts.callback = opts.callback || $.funcEmpty;
		var bindDOMFuns = {
			btnClick: function(evt){
				evt && $.preventDefault(evt);
				var key = nodes['input'].value;
				if(key !== notice){
					opts.callback(nodes['input'].value,nodes['submit']);
				}
			}
		};
		var bindDOM = function(){
			$.addEvent(nodes['submit'], 'click', bindDOMFuns.btnClick);
		};
		var bindListener = function(){};
		var init = function(){
			argsCheck();
			parseDOM();
			bindDOM();
			bindListener();
		};
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.common.relation.userSearch]:node is not a Node!";
			}
		};
		var parseDOM = function(){
			var buildDom = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(buildDom.list);
			sugg = $.common.bubble.myFollowSuggest({
						'transName':"myFollowList",
						'type':opts.type == 0 ? 0 : 1,
						'textNode' : nodes['input'],
						'width':opts.width || 137,
						'callback' : function(key){
							opts.callback(key,nodes['submit']);
						}
			});
			sugg.show();
			notice = nodes['input'].getAttribute("notice");
			searchKeySmart = $.kit.dom.smartInput(nodes['input'], {
				notice: notice,
				noticeClass: "input_default",
				maxLength: 40
			});
		};
		var destroy = function(){
			sugg && sugg.hide && sugg.hide();
			sugg && sugg.destroy && sugg.destroy();
			searchKeySmart && searchKeySmart.destroy && searchKeySmart.destroy();
			nodes['submit'] && $.removeEvent(nodes['submit'], 'click', bindDOMFuns.btnClick);
			sugg = searchKeySmart = bindDOMFuns = nodes = null;
		};
		init();
		that.destroy = destroy;
		return that;

	};
});