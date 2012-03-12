/**
 * @author Runshi Wang | runshi@staff.sina.com.cn
 * 
 * 左右勋章列表
 * @id STK.pl.content.medal
 */
$Import('comp.content.medal');
$Import('comp.content.userTips');
$Import('kit.extra.merge');
STK.pageletM.register("pl.content.medal", function($){
	var node = $.E("pl_content_medal");
	var data = node.getAttribute('medalConf');
		data = data ? $.queryToJson(data) : {};
	var that = $.comp.content.medal(node, $.kit.extra.merge({
		column : 6
	}, data));
		
	if($CONFIG['isnarrow'] == '1'){
		$.comp.content.userTips(node);
	}
	
	return that;
});