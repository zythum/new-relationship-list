/**
 * comp.leftNav.profilePersonal
 * profile页面左导上面菜单层，个人菜单需要处理上传和听歌
 * @param {Object} node
 */
$Import('kit.dom.parseDOM');
STK.register('comp.leftNav.profilePersonal', function($){
	return function(node){
		var that = {} , nodes;
		
		var argsCheck = function(){
			if(!$.isNode(node)) {
				throw "左导上面的菜单层需要传入节点";
				return true;				
			}
		};
		
		var parseDOM = function() {
			nodes = $.kit.dom.parseDOM($.builder(node).list);
		};
		
		var bindDOMFuns = {
			dilemmaJump : function(evt) {
				$.core.evt.preventDefault(evt);
				var el = evt.target || evt.srcElement;
				var url = el.getAttribute('url');
				url && (window.location = url);				
			}			
		};
								
		var bindDOM = function() {
			if(nodes["dilemma"]){
				if(!$.isArray(nodes["dilemma"])){
					nodes["dilemma"] = [].concat([nodes["dilemma"]]);
				}
				if(nodes["dilemma"].length > 0){
					for(var i in nodes["dilemma"]){
						$.addEvent(nodes["dilemma"][i], 'click', bindDOMFuns.dilemmaJump);
					}
				}
			}
		};
		
		var destroy = function() {
			if(nodes && nodes["dilemma"] && nodes["dilemma"].length > 0){
				for(var i in nodes["dilemma"]){
					$.removeEvent(nodes["dilemma"][i], 'click', bindDOMFuns.dilemmaJump);
				}
			}
			nodes = node = null;
		};
		
		var init = function() {
			var error = argsCheck();
			if(error) {
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