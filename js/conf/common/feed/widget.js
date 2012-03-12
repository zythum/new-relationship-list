/**
 * @author wangliang3@staff.sina.com.cn
 */
$Import('widget.parse');
STK.register("common.feed.widget", function($) {
	var cash={};
	return {
		add: function(id,obj){
			if(!cash[id]){
				cash[id] = $.widget.parse(obj);
				cash[id].init();
			}
		},
		clear: function(id){
			if (cash[id]) {
				cash[id].destroy();
				delete cash[id];
			}
		},
		destroy: function(){
			for(var k in cash){
				cash[k].destroy();
				delete cash[id];
			}
		}
	}
});