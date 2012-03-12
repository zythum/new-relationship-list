/**
 * 用户注册 弹层引导
 * @id pl.guide.regUser
 * created by chenjian2@staff.sina.com.cn
 * note : $CONFIG中isNew为真时出现
 */
$Import('comp.guide.newUser');

STK.pageletM.register('pl.guide.newUser',function($){
	var that = {};
	var args = (window.$CONFIG && (window.$CONFIG.enterprise || window.$CONFIG.newUserGuide));
	that = $.comp.guide.newUser(args);
	return that;
});
