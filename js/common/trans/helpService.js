/**
 * 客户服务相关接口
 * @author xinglong1@staff.sina.com.cn
 * 
*@example：
//发布接口			
var trans = $.common.trans.helpService;
var t = trans.getTrans('publish',{
'onComplete' : function(ret, params){
alert(ret.data);
}
});
t.request({});
*/
$Import("kit.io.inter");
STK.register('common.trans.helpService',function($){

	var t = $.kit.io.inter();
	var r = t.register;
	
	
	//表情
	r('quiz_suggest', {'url':'/aj_getRelated.php'}); //类型切换
	r('request', {'url':'/aj_ask.php','method': 'post'}); //创建问题
	r('use', {'url':'/aj_usefull.php','method': 'get'}); //反馈有无作用
	r('mobile', {'url':'/aj/mobile/unfreeze','method': 'post'}); //帐号解锁-手机号验证
	r('checkmessage', {'url':'/aj/user/checkstatus','method': 'post'}); //帐号解锁短信验证
	return t;
});

