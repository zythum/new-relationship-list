/**
 * 转发接口管理
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @history
 * L.Ming @ 2011.04.28	增加各种转发接口
 * L.Ming @ 2011.05.04	增加微群列表接口
 * L.Ming @ 2011.05.04	转发到私信接口，改用发私信接口
 * L.Ming @ 2011.05.04	转发到微群接口，增加参数说明
 */
$Import('kit.io.inter');
STK.register('common.trans.forward',function($){
	var t = $.kit.io.inter();
	var g = t.register;
	// 转发到微博
	g('toMicroblog'  ,	{'url':'/aj/mblog/forward','method':'post'});
	// 转发到私信，接口先用 trans/message.js 里的 add
	// 转发到微群
	/* 参数
	 * content	被转发的内容
	 * mid		被转发的微博ID
	 * pic_id	图片ID
	 * gid		微群ID
	 */
	g('toMicrogroup'  ,	{'url':'/aj/weiqun/forward','method':'post'});
	
	// 设置是否默认打开
	g('setDefault'  ,	{'url':'/aj/mblog/repost/setdefault','method':'post'});

	// 转发链汇总信息
	//delete by zhaobo 201105091130 接口废弃
	g('simpleForwardLinks'  ,	{'url':'/aj/mblog/repost/unexpanded','method':'get'});
	// 转发链详情信息
	g('detailForwardLinks'  ,	{'url':'/aj/mblog/repost/small','method':'get'});
	
	// 我的微群列表
	g('microgroupList'  ,	{'url':'/aj/weiqun/mylist','method':'get'});
	
	return t;
});