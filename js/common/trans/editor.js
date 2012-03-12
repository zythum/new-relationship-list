/**
 * 发布器操作接口管理
 * @author WK | wukan@staff.sina.com.cn
 * 
*@example：
//发布接口			
var trans = $.common.trans.editor;
var t = trans.getTrans('publish',{
'onComplete' : function(ret, params){
alert(ret.data);
}
});
t.request({});
*/
$Import("kit.io.inter");
STK.register('common.trans.editor',function($){
	var t = $.kit.io.inter();
	var g = t.register;
	
	
	//表情
	g('face', {'url':'/aj/mblog/face?type=face'});
	//g('face', {'url':'/t4/home/_html/common/data/face.js'});
	g('magicFace', {'url':'/aj/mblog/face?type=ani'});
	//g('magicFace', {'url':'/t4/home/_html/common/data/magicFace.js'});
	

	//话题插件
	//g('getTopic', {'url':'/t4/home/_html/common/data/topic.js'});
	g('getTopic', {'url':'/aj/mblog/trend'});
	
	//推荐配图
	g('cartoon', {'url':'/aj/mblog/face?type=cartoon'});
	//g('cartoon', {'url':'/t4/home/_html/common/data/cartoon.js'});

	//音乐插件
	g('suggestMusic', {'url':'/aj/mblog/music/suggest','requestMode':'jsonp'});
	g('searchMusic', {'url':'/aj/mblog/music/search','requestMode':'jsonp'});
	g('addMusic', {'url':'/aj/mblog/music/submit','requestMode':'jsonp'});
	g('parseMusic', {'url':'/aj/mblog/music/parse','requestMode':'jsonp'});
	
	//视频插件
	g('parseVideo',{'url':'/aj/mblog/video'});
	//获取水印
	g('waterMark',{'url':'/aj/account/watermark'});
	//g('parseVideo', {'url':'/t4/home/_html/common/data/parseVideo.js'});
	
	g('publishToWeiqun', {'url':'/aj/weiqun/add', 'method':'post'});
	g('rectopic',{'url':'/aj/mblog/rectopic'});
	
	//发布器组件模板获取接口
	g('interactive',{'url':'/aj/mblog/interactive','method':'post'});
	//发布器组件管理
	g('plugin',{'url':'/aj/publishplug/plug','method':'post'});//POST 参数 act：1 获取全部、2 获取使用
	
	//喜欢的歌
	g('favSongSearch',{'url':'http://music.weibo.com/yueku/port/sina_t_getcollect.php','method' : 'get' , 'requestMode' : 'jsonp'});

	//喜欢的歌
	g('getOutlinkInfo',{'url':'http://api.weibo.com/widget/info.json','varkey' : 'callback','method' : 'get' , 'requestMode' : 'jsonp'});

	g('tabLog',{'url':'http://music.weibo.com/t/port/ajax_log_action.php','method' : 'get' , 'requestMode' : 'jsonp'});

	return t;
});

