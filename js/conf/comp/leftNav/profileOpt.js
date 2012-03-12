/**
 * comp.leftNav.profileOpt
 * profile页面左导 最下面的 不实信息曝光，拉黑，举报
 * @param {Object} node
 */
$Import('common.content.block');
STK.register('comp.leftNav.profileOpt', function($){
	return function(node){
		var that = {} , dEvt;
		
		var argsCheck = function(){
			if(!$.isNode(node)) {
				throw "左导拉黑举报不实信息需要传入节点";
				return true;				
			}
		};
		
		var parseDOM = function() {
			
		};
		
		var bindDOMFuns = {
			//加入黑名单
			addToBlock : function(){
				$.common.content.block();
			}			
		};
								
		var bindDOM = function() {
			dEvt = $.core.evt.delegatedEvent(node);
			dEvt.add("block", "click", bindDOMFuns.addToBlock);
		};
		
		var destroy = function() {
			dEvt && dEvt.destroy && dEvt.destroy();
			dEvt = node = null;
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