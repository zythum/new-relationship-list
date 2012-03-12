/**
 * @author wangliang3
 * 构造微博精选碳层layer详情
 * 功能点：
 * 1、加载单条微博页
 * 2、加载评论
 * 3、加载本页精品微博Slide
 */
$Import('common.plaza.choiceTemplate');
$Import('common.plaza.choiceSlide');
$Import('common.plaza.choiceImg');
$Import('common.plaza.choiceUserinfo');
$Import('common.plaza.choiceFeed');
$Import('common.channel.plaze');
$Import('common.channel.slide');

STK.register('common.plaza.choicePoplayer', function($){
	var template = $.common.plaza.choiceTemplate,
		ch_plaze = $.common.channel.plaze,
		ch_slide = $.common.channel.slide,
		browser = $.core.util.browser;
	
	var layer,nodes,devt,scroll_layer,winsize;
	
	return function(){
		var it = {};
		
		var act = {
			layer_close: function(){
				$.preventDefault();
				frame.unScroll(false);
				layer.style.display='none';
			},
			layer_show: function(){
				$.preventDefault();	
				layer.style.zIndex = 10000;
				frame.unScroll(true);
				var top = $.scrollPos().top;
				if ($.IE) {
					scroll_layer.style.overflowY = 'scroll';
					scroll_layer.style.scrollTop = 0;
				}
				layer.style.top = top+'px';
				//
				var winsize = $.core.util.winSize();
				scroll_layer.style.height = winsize.height+'px';
				//
				layer.style.display='';
			}
		};
		var frame = {
			init: function(){
				//创建框架层
				frame.build();
				//绑定默认动作
				frame.bind();
				//注册监听
				frame.channel();
				//添加外部组件
				frame.widget();
			},
			build: function(){
				var builder = $.builder(template.choiceLayer);
				var _nodes = builder.list;
				layer = builder.list['choice_layer'][0];
				document.body.appendChild(builder.box);
				
				scroll_layer = builder.list['scroll_layer'][0];
				//rebuild pars
				nodes = {};
				for(var k in _nodes){
					nodes[k] = _nodes[k][0];
				}
			},
			bind: function(){
				devt = $.delegatedEvent(layer);
				//注册layer代理事件
				for (var k in act) {
					devt.add(k,'click',act[k]);
				}
				//window resize
				
				$.addEvent(window,'resize',frame.resize);
			},
			channel: function(){
				//注册监听
				ch_slide.register('view',frame.setDetailLink);
				ch_plaze.register('detail_link',frame.setDetailLink);
				ch_plaze.register('layer_updata',frame.update);
			},
			setDetailLink: function(data){
				nodes['btn_full'].setAttribute('href',data.data.mlink);
			},
			widget: function(){
				//加载该微博用户信息
				$.common.plaza.choiceUserinfo(nodes);
				//图片预览
				$.common.plaza.choiceImg(nodes);
				//slide组件启动
				$.common.plaza.choiceSlide(nodes);
				//启动feed区
				$.common.plaza.choiceFeed(nodes);
			},
			update: function(pars){
				//更新大图
				ch_plaze.fire('choiceimg_show',pars);
				//更新feed详情页跳转link
				ch_plaze.fire('detail_link',pars);
				//刷新slide
				ch_plaze.fire('slide_refresh',pars);
				//刷新slide默认显示样式
				ch_plaze.fire('slide_css',pars);
			},
			unScroll: function(view){
				var value = !!view?'hidden':'auto';
				if($.IE){
					document.documentElement.style.overflowY = value;
					document.documentElement.style.overflowX = 'hidden';
//					window.scrollTo(0, $.scrollPos().top);
				}else{
					document.body.style.overflowY = value;
				}
			},
			destory: function(){
				frame.unScroll(false);
				devt.destory();
				layer.parentNode.removeChild(layer);
			},
			resize: function(){
				var _size = $.core.util.winSize();
				if(winsize===_size){
					return;
				}else{
					winsize = _size;
					scroll_layer.style.height = _size.height;
				}
			}
		};
		//外抛函数
		it.show = function(data){
			act.layer_show();
			frame.update(data);	
			return this;
		};
		it.destory = frame.destory;
		
		//启动
		if (!layer) {
			frame.init();
		}
		return it;
	}
});