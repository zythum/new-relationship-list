/**
 * 关系组接口管理
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 * @history
 * L.Ming @2011.04.21	增加一个设置备注名及分组的接口，URL 是临时的
 * L.Ming @2011.05.05	设置备注名及分组的接口变更，URL 是 V3 的
 * ZhouJiequn @2011.05.05	分组接口移除
 * L.Ming @2011.05.05	单独设置备注名接口URL变更
 * Runshi @2011.08.05   人气用户接口添加
 */
$Import('kit.io.inter');
STK.register('common.trans.relation',function($){
	var t = $.kit.io.inter();
	var g = t.register;
	g('newuserguide', {'url': '/aj/user/interest/newuserguide', 'method': 'get'});
	g('mayinterested', {'url': '/aj/user/interest/list', 'method': 'get'});
	g('uninterested', {'url': '/aj/user/interest/uninterested', 'method': 'post'});
	g('userCard', {'url': '/aj/user/card', 'method': 'get'});
	g('follow'  ,	{'url':'/aj/f/followed','method':'post'});
	g('unFollow',	{'url':'/aj/f/unfollow','method':'post'});

	g('block',	{'url':'/aj/f/addblack','method':'post'});
	g('unBlock',	{'url':'/aj3/blacklist/delblacklist_v4.php','method':'post'});
	g('removeFans',	{'url':'/aj/f/remove','method':'post'});
	g('requestFollow',{'url':'/ajax/relation/requestfollow','method':'post'});
	g('questions', {'url':'/aj/invite/attlimit', 'method': 'get'});
	g('answer', {'url':'/aj/invite/att', 'method': 'post'});

	g('setRemark',{'url':'/aj3/attention/aj_remarkname_v4.php','method':'post'});
	
	//他人页
	g('recommendusers',	{'url':'/aj/f/recommendusers', 'method':'get'});
	//关注他的人同时关注了
	g('recommendAttUsers',{'url':'/aj/f/worthfollowusers','method':'get'});
	//人气用户推荐
	g('recommendPopularUsers',{'url':'/aj/user/interest/recommendpopularusers','method':'get'});
	//感兴趣的微群
	g('mayinterestedweiqun',{'url':'/aj/weiqun/getinterestedlist','method':'get'});
	//更多资料
	g('moreData', {'url':'/aj/f/listuserdetail', 'method': 'get'});
	//获取邀请数
	g('getInvite', {'url':'/aj/invite/unread', 'method': 'get'});
	
	//悄悄关注
	g('quiet_addUser',{'url' : '/aj/f/addwhisper' ,'method' : 'post'});
	g('quiet_removeUser',{'url' : '/aj/f/delwhisper' ,'method' : 'post'});
	g('quiet_know',{'url' : '/aj/tipsbar/closetipsbar' ,'method' : 'post'});
	
	g('groupUserList', {'url':'/aj/f/group/getgroupmembers', 'method':'get'});
	
	g('groupSubmit', {'url':'/aj/f/group/list', 'method':'get'});
	return t;
});