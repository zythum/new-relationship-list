/**
 * @author wangliang3
 */
$Import('common.trans.editor');
$Import('ui.dialog');
$Import('kit.extra.language');
$Import('kit.dom.parseDOM');
$Import('module.editorPlugin.tab');

STK.register('common.dialog.pluginManage', function($){
	var tab = $.module.editorPlugin.tab,
		$L = $.kit.extra.language,
		io = $.common.trans.editor;
	
	var TEMP = {
		frame: ['<div class="W_layer" node-type="outer">'
					,'<div class="bg">'
						,'<table cellspacing="0" cellpadding="0" border="0">'
							,'<tbody><tr><td><div class="content">'
								,'<div node-type="title" style="display:none;"></div>'
								,'<a class="W_close" href="javascript:void(0);" node-type="close" title="#L{关闭}"></a>' 
								,'<div node-type="inner"></div>'
							,'</div></td></tr></tbody>'
						,'</table>'
					,'</div>'
				,'</div>'].join(''),
				 
		tab: ['<div class="tab W_textb W_f14"><p class="">'
				,'<a node-type="tab" href="javascript:void(0);" title="#L{添加}">#L{添加}</a>'
				,'<a node-type="tab" href="javascript:void(0);" title="#L{排序}">#L{排序}</a>'
			  ,'</p></div>'].join(''),
				
		sort: ['<div node-type="tab_con" class="order_app_cont" style="display:none;">'
				    ,'<p class="tit W_texta">#L{工具效果预览(表情和图片不支持排序哦)}</p>'
				    ,'<div class="send_weibo">'
				        ,'<div class="kind W_linkb">'
							,'<span node-type="sort_preview"></span>'
				            ,'<i class="W_vline">|</i>'
				            ,'<a class="W_moredown">#L{更多}<span class="more"></span></a>'
				        ,'</div>'
				    ,'</div>'
				    ,'<p class="tit W_texta">#L{点击右侧上下按钮，调整工具的顺序，定制属于自己的发布器}</p>'
				    ,'<div class="orderby clearfix">'
				        ,'<div node-type="sort_panel" class="orderlist"><ul node-type="sort_list"></ul></div>'
				        ,'<div class="orderbtn">'
				            ,'<a action-type="btn_up" node-type="btn_up" href="javascript:void(0);" class="W_btn_a_disable" title="#L{上移}"><span><em class="ico_up"></em>#L{上移}</span></a>'
				            ,'<a action-type="btn_down" node-type="btn_down" href="javascript:void(0);" class="W_btn_a_disable" title="#L{下移}"><span><em class="ico_down"></em>#L{下移}</span></a>'
				        ,'</div>'
				    ,'</div>'
				    ,'<div class="btn">'
				        ,'<a class="W_btn_b" action-type="btn_submit" href="javascript:void(0);" title="#L{确定}"><span>#L{确定}</span></a>'
				        ,'<a class="W_btn_a" action-type="btn_cancel" href="javascript:void(0);" title="#L{取消}"><span>#L{取消}</span></a>'
				    ,'</div>'
				,'</div>'].join(''),
					
		add: ['<div node-type="tab_con" class="order_app_cont" style="display:none;">'
				,'<div class="clearfix">'
					,'<div class="left_add">'
						,'<p class="tit W_texta">#L{添加小工具到发布器，让发表更有趣}</p>'
						,'<div class="applist_cont">'
							,'<ul node-type="add_source" class="user_applist"></ul>'
						,'</div>'
					,'</div>'
					,'<div class="right_del">'
						,'<p class="tit W_texta">#L{管理已添加的工具}</p>'
						,'<ul node-type="add_used" class="user_applist user_appshow"></ul>'
					,'</div>'
				,'</div>'
				,'<div class="btn">'
			        ,'<a class="W_btn_b" action-type="btn_submit" href="javascript:void(0);" title="#L{确定}"><span>#L{确定}</span></a>'
			        ,'<a class="W_btn_a" action-type="btn_cancel" href="javascript:void(0);" title="#L{取消}"><span>#L{取消}</span></a>'
			    ,'</div>'
			,'</div>'].join('')
	};
	
	return function(opts){
		var it = {},layer,nodes,tab,cache,selectedItem;
		
		var conf = {
			preNum: 4,
			sortIndex: 2,
			hoverClass: 'current W_texta',
			btnDisClass: 'W_btn_a_disable',
			btnClass: 'W_btn_a'
		};

		var dycache = {
			fixed: ['500','501'],//表情、图片默认
			backup: [],
			list: function(){
				var _list = [];
				var items = $.sizzle('li[action-type=sort_item]',nodes['sort_list']);
				for(var i=0,len=items.length;i<len;i++){
					var type = items[i].getAttribute('type');
					if(type){
						_list.push(type);
					}
				}
				cache.list = _list;
			},
			reset: function(){
				cache.list = [];				
				cache.list = dycache.backup.slice(0);
			},
			staticPlugin: {}
		};
		
		var act = {
			sort_item: function(pars){
				$.preventDefault();
				
				var node = pars.el;
				if (dycache.staticPlugin[node.getAttribute('type')]) {
					return ;
				}
				
				selectedItem&&$.removeClassName(selectedItem,conf['hoverClass']);
				selectedItem = pars.el;
				$.addClassName(selectedItem,conf['hoverClass']);
				btnStates.refreshSortBtn();
			}
			,btn_cancel: function(){
				$.preventDefault();				
				layer.hide();
				//
				handler.reset();
			}
			,btn_submit: function(pars){
				$.preventDefault();
				io.request('plugin',{
					onSuccess: function(resp){
						dycache.backup = cache.list.slice(0);
						opts.callback&&opts.callback(cache.list);
						layer.hide();
					},
					onError: function(){}
				},{act: 2,plugins:cache.list.join(',')});
			}
			,btn_delitem: function(pars){
				$.preventDefault();
				var i=0,type = pars.data.type;
				for(var len=cache.list.length;i<len;i++){
					if(type==cache.list[i]){
						break;
					}
				}
				//
				cache.list.splice(i,1);
				//
				tabChange.usedList();
				tabChange.sourceList();
			}
			,btn_additem: function(pars){
				$.preventDefault();
				var type = pars.data.type;
				if(cache.used[type]){
					return;
				}
				cache.list.push(type);
				cache.used[type] = type;
				//
				tabChange.usedList();
				tabChange.sourceList();
			}
			,btn_up: function(pars){
				$.preventDefault();
				if($.core.dom.hasClassName(pars.el,conf.btnDisClass)){
					return;
				}
				var node = $.core.dom.prev(selectedItem);
				if (node&&!dycache.staticPlugin[node.getAttribute('type')]) {
					$.insertBefore(selectedItem, node);
					//scroll
					nodes['sort_panel'].scrollTop -= 26;
					//refresh
					dycache.list();					
					tabChange.sortPreview();
				}
				btnStates.refreshSortBtn();
			}
			,btn_down: function(pars){
				$.preventDefault();
				if($.core.dom.hasClassName(pars.el,conf.btnDisClass)){
					return;
				}
				var node = $.core.dom.next(selectedItem);
				if (node) {
					$.insertAfter(selectedItem, node);
					//scroll
					nodes['sort_panel'].scrollTop += 26;
					//refresh
					dycache.list();					
					tabChange.sortPreview();
				}
				btnStates.refreshSortBtn();
			}
		};
		
		var btnStates = {
			refreshSortBtn: function(){
				if(!selectedItem){
					nodes['btn_up'].className = conf.btnDisClass;
					nodes['btn_down'].className = conf.btnDisClass;
					return ;
				}
				//
				var pnode = $.core.dom.prev(selectedItem);
				if (pnode && dycache.staticPlugin[pnode.getAttribute('type')]) {
					nodes['btn_up'].className = conf.btnDisClass;
				}else{
					nodes['btn_up'].className = !!$.core.dom.prev(selectedItem)?conf.btnClass:conf.btnDisClass;
				}
				//
				var nnode = $.core.dom.next(selectedItem);
				if (nnode && dycache.staticPlugin[nnode.getAttribute('type')]) {
					nodes['btn_down'].className = conf.btnDisClass;
				}else{
					nodes['btn_down'].className = !!$.core.dom.next(selectedItem)?conf.btnClass:conf.btnDisClass;
				}
			}
		};
		
		var tabChange = {
			render: function(pars){
				switch(pars.idx){
					case 0:
						//添加
						tabChange.sourceList();
						tabChange.usedList();
						break;
					case 1:
						//排序
						tabChange.sortPreview();
						tabChange.sortList();
						btnStates.refreshSortBtn();
						break;
					
				}
				
			},
			sortPreview: function(){
				var uis=[],len=cache.list.length;
				len = len<conf['preNum']?len:conf['preNum'];
				
				for(var i=0;i<len;i++){
					var type = cache.list[i];
					uis.push(cache.data[type].html);
				}
				nodes['sort_preview'].innerHTML = uis.join('');
			},
			sortList: function(){
				var uis=[];
				for(var i=0,len=cache.list.length;i<len;i++){
					var type = cache.list[i];
					//默认时候显示表情、图片是否出现在排序区出现
//					if (!dycache.staticPlugin[type]) {
						uis.push('<li action-type="sort_item" type="' + type + '">' + cache.data[type].html + '</li>');
//					}
				}
				nodes['sort_list'].innerHTML = uis.join('');
			},
			sourceList: function(){
				//add_source
				var used = {};
				for(var k in cache.list){
					used[cache.list[k]] = cache.list[k]
				}
				var uis=[];
				for(var type in cache.data){
					if (!dycache.staticPlugin[type]) {
						var btn = used[type] ? '<em>#L{已添加}</em>' : '<a class="sml_greenBtn" action-type="btn_additem" action-data="type=' + type + '" href="javascript:void(0);" title="#L{添加工具到发布器}"><span>#L{添加}</span></a>';
						uis.push($L('<li><div class="fl">' + cache.data[type].html + '(' + cache.data[type].desc + ')</div>' + btn + '</li>'));
					}
				}
				nodes['add_source'].innerHTML = uis.join('');
				//
				cache.used = used;
			},
			usedList: function(){
				//add_used
				var uis=[];
				for(var i=0,len=cache.list.length;i<len;i++){
					var type = cache.list[i];
					if (!dycache.staticPlugin[type]) {
						uis.push($L('<li><div class="fl">' + cache.data[type].html + '</div><a class="W_close_color" action-type="btn_delitem" action-data="type=' + type + '" href="javascript:void(0);" title="#L{删除工具}"></a></li>'));
					}
				}
				nodes['add_used'].innerHTML = uis.join('');
			}
		};
		
		var handler = {
			init: function(){
				handler.pars();		
				//
				handler.build();		
				//
				handler.evt();
				//
				handler.tab();				
			},
			pars: function(){
				cache = opts['data'];
				//
				for(var i=0,len=dycache.fixed.length;i<len;i++){
					dycache.staticPlugin[dycache.fixed[i]]=dycache.fixed[i]
				}
				dycache.backup = opts['data']['list'].slice(0);
			},
			build: function(){
				var builders = $.builder($L(TEMP.tab+TEMP.add+TEMP.sort));
				nodes = $.kit.dom.parseDOM(builders.list);
				//
				layer = $.ui.dialog({isHold:true,template:TEMP.frame});
				layer.appendChild(builders.box);
			},
			evt: function(){
				devt = $.delegatedEvent(layer.getDom('inner'));
				for(var k in act){
					devt.add(k,'click',act[k]);
				}
			},
			tab: function(){
				tab = $.module.editorPlugin.tab(layer.getDom('inner'), {
					'evtType' : 'click',
					'tNodes' : nodes.tab,
					'dNodes' : nodes.tab_con,
					'className' : conf['hoverClass'],
					'defaultIdx' : 0,
					'cb' : function(ret){
						tabChange.render(ret);
					}
				});	
				tab.initView();			
			},
			show: function(pars){				
				var index = pars.data.index||0;
				tab.refresh(index);
				//
				layer.show().setMiddle();
			},
			reset: function(){
				//reset pars
				selectedItem = null;
				dycache.reset();
				//rebuild ui
				tabChange.sourceList();
				tabChange.usedList();
				tabChange.sortPreview();
				tabChange.sortList();
				btnStates.refreshSortBtn();
			},
			destroy: function(){
				for(var k in act){
					devt.remove(k,'click',act[k]);
				}
				//
				layer.destroy();
			}
		}
		//外抛函数
		it.layer = layer;
		it.show = handler.show;
		it.destroy = handler.destroy;
		//启动函数
		handler.init();
		return it;	
	}
});