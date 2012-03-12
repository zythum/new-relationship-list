/**
 * uc用户升级 弹层告知
 * @id pl.guide.ucUser
 * created by lianyi@staff.sina.com.cn
 * note : $CONFIG中isUcDomain为真时出现
 * see MINIBLOGREQ-6193
 */
$Import('comp.guide.ucUser');

STK.pageletM.register('pl.guide.ucUser',function($){
	var that = {};
	var isUcUser = (window.$CONFIG && window.$CONFIG.isUcDomain && parseInt(window.$CONFIG.isUcDomain)) || 0;
	if(isUcUser) {
		that = $.comp.guide.ucUser(0);
	}
	return that;
});
