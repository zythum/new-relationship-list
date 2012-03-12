/**
 * @author wangliang3
 * 更多的dropdown弹层
 */
$Import('kit.extra.language');
$Import('common.trans.editor');
$Import('ui.bubble');
$Import('common.editor.service.center');
$Import('common.dialog.pluginManage');

STK.register('common.editor.service.morePlugin',function($){
	var io = $.common.trans.editor,
		$L = $.kit.extra.language;
	
	var template=['<div class="layer_menu_list" node-type="outer" style="position:absolute;z-index:10000;">'
					,'<div node-type="inner" >'
						,'<div node-type="plugins" class="app_menu">'
//							,'<a action-type="video" class="movie" href="javascript:void(0);" title="视频">视频</a>'
//							,'<a action-type="music" class="music" href="javascript:void(0);" title="音乐">音乐</a>'
//							,'<a action-type="topic" class="topic" href="javascript:void(0);" title="话题">话题</a>'
//							,'<a action-type="vote" class="vote" href="javascript:void(0);" title="投票">投票</a>'
//							,'<a action-type="plugin" action-data="type=plugin3&aaa=123" href="javascript:void(0);" class="vote" title="widget">组件3</a>'
						,'</div>'
						,'<ul node-type="manages" class="app_operate">'
							,'<li node-type="line" class="line"></li>'
							,'<li><a action-type="add" action-data="index=0" href="#"><img src="'+$CONFIG['imgPath']+'style/images/common/transparent.gif" class="iconadd_app" title="#L{添加}">#L{添加}</a></li>'
							,'<li><a action-type="sort" action-data="index=1" href="#"><img src="'+$CONFIG['imgPath']+'style/images/common/transparent.gif" class="iconord_app" title="#L{排序}">#L{排序}</a></li>'
						,'</ul>'
					,'</div>'
				 ,'</div>'];
	
	
	return function(editor){
		var it={},devt,menu,mdevt,isdown=false,mangageLayer,hideTimeout;
		
		var conf={
			number: 4,
			defNumber: 2
		};
		
		//
		var cache = {
			list: [],
			data: {},
			add: function(item){
				var type = item.type;
				cache.data[type] = item;
			},
			destroy: function(){
				cache.list=[];
				cache.data={}
			}
		}
		//
		var menuAction = {
			add: function(pars){
				$.preventDefault(pars.evt);
				handler.showManageLayer(pars);
			},
			sort: function(pars){
				$.preventDefault(pars.evt);
				handler.showManageLayer(pars);
			}
		};
		//
		var moreBtn;
		
		var mouse = {
			menuShow: function(){
				hideTimeout&&clearInterval(hideTimeout);
				$.addEvent(document.body,'mousemove',mouse.menuHide);
			},
			menuHide: function(e){
				var el = $.fixEvent(e).target;
				if(moreBtn==el||$.contains(moreBtn,el)){
					return;
				}
				if(el==menu.getDom('outer')||$.contains(menu.getDom('outer'),el)){
					return;
				}
				hideTimeout = setTimeout(function(){
					menu.hide();
					$.removeEvent(document.body,'mousemove',mouse.menuHide);
				},500);
			}
		};
		
		var handler = {
			init: function(){
				var widgetPars = $.queryToJson(editor.nodeList['widget'].getAttribute('node-data')||'');
				conf = $.parseParam(conf,widgetPars);
			},			
			showMenu: function(pars){
				if(isdown){
					return ;
				}
				isdown = true;
				//
				moreBtn = pars.el;
				//show list
				var showListPanel = function(){
					menu.setLayout(pars.el, {
						'offsetX': -15,
						'offsetY': 0
					});
					menu.show();
					//关闭其他的控件弹层
					//$.custEvent.fire(editor,'close',{});
				};
				if (!menu) {
					handler.buildMenu(pars,function(){
						showListPanel();
					});
				}else {
					showListPanel();
				}
			},
			showManageLayer: function(pars){
				if(!mangageLayer){
					mangageLayer = $.common.dialog.pluginManage({
						data:cache,
						callback: function(list){
							cache.list = list;
							//刷新发布器组件去按钮
							handler.refreshWidget();
							//刷新menu按钮图标
							handler.pluginBtnUI();
						}
					});
				}
				mangageLayer.show(pars);
			},
			refreshWidget: function(list){
				var uis=[],len=cache.list.length;
				len = len<conf['number']?len:conf['number'];
				
				for(var i=conf['defNumber'];i<len;i++){
					var type = cache.list[i];
					uis.push(cache.data[type].html);
				}
				editor.nodeList['cont_btns'].innerHTML = uis.join('');
			},
			pluginBtnUI: function(){
				var html = [],splitLine=false,
					list = cache.list; 
				for(var i=conf['number'],len=list.length;i<len;i++){
					splitLine = true;
					html.push(cache.data[list[i]].html);
				}
				menu.getDom('plugins').innerHTML = html.join('')
				//
				menu.getDom('line').style.display = splitLine?'':'none';
			},
			hideMenu: function(){
				hideTimeout = setTimeout(function(){
					menu.hide();
				},500);
			},
			buildMenu: function(pars,call){
				menu = $.ui.bubble({
					'template': $L(template.join('')),
					'isHold': true
				});				
				$.common.editor.service.center(editor,{
					widget: menu.getDom('plugins'),
					tiger: pars.el
				});	
				//bind menu evt			
				handler.menuEvt();
				
				io.request('plugin',{
					onSuccess: function(resp){	
						//cache 
						cache.list = resp.data.used;	
						cache.data = resp.data.all;						
						//
						handler.pluginBtnUI();
						//处理回调
						call&&call();
					},
					onError: function(){}
				},{act: 1});
			},
			menuEvt: function(){
				//隐藏下拉后重置状态
				$.custEvent.add(menu, 'hide', function(){
					isdown = false;
				});
				$.custEvent.add(menu, 'show', function(){
					mouse.menuShow();
				});
				
				//管理btn事件代理
				mdevt = $.delegatedEvent(menu.getDom('manages'));
				for(var k in menuAction){
					mdevt.add(k,'click',menuAction[k]);
				}
				//点击及关闭层
				$.addEvent(menu.getDom('outer'),'click',function(){
					menu.hide();
					isdown = false;
				});
			},
			destroy: function(){
				$.removeEvent(menu.getDom('outer'),'click',handler.hide);
				devt.destroy();
				mdevt.destroy();
				//
				menu.destroy();
			}
		};
		//
		handler.init();
		//外抛方法
		it.menu = menu;
		it.show = handler.showMenu;
		it.hide = handler.hideMenu;
		it.destroy = handler.destroy;
		return it;
	}
});