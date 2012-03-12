/**
* 右侧轮换模块all in one
* 
* @id pl.content.allInOne
* @author Runshi Wang | runshi@staff.sina.com.cn
*/
$Import('common.extra.litSwitcher');
$Import('common.trans.activity');
STK.register("comp.content.allInOne", function($) {
	
	return function(node, opts){
		var options = {},
			that = {},
			dEvt;
		
		options = $.parseParam(options, opts || {});
		var switcher,idArr = [];
		
		var DOMEvents = {
			joinActivity : function(evt){
				var mid = evt["data"] && evt["data"]["mid"];
				var href = evt["el"].getAttribute("href");
				$.common.trans.activity.getTrans('allInOne', {
					'onComplete' : function(){
						window.location.href = href;
					}
				}).request({
					'mid': mid
				});
			}
		};
		
		var mouseover = function() {
			if(idArr.length) {
				var trans = $.common.trans.activity.getTrans('listAllInOne' , {
					onSuccess : function(ret) {
						switcher.addExtraItems(ret.data , 'allInOne');
					}
				});
				trans.request({
					excludeId : idArr.join(',')
				});
				$.removeEvent(node,'mouseover',mouseover);
				idArr = null;
			}
		};
		
		var init = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.content.leftNav]:node is not a Node!";
				return;
			}
			var buildNodes = $.kit.dom.parseDOM($.builder(node).list);
			buildNodes.item && $.foreach(buildNodes.item , function(item) {
				idArr.push(item.getAttribute('itemid'));
				return false;
			});
			switcher = $.common.extra.litSwitcher(node, {
				cycle : true
			});
			dEvt = $.core.evt.delegatedEvent(node);
			dEvt.add("join", "click", DOMEvents.joinActivity);
			$.addEvent(node , "mouseover" , mouseover);
		};
		
		init();
		
		that.destroy = function(){
			idArr && $.removeEvent(node,'mouseover',mouseover);
			switcher && switcher.destroy();
			switcher = null, that = null, options = null, DOMEvents = null, dEvt = null;
		};
		
		return that;
	}
});
