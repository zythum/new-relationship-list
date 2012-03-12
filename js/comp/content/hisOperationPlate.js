/**
 * @author Runshi Wang|runshi@staff.sina.com.cn
 * 
 * 对他的操作
 */
$Import('common.content.block');

STK.register("comp.content.hisOperationPlate", function($){

	return function(node){
		var dEvt = $.core.evt.delegatedEvent(node);
		var that = {};
		
		
		var doActions = {
			"block" : function(){
				$.common.content.block();
			}
		};
		
		var bindDomFunction = function(){
			for(var action in doActions){
				dEvt.add(action, 'click', doActions[action]);
			}
		};
		
		var init = function(){
			bindDomFunction();
		};
		
		
		var destroy = function(){
			dEvt.destroy();
		};
		
		that.destroy = destroy;
		
		init();
		
		return that;
	};
});
