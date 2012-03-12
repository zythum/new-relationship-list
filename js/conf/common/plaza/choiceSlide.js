/**
 * @author wangliang3
 * 托管slide控件的UI及相关样式交互的应用层封装
 */
$Import('common.plaza.slide');
$Import('common.plaza.choiceTemplate');
$Import('common.extra.imageURL');
$Import('common.channel.plaze');
$Import('common.channel.slide');

STK.register('common.plaza.choiceSlide', function($){
	var template = $.common.plaza.choiceTemplate,
		imageURL = $.common.extra.imageURL,
		ch_plaze = $.common.channel.plaze,
		ch_slide = $.common.channel.slide;
	
	return function(nodes){
		var it = {},cash = {},fdata=[],slide,selectedItem;
		
		
//		//防止图片并发下载
//		var download,isDownload = false,pics = [],qtimer=0,num=10;
//		var queue = {
//			start: function(){
//				if(isDownload){return;}
//				isDownload = true;
//				download = setInterval(function(){
//					for(var i=0,len=num;i<len;i++){
//						var pid = pics.shift();
//						if(pid){
//							var data = cash[pid];
//							
//							handler.printImg(data.el,data.src);
//						}else{
//							queue.stop();
//						}
//						var len = pics.length;
//						if(len>0&&i==num-1&&isDownload){
//							queue.start();
//						}
//					}
//					qtimer = 100;
//				},qtimer);
//				
//			},
//			stop: function(){
//				isDownload = false;
//				qtimer = 0;
//				clearInterval(download);
//			}
//		};
		//
		var handler = {
			init: function(){
				//get pars
				el = nodes['layer_slide'];
				//创建solid原型
				handler.build();
				//监听
				handler.channel();
			},
			build: function(){
				var data = {
					itemHeight: 84,
					itemWidth: 114,		
					fui: template.slideFrame,//slide frame ui框架模板
		            iui: template.slideItem//slide item ui模板
				};		
				slide = $.common.plaza.slide(el,data);
				//统计页面已经存在的feed
				var feeds = $.sizzle('[action-type=imageItem]'),_data = [];
				for(var i=0,len=feeds.length;i<len;i++){
					_data.push($.core.json.queryToJson(feeds[i].getAttribute('action-data')||''));
				}
				handler.addImgs(_data);
//				handler.addImgs($CONFIG['picData'].data);
			},
			channel: function(){
				ch_plaze.register('slide_addimg',handler.addImgs);
				ch_plaze.register('slide_refresh',handler.refresh);
				ch_plaze.register('slide_view',handler.selected);
				ch_slide.register('view',handler.selected);
				ch_slide.register('loop',handler.loop);
				ch_plaze.register('slide_css',handler.refreshCss);
			},
			selected: function(data,type){
				var _data=data['data']||data;
				if (type) {
					var k,len = fdata.length;
					for (var i = 0; i < len; i++) {
						if (fdata[i] == data.mid) {
							k = i;
							break;
						}
					}
					if ((type=='up'&&k==0)||(type=='down'&&k==len)) {
					}else{
						k += type=='up'?-1:1;
						var pars = {
							data: cash[fdata[k]]
						};
						ch_plaze.fire('layer_updata',[pars]);
						//
						_data = cash[fdata[k]];
					}
					
					//一直点击下一张，到最后5张时开始下载新的数据
					if(type == 'down'&& (len-k)==5){
						ch_plaze.fire('slide_laoddata');
					};
				}
				else {
					//
					selectedItem && (selectedItem.className = '');
					selectedItem = data.el;
					selectedItem.className = 'selected';
					setTimeout(function(){
						slide.moveto(data.data.pid);
					},200);
				}
				//
				ch_plaze.fire('slide_states',[_data,slide.data]);
			},
			refresh: function(data){
				data = cash[data.data.mid];
				//
				selectedItem&&(selectedItem.className = '');
				selectedItem = data['list']['view'];
				selectedItem.className = 'selected';
				//
				setTimeout(function(){slide.moveto(data.pid);},$.IE?50:0);
				//
				ch_plaze.fire('slide_states',[data,slide.data]);
			},
			addImgs: function(feeds){
				for(var i=0,len=feeds.length;i<len;i++){
					var data = feeds[i];
					data['src'] = data.url;
					cash[data.mid] = data;
					slide.addItem(data);
					//
					fdata.push(data.mid);
				}
//				ch_plaze.fire('slide_states',[data,slide.data]);
			},
			refreshCss: function(){
				slide.refreshCss();
			},
			loop: function(){
				ch_plaze.fire('slide_laoddata');
			},
			destory: function(){
				slide.destory();
			}
		};
		//启动
		handler.init();
		//外抛函数
		it.destory = handler.destory;
		
		return it;
	}
});