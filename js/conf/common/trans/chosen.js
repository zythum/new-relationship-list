/**
 * @author xp | xiongping1@staff.sina.com.cn
 * 精选集相关接口管理
 */
$Import('kit.io.inter');
STK.register('common.trans.chosen',function($){
	var t = $.kit.io.inter();
	var g = t.register;
	
	//------------------------------------------------------------------
	g('getCate',    {'url':'/ajm/jingxuan?action=getcategory', 'method':'get'});	//获取精选集分类
	g('getJxList',  {'url':'/ajm/jingxuan?action=getmyjxjlist', 'method':'get'});	//获取我的精选集 返回数据  不返回html
	g('createJx',   {'url':'/ajm/jingxuan?action=add', 'method':'post'});	//创建精选集
	g('collect',    {'url':'/ajm/jingxuan?action=gather', 'method':'post'});	//采集
	g('showRecord', {'url':'/ajm/jingxuan?action=getcollectlist', 'method':'get'});	//显示采集记录
	
	return t;
});