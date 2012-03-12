/**
 * 微群脚本
 * @author runshi@staff.sina.com.cn
 */
$Import('common.depand.feed');

STK.register("comp.content.chosen", function($) {
	
	var locked = false;
	var isBigPipe = ($CONFIG != null && $CONFIG.bigpipe != null && ($CONFIG.bigpipe === 'true' || $CONFIG.bigpipe === true));
	var isChosen = function(){
		return $.core.str.queryString('jx', {});
	};
	
	return function(){
		//加载JS
		if(!locked && !isBigPipe && isChosen() == '1'){
			$.common.depand.feed.bind('external_chosen_groupsfeed', function(){
				locked = true;
			}, {'onTimeout': function(){
				locked = false;
			}})();
		}
		
		return {
			destroy : function(){}
		};
	}
});
