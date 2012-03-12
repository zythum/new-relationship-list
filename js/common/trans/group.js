/**
 * 分组操作接口管理
 * @author wk@staff.sina.com.cn
 * @modify
 * 增加了调整顺序和获取分组列表的接口
 * yadong|yadong2@staff.sina.com.cn
 * 
 * @history
 * ZhouJiequn @2011.05.05	增加批量与单个加入分组接口
 */
$Import("kit.io.inter");

STK.register('common.trans.group',function($){
	
		var t = $.kit.io.inter();
		var g = t.register;
		g('add',		{'url':'/aj/f/group/add', 'method': 'post'});	// URL OK	
		g('modify',		{'url':'/aj/relation/rename', 'method': 'post'});	// URL OK	
		g('del',		{'url':'/aj/relation/delete', 'method': 'post'});	// URL OK
		g('info',		{'url':'/aj/f/group/getgroupinfo', 'method': 'get'});	// URL OK	
		//单个加入分组
		g('set',		{'url':'/aj3/attention/aj_group_update_v4.php', 'method': 'post'});
		//批量加入分组
		g('batchSet',	{'url':'/aj3/attention/aj_group_batchupdate_v4.php', 'method': 'post'});
		g('list',		{'url':'/aj/f/group/list', 'method': 'get'});
		g('order',		{'url':'/aj/f/group/order', 'method': 'post'});
		
		/*联系人选择器开始*/
		//获取指定分组中的人
		g('listbygroup' , {'url': '/aj/f/attchoose' , method : 'post'});
		g('infolist' , {'url': '/aj/f/attfilterlist' , method : 'get'});
		//g('recommendfollow' , {'url': '/aj/f/group/recommendfollow.php' , method : 'get'});
		g('recommendfollow' , {'url': '/aj3/recommend/aj_addrecommend.php' , method : 'post'});
		/*联系人选择器结束*/
		g('groupupdate',	{'url':'/aj/relation/groupupdate', 'method': 'post'});

		//组备注
		g('editdesc', {'url':'/aj/f/group/editdesc', 'method': 'post'});
		
		g('update', {'url':'/aj/f/group/update', 'method': 'post'});
		g('followgroup', {'url':'/aj/f/group/followgroup', 'method': 'post'});
		g('getGroupDesc', {'url':'/aj/f/group/getdesc', 'method': 'get'});
		return t;
});
