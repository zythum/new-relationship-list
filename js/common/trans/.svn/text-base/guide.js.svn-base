/**
 * 新手导航接口管理
 * @author yadong2@staff.sina.com.cn
 */
$Import("kit.io.inter");

STK.register('common.trans.guide',function($){
	
		var t = $.kit.io.inter();
		var g = t.register;
		g('mark',		{'url':'/aj/guide/upgrade', 'method': 'get'});	// URL OK	
		g('version',		{'url':'/aj3/person/set_version.php','method':'post'});	//add by zhaobo 201108101042 REQ-7893
		g('topicGuide' , {'url' : '/aj/bubble/PublishBubbleTrend' , 'method' : 'get'});//首页热门话题发微博引导弹层
		g('noTopicGuideTip' , {'url' : '/aj/bubble/CloseBubble?bubbletype=3' , "method" : 'get'});//热门话题发微博不再提醒
		return t;
});