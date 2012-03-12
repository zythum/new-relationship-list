/**
 * @author Runshi Wang|runshi@staff.sina.com.cn
 * 
 * 对他的操作
 */
$Import('comp.content.hisOperationPlate');

STK.pageletM.register("pl.content.hisOperationPlate", function($){
	var node = $.E("pl_content_hisOperationPlate");	
	var that = $.comp.content.hisOperationPlate(node);
	return that;
});
