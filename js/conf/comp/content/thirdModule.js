/**
 * @author wangliang3
 */
$Import('common.content.thirdModule');

STK.register('comp.content.thirdModule', function($){
	var cash = {},
		ctt = $.common.content.thirdModule;
	
	return function(){
		cash.items = $.sizzle('div[components=thirdmodule]',document.body);
		for(var i=0,len=cash.items.length;i<len;i++){
			var el = cash.items[i];
			cash[el.id] = ctt(el);
		}
		
		return {
			destory: function(){
				for(var id in cash.items){
					cash[id].destory();
				}		
			}
		}
	}
});