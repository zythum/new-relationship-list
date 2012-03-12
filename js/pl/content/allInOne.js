/**
* 右侧轮换模块all in one
* 
* @id pl.content.allInOne
* @author Runshi Wang | runshi@staff.sina.com.cn
*/
$Import('comp.content.allInOne');
STK.pageletM.register("pl.content.allInOne", function($) {
	var node = $.E("pl_content_allInOne");
	var that = $.comp.content.allInOne(node);
	return that;
});
