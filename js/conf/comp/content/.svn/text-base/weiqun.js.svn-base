/**
 * 微群脚本
 * @author runshi@staff.sina.com.cn
 */
$Import('common.depand.feed');

STK.register("comp.content.weiqun", function($) {
	
	var locked = false;
	var isBigPipe = ($CONFIG != null && $CONFIG.bigpipe != null && ($CONFIG.bigpipe === 'true' || $CONFIG.bigpipe === true));
	
	return function(){
		//加载JS
		if(!locked && !isBigPipe && $CONFIG['groupfeed'] == '1'){
			$.common.depand.feed.bind('external_group4weibo_groupsfeed', function(){
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
