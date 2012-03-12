/**
 * @author xp | xiongping1@staff.sina.com.cn
 * 查看采集记录
 */
$import("kit.extra.language");
$Import('common.trans.chosen');
$import("ui.litePrompt");
STK.register('common.chosen.record',function($){
	var trans = $.common.trans.chosen;
	var lang = $.kit.extra.language;
	
	var cache = {
		//'test' : '<dl class="comment_list"><dt><a href="/xbao"><img alt="叉小包" src="http://tp4.sinaimg.cn/1661510611/50/5605411680/1" height="30" width="30"></a></dt><dd><a href="/xbao">叉小包</a> 已采集到 <a href="#">美女</a> 精选集 (今天 15:45)</dd><dd><div class="comment"><div class="collect_arrow"><em class="W_arrline">◆</em><span>◆</span></div><p>「 天空 」這個名字，取得真好：它在那裡，但它卻是空的。。。嗯。。空的。。。</p></div></dd><dd class="clear"></dd></dl><dl class="comment_list"><dt><a href="/xbao"><img alt="叉小包" src="http://tp4.sinaimg.cn/1661510611/50/5605411680/1" height="30" width="30"></a></dt><dd><a href="/xbao">叉小包</a> 已采集到 <a href="#">美女</a> 精选集 (今天 15:45)</dd><dd><div class="comment"><div class="collect_arrow"><em class="W_arrline">◆</em><span>◆</span></div><p>「 天空 」這個名字，取得真好：它在那裡，但它卻是空的。。。嗯。。空的。。。</p></div></dd><dd class="clear"></dd></dl>'
	};
	
	var temp = lang('<div class="layer_collect" node-type="recordList"></div>');
	var loadingTemp = lang('#L{加载中}...')
	
	var options = {
		'newDia' : true   //是否在新dialog中打开
		,'title' : lang('#L{采集记录}')
		,'container' : null   //如果不是在新窗口中打开，那么需要指定一个容器
	}
	return function(mid,spec){
		if(!mid){
			throw '[common.chosen.record]:lack of mid';
		}
		var that = {};
		var opts = $.parseParam(options,spec),dialog,builder,nodes;
		if(!opts.newDia && !opts.container){
			throw '[common.chosen.record]:lack of container';
		}
		if(opts.newDia){  //需要在新窗口中打开
			dialog = $.ui.dialog();
			dialog.setTitle(opts.title);
			builder = $.core.dom.builder(temp);
			nodes = $.kit.dom.parseDOM(builder.list);
			dialog.appendChild(builder.box);
			opts.container = nodes.recordList;
			dialog.show().setMiddle();
		}
		var eventFuns = {
			//在层上方显示提示层
			'showTip' : function(msg,dia,type){
				$.ui.litePrompt(msg,{'timeout':2000,'type':type?type:'errorM','zIndex':dia?(parseInt(dia.getOuter().style.zIndex)+1):''})
			},
			'getData' : function(){
				opts.container.style.display = ''
				opts.container.innerHTML = loadingTemp;
				trans.getTrans('showRecord',{
					'onSuccess' : function(json){
						cache[mid] = json["data"] && json["data"]["html"] ? json["data"]["html"] : '';
						eventFuns.showRecord();
					},
					'onError' : function(json){
						eventFuns.showTip(json.msg,dialog);
					},
					'onFail' : function(json){
						eventFuns.showTip('系统繁忙，请稍后再试',dialog);
					}
				}).request({
					'mid' : mid
				})
			},
			showRecord : function(){
				if($.getType(cache[mid]) === 'undefined'){  //缓存中没有数据
					eventFuns.getData();
				}else{  //有数据的话直接拿缓存的
					opts.container.style.display = ''
					opts.container.innerHTML = cache[mid];
					opts.newDia && dialog.setMiddle();
				}
				return that;
			},
			hideRecord : function(){
				opts.container.style.display = 'none'
				opts.container.innerHTML = '';
				return that;
			}
		}
		that.show = eventFuns.showRecord;
		that.hide = eventFuns.hideRecord;
		return that;
	}
});
