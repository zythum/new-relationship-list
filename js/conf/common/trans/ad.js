/**
 * 广告
 * @author wangliang3@staff.sina.com.cn
 */
$Import('kit.io.inter');
STK.register('common.trans.ad',function($){
	var t = $.kit.io.inter();
	var g = t.register;

	//Sales Strategy 's
	g('weibo_AD_SS', {'url':"http://ta.sass.sina.com.cn/front/deliver", 'requestMode':'jsonp'});
	
	g('weibo_AD_Activity', {'url':"http://ta.sass.sina.com.cn/front/activity", 'requestMode':'jsonp'});
	
	//g('test', {'url':"http://io.emu/io.php?a=comp.ad", 'requestMode':'jsonp'});
	
	return t;
});