/**
 * 收藏接口管理
 * @author wk@staff.sina.com.cn
 */
$Import('kit.io.inter');
STK.register('common.trans.favorite',function($){
	var t = $.kit.io.inter();
	var g = t.register;
	g('add',	{'url':'/aj/fav/mblog/add',			'method':'post'});	// URL OK
	g('del',	{'url':'/aj/fav/mblog/del', 			'method':'post'});
	g('change',	{'url':'/aj/fav/tag/renew',			'method':'get'});
	g('tagList',	{'url':'/aj/fav/tag/list',			'method':'get'});
	//g('hotTagList',	{'url':'/ajax/favorite/hotTagList',			'method':'get'});
	g('delTag', {'url':"/aj/fav/tag/destroy", 'method':'post'});
	g('updateTag', {'url':"/aj/fav/tag/update", 'method':'post'});
	//POST： mid 、tags（空格分隔）
	//return： code、tags（空格分隔）
	g('alter', {'url':"/aj/fav/tag/alter", 'method':'post'});
	g('getFav', {'url':"/aj/fav/mblog/favlist", 'method':'get'});
	return t;
});
