/**
 * @author wangliang3
 */
$Import('comp.help.unlockValidate');
STK.pageletM.register("pl.help.unlockValidate", function($) {
	var node = $.E("pl_help_unlockValidate");
	if(!node){
		return;
	}
	var that = $.comp.help.unlockValidate(node);
	return that;
});