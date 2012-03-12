$Import('ui.bubble');
$Import('common.trans.editor');
$Import('common.magic');

STK.register('common.bubble.face', function($){
	
	var TEMP = '' + 
	'<div node-type="outer" class="layer_faces clearfix">' +
		'<div class="tab W_textb">' +
			'<p>' +
				'<a href="javascript:void(0);" node-type="general">常用表情</a>' +
				'<em class="W_vline">|</em>' +
				'<a href="javascript:void(0);" node-type="magic"><span class="ico_magic"></span>魔法表情</a>' +
			'</p>' +
		'</div>' +
		'<div class="">' +
			'<p class="tab_kind W_linkb">' +
			'<span class="right">' +
				'<a href="javascript:void(0);" node-type="prev" action-type="prev" class="pre_d"></a>' +
				'<a href="javascript:void(0);" node-type="next" action-type="next" class="next"></a>' +
			'</span>' +
			'<em node-type="categorys"></em>' +
			'<div class="detail">' +
				'<ul class="faces_list faces_list_hot clearfix" node-type="hotFace"></ul>' +
				'<ul class="faces_list" node-type="inner"></ul>' +
				'<div class="W_pages_minibtn" node-type="page"></div>' +
			'</div>' +
		'</div>' +
	'</div>';
	var CATEGORY_TEMP = '<a href="javascript:void(0);" onclick="return false;" action-type="category" action-data="category=#{itemEncode}">#{item}</a>';
	
	var CATEGORY_SELECTED_TEMP = '<a href="javascript:void(0);" onclick="return false;" action-type="category" action-data="category=#{itemEncode}" class="current W_texta">#{item}</a>';
	
	var GENERAL_ITEM_TEMP = '<li action-type="insert" action-data="text=#{phrase}"><img src="#{icon}" alt="#{phraseB}" title="#{phraseB}"/></li>';
	
	var MAGIC_ITEM_TEMP = '<li><a action-type="insert" action-data="text=#{value}" class="img" href="javascript:void(0);"><img src="#{icon}" alt="#{phrase}" title="#{phrase}"/></a><a title="表情预览" class="play" href="javascript:void(0);" action-type="play" action-data="swf=#{swf}"></a><span>#{phrase}</span></li>';
	
	var PAGE_TEMP = '<a action-type="page" action-data="num=#{number}" href="javascript:void(0);" onclick="return false;">#{label}</a>';
	
	var PAGE_SELECTED_TEMP = '<a action-type="page" action-data="num=#{number}" href="javascript:void(0);" class="current" onclick="return false;">#{label}</a>';
	
	var LOADING_TEMP = '<div class="W_loading"><span>正在加载，请稍候...</span></div>';
	
	var CLEAR_TEMP = '<li class="clear"></li>';
	
	var CUT_OFF = '<em class="W_vline">|</em>';
	
	var CATEGORY_NUM = 5;
	
	var CATEGORY_DEFAULT = '默认';
	
	var lay, dom, bub, delegate, currentFO, that;
	
	that = {};
	
	var enc = window.encodeURIComponent , dec = window.decodeURIComponent;
	
	var rendCategory = function(fo){ //rend category
		var pot = fo.cPoniter;
		var cat = fo.categorys;
		var cur = dec(fo.currentCategory);
		var list = cat.slice(pot, pot + CATEGORY_NUM);
		list = $.foreach(list, function(key,index){
			if(cur === key){
				return $.templet(CATEGORY_SELECTED_TEMP, {'item' : key , 'itemEncode' : enc(key)});
			}else{
				return $.templet(CATEGORY_TEMP,{'item': key , 'itemEncode' : enc(key)});
			}
		});
		dom['categorys'].innerHTML = list.join(CUT_OFF);
		
		if(pot + CATEGORY_NUM >= cat.length){
			dom['next'].className = 'next_d';
		}else{
			dom['next'].className = 'next';
		}
		if(pot <= 0){
			dom['prev'].className = 'pre_d';
		}else{
			dom['prev'].className = 'pre';
			
		}
	};
	
	var rendPage = function(fo){
		var page = fo.page;
		var list = fo.cache[dec(fo.currentCategory)];
		var total = list.length/fo.itemNumber;
		var buff = [];
		for(var i = 0; i < total; i += 1){
			if(page == i){
				buff.push($.templet(PAGE_SELECTED_TEMP,{
					'number':i,
					'label': i + 1
				}));
			}else{
				buff.push($.templet(PAGE_TEMP,{
					'number':i,
					'label': i + 1
				}));
			}
			
		}
		dom['page'].innerHTML = buff.join('');
		if(page === 0 && fo === general && dec(fo.currentCategory) === CATEGORY_DEFAULT){
			dom['hotFace'].style.display = '';
		}else{
			dom['hotFace'].style.display = 'none';
		}
	};
	
	var evt = {
		'general' : function(e){
			currentFO = general;
			currentFO.init();
			dom['general'].className = 'current W_texta';
			dom['magic'].className = '';
			dom['inner'].className = 'faces_list clearfix';
		},
		'magic' : function(e){
			currentFO = magic;
			currentFO.init();
			dom['general'].className = '';
			dom['magic'].className = 'current W_texta';
			dom['inner'].className = 'faces_magic_list';
		}
	};
	
	var dlgtEvt = {
		'category' : function(spec){
			currentFO.page = 0;
			currentFO.currentCategory = spec.data.category;
			currentFO.rend();
			setTimeout(function(){
				rendCategory(currentFO);
				rendPage(currentFO);
			},0);
		},
		'prev' : function(spec){
			var pot = currentFO.cPoniter;
			var cat = currentFO.categorys;
			if(pot <= 0){
				return false;
			}
			currentFO.cPoniter -= CATEGORY_NUM;
			rendCategory(currentFO);
		},
		'next' : function(spec){
			var pot = currentFO.cPoniter;
			var cat = currentFO.categorys;
			if(pot >= cat.length - CATEGORY_NUM){
				return false;
			}
			currentFO.cPoniter += CATEGORY_NUM;
			rendCategory(currentFO);
		},
		'play' : function(spec){
			$.common.magic(spec.data.swf);
		},
		'insert' : function(spec){
			
			$.custEvent.fire(that, 'insert', {'value': spec.data.text});
		},
		'page' : function(spec){
			currentFO.page = parseInt(spec.data.num, 10);
			currentFO.rend();
			setTimeout(function(){
				rendPage(currentFO);
			},0);
		}
	};
	
	var init = function(foName){
		bub = $.ui.bubble();
		rend();
		bind();
		evt[foName]();
		$.custEvent.add(bub, 'hide', (function(bub){
			return function(){
				$.custEvent.remove(bub, 'hide', arguments.callee);
				$.custEvent.fire(that, 'hide', {});
			};
		})(bub));
	};
	
	var rend = function(){
		lay = $.module.layer(TEMP);
		dom = {};
		var domlist = lay.getDomList();
		for(var k in domlist){
			dom[k] = domlist[k][0];
		}
		
		rend = function(){
			bub.setContent(dom['outer']);
		};
		rend();
	};
	
	var bind = function(){
		$.custEvent.define(that, 'insert');
		$.custEvent.define(that, 'hide');
		
		$.addEvent(dom['general'],'click',evt['general']);
		
		$.addEvent(dom['magic'],'click',evt['magic']);
		
		delegate = $.core.evt.delegatedEvent(dom['outer']);
		
		delegate.add('category','click', dlgtEvt['category']);
		
		delegate.add('prev','click', dlgtEvt['prev']);
		
		delegate.add('next','click', dlgtEvt['next']);
		
		delegate.add('insert','click', dlgtEvt['insert']);
		
		delegate.add('play', 'click', dlgtEvt['play']);
		
		delegate.add('page', 'click', dlgtEvt['page']);
		
		bind = function(){};
	};
	
	var general = {//普通的表情
		'init' : function(){
			dom['inner'].innerHTML = LOADING_TEMP;
			$.common.trans.editor.getTrans('face',{
				'onSuccess' : function(ret, params){
					/*---初始化部分---*/
					general.cache = ret.data.more || {};
					
					
					/*--为热门表情做的调整--*/
					try{
						general.hotList = ret.data.usual.hot.slice(0,12);
						dom['hotFace'].innerHTML = $.foreach(general.hotList,function(item,index){
							item.phraseB = item.phrase.slice(1,-1);
							return $.templet(GENERAL_ITEM_TEMP,item);
						}).join('');
					}catch(exp){
						
					}
					/*--热门表情调整结束--*/
					
					
					general.categorys = [CATEGORY_DEFAULT];
					for(var k in general.cache){
						general.categorys.push(k);
					}
					general.cache[CATEGORY_DEFAULT] = ret.data.usual.norm;
					/*---end 初始化部分---*/
					/*---懒加载部分---*/
					general.init = function(){
						general.page = 0;
						general.cPoniter = 0;
						general.currentCategory = CATEGORY_DEFAULT;
						general.rend();
						rendCategory(general);
						rendPage(general);
						
					};
					general.init();
					/*---end 懒加载部分---*/
				},
				'onError' : function(ret, params){
					
				}
			}).request({});
		},
		'rend' : function(){
			var cur = general.currentCategory;
			var list = general.cache[dec(cur)];
			var page = general.page;
			var cont = general.itemNumber;
			list = list.slice(page*cont, page*cont + cont);
			list = $.foreach(list,function(item,index){
				item.phraseB = item.phrase.slice(1,-1);
				return $.templet(GENERAL_ITEM_TEMP,item);
			});
			//list.push(CLEAR_TEMP);
			dom['inner'].innerHTML = list.join('');
		},
		'page' : 0,
		'cache' : null,
		'hotList' : null,
		'cPoniter' : 0,
		'categorys' : [],
		'currentCategory' : CATEGORY_DEFAULT,
		'itemNumber' : 72
	};
	
	var magic = {//普通的表情
		'init' : function(){
			dom['inner'].innerHTML = LOADING_TEMP;
			dom['hotFace'].style.display = 'none';
			$.common.trans.editor.getTrans('magicFace',{
				'onSuccess' : function(ret, params){
					/*---初始化部分---*/
					magic.cache = ret.data.more || {};
					magic.categorys = [CATEGORY_DEFAULT];
					for(var k in magic.cache){
						magic.categorys.push(k);
					}
					magic.cache[CATEGORY_DEFAULT] = ret.data.usual.norm;
					/*---end 初始化部分---*/
					/*---懒加载部分---*/
					magic.init = function(){
						magic.page = 0;
						magic.cPoniter = 0;
						magic.currentCategory = CATEGORY_DEFAULT;
						magic.rend();
						rendCategory(magic);
						rendPage(magic);
					};
					magic.init();
					/*---end 懒加载部分---*/
				},
				'onError' : function(ret, params){
					
				}
			}).request({'type':'ani'});
		},
		'rend' : function(category,pager){
			var cur = magic.currentCategory;
			var list = magic.cache[dec(cur)];
			var page = magic.page;
			var cont = magic.itemNumber;
			list = list.slice(page*cont, page*cont + cont);
			list = $.foreach(list,function(item,index){
				item.swf = item.icon.slice(0, -4) + '.swf';
				return $.templet(MAGIC_ITEM_TEMP,item);
			});
			list.push(CLEAR_TEMP);
			dom['inner'].innerHTML = list.join('');
		},
		'page' : 0,
		'cache' : null,
		'cPoniter' : 0,
		'categorys' : [],
		'currentCategory' : CATEGORY_DEFAULT,
		'itemNumber' : 12
	};
	that.getBub = function(){
		return bub;
	};
	return function(el, opts){
		if(!$.isNode(el)){
			throw 'common.bubble.face need el as first parameter!';
		}
		var conf = $.parseParam({
			'l' : 0
		},opts);
		init('general');
		bub.setLayout(el,{'offsetX':-29, 'offsetY':5});
		bub.show();
		return that;
	};
});
