/**
 * 心情微博使用到的服务器交互文件 
 */
$Import("kit.io.inter");
STK.register('common.trans.mood',function($){
	var t = $.kit.io.inter();
	var g = t.register;
	//日历翻页使用
	g('page',	{'url':'/aj/mood/datelist' , method:'get'});
	//g('mood',	{'url':'/aj/mood/getMoodInfo' , method : 'get'});
	//弹层dialog使用，获得发心情html
	g('simppublish' , {'url' : '/aj/mood/simppublish' , method : 'get'});
	//右侧bubble使用
	g("getMoodFeed" ,{'url':'/aj/mood/getpublish','method':'get'});
	//发心情接口
	g('publish',{'url':'/aj/mood/add','method':'post'});
	//大家的心情翻页使用
	g('myfilter',{'url':'/aj/mood/friendlist','method':'get'});
	//获取当前用户当天是否已经发过心情微博了
	g('getpublishstate' , {url : '/aj/mood/getstate' , method : 'get'});
	//关闭提醒黄条
	g('closetip' , {'url' : '/aj/bubble/closebubble' , 'method' : 'get'});
	//切换星座
	g('changecollestion' , {'url' : '/aj/mood/getastro' , 'method' : 'get'});
	return t;
});
