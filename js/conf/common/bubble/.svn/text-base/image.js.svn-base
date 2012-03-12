/**
 * yuheng || yuheng@staff.sina.com.cn
 */
$Import('ui.bubble');
$Import('ui.alert');
$Import('kit.extra.language');
$Import('kit.dom.parseDOM');
$Import('common.extra.imageURL');
$Import('module.editorPlugin.tab');
$Import('common.flash.imgUpload');
$Import('kit.extra.merge');

STK.register('common.bubble.image', function($) {
	var cfg = window.$CONFIG;
	//外壳的模版
	var TEMPOUTER = '' +
			'<div node-type="outer">' +
			'<div class="layer_send_pic" node-type="wrap">' +
			'<div node-type="inner">' +
			'<div class="tab W_textb">' +
			'<p>' +
			'<a class="current" href="javascript:void(0);" node-type="tab">#L{本地上传}</a>' +
			'<a href="javascript:void(0);" node-type="tab">#L{推荐配图}</a>' +
			'</p>' +
			'</div>' +
			'<div node-type="content"></div>' +
			'</div>' +
			'<div node-type="uploaded" style="display:none">'+
			'<div class="laPic_tit">' +
			'<span node-type="pName"></span><span class="right"></span></div>' +
			
			'<div node-type="picWrap" class="laPic_Pic"></div>' +
			'<div class="lapic_edit">' +
			'<a class="beautify" href="javascript:void(0);" action-type="beautify" suda-data="key=meitu&value=v4||publish||editor">#L{编辑}</a>' +
			'<a class="delete" href="javascript:void(0);" action-type="delete">#L{删除}</a>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div node-type="flashPanel"></div>';

	//上传模版
	var TEMPUPLOAD = '' +
			'<div node-type="uppic">'+
			'	<div class="laPic_btnBox clearfix">'+
			'		<div class="laPic_btnmore">' +
			'			<a href="javascript:void(0);" class="W_btn_b choose_pic" node-type="inputCover">' +
			'				<span><em class="ico_one"></em>#L{单张图片}</span>' +
			'				<form node-type="form" action-type="form" id="pic_upload" name="pic_upload" target="upload_target" enctype="multipart/form-data" method="POST" action="">' +
			'					<input class="input_f" type="file" hidefoucs="true" style="" node-type="fileBtn" name="pic1"/>' +
			'				</form></a>' +
			'		</div>' +
			'		<div class="laPic_btnmore">' +
			'			<a href="javascript:void(0);" class="W_btn_b choose_pic" node-type="inputCover">' +
			'				<span action-type="more" suda-data="key=meitu&value=v4||publish||more"><em class="ico_ones"></em>#L{多张图片}</span>' +
			'			</a>' +
			'		</div>' +
			'	</div>' +
			'	<div class="laPic_con W_textb"  node-type="info">#L{支持上传单张5M以下的gif、jpg、png文件}</div>'+
			'</div>'+
			'<div node-type="loading"  style="width:230px;display:none">' +
			'<div class="laPic_con">' +
			'<div class="W_loading"><span>#L{图片正在上传，请等待}...</span></div>' +
			'</div>' +
			'<div class="laPic_btn">' +
			'<a href="javascript:void(0);" class="W_btn_a" action-type="cancel"><span>#L{取消上传}</span></a>' +
			'</div>' +
			'</div>';
	
	var	CARTOONOUTER = '' +
			'<p class="tab_kind W_linkb">' +
			'<span class="right"><a class="pre_d" action-type="prev" node-type="prev" href="javascript:void(0);"></a><a class="next" action-type="next" node-type="next" href="javascript:void(0);"></a></span>' +
			'<em node-type="categorys"></em>' +
			'</p>' +
			'<div node-type="loading"></div>'+
			'<div class="detail">' +
			'<ul node-type="list" class="faces_magic_list clearfix"></ul>' +
			'<div node-type="page" class="W_pages_minibtn"></div>' +
			'</div>';

	var LOADING_TEMP = '<div class="W_loading"><span>正在加载，请稍候...</span></div>';

	var CATEGORY_TEMP = '<a href="javascript:void(0);" onclick="return false;" action-type="category" action-data="category=#{item}">#{item}</a>';

	var CATEGORY_SELECTED_TEMP = '<a href="javascript:void(0);"  onclick="return false;" action-type="category" action-data="category=#{item}" class="current W_texta">#{item}</a>';

	var PIC_ITEM_TEMP = '<li><a action-type="insertSmiley" action-data="url=#{thumb}&pid=#{picid}&value=#{value}" class="img" href="javascript:void(0);"><img src="#{thumb}" original="#{original}" title="#{value}" alt="#{phrase}" /></a><span title="#{value}"  action-type="insertSmiley" action-data="url=#{thumb}&pid=#{picid}&value=#{value}">#{phrase}</span></li>';

	var PAGE_TEMP = '<a action-type="page" action-data="num=#{number}" href="javascript:void(0);" >#{label}</a>';

	var PAGE_SELECTED_TEMP = '<a action-type="page" action-data="num=#{number}" href="javascript:void(0);"  class="current"  onclick="return false;">#{label}</a>';

	var CUT_OFF = '<em class="W_vline">|</em>';

	var CATEGORY_DEFAULT = '默认';

	var DEFAULT_WORD = '#L{分享图片}';

	var CATEGORY_NUM = 5;

	var IMGMASK = "weibo.com/";

	var bub, outer, inner, content, cancel, cacheTab, wmark, uppid;
	var imgName, cacheData, dEvent;
	var that = {};
	var msg = {
		'alert'     : '#L{上传的图片不正确}',
		'outdate' : '#L{上传图片超时}'
	};


	var cartoon = {
		'page' : 0,
		'cache' : null,
		'cPoniter' : 0,
		'categorys' : [],
		'currentCategory' : CATEGORY_DEFAULT,
		'itemNumber' : 10
	};
	//---变量定义区----------------------------------
	//----------------------------------------------
	var nodes;
	var position = $.core.dom.position;
	var addEvent = $.core.evt.addEvent;
	var rmEvent = $.core.evt.removeEvent;
	var L = $.kit.extra.language;

	var bind = function() {
		$.custEvent.define(that, 'uploaded');
		$.custEvent.define(that, 'hide');
		$.custEvent.define(that, 'insert');
		$.custEvent.define(that, 'deletePIC');
		$.custEvent.define(that, 'picLoad');
		$.custEvent.add(bub, 'hide', (function(bub) {
			return function() {
				$.custEvent.remove(bub, 'hide', arguments.callee);
				$.custEvent.fire(that, 'hide', {});
			};
		})(bub));
		$.module.editorPlugin.tab(outer, {
			'evtType' : 'click',
			'tNodes' : '[node-type="tab"]',
			'className' : 'current',
			'cb' : [upLoad.init,cartoonPic.init]
		});
		dEvent = $.core.evt.delegatedEvent(outer);
		upLoad.bind();
	};

	var upLoad = {
		init : function() {
			upLoad.initDom();
			upLoad.bind();
		},

		initDom : function() {
			var uploadDOM;
			
			cacheTab = upLoad;

			nodes['wrap'].className = 'layer_send_pic';
			nodes['content'].innerHTML = L(TEMPUPLOAD);
			nodes['close'] = (bub.getDomList().close)[0];
			
			uploadDOM = $.kit.dom.parseDOM($.core.dom.builder(outer).list);
			nodes = $.kit.extra.merge(nodes, uploadDOM);

			upLoad.exchangeInput();
		},

		bind : function() {
			addEvent(nodes.inputCover, 'mousemove', upLoad.ajust);
			addEvent(nodes.fileBtn, 'change', bindDOMFuncs.upload);
			dEvent.add('delete', 'click', upLoad.deletePic);
			dEvent.add('cancel', 'click', upLoad.cancelUpload);
			dEvent.add('more', 'click', upLoad.morePic);
			dEvent.add('beautify', 'click', upLoad.beautify)
		},

		destroy : function() {
			rmEvent(nodes.inputCover, 'mousemove', upLoad.ajust);
			rmEvent(nodes.fileBtn, 'change', bindDOMFuncs.upload);
		},

		handle : function(opts) {
			 if (!opts || opts.ret < 0) {
				var text = opts?msg.alert:msg.outdate;
				//上传出错，发出统计给图片统计接口
				opts ? upLoad.sendError({"ret" : opts.ret}) : upLoad.sendError({"ret" : "none"});
				
				$.ui.alert(L(text), {
					'OK' : function() {
						bub.hide();
					}
				});
			} else {
				upLoad.stopUpload();
				if(cancel){
					nodes.uppic.style.display = '';
					cancel = false;
				}else{
					upLoad.rendSucc(opts);
				}
			}
		},
		
		sendError : function(e){
			var img = new Image(),
			url = e,
			ua = encodeURIComponent(window.navigator.userAgent);
			
			url = $.kit.extra.merge(url,
				{
					"ua" : ua,
					"rnd" : (new Date()).getTime(),
					"uid" : $CONFIG ? $CONFIG['uid'] : "0",
					"referer" : encodeURIComponent(window.location.href)
				});
			url = $.core.json.jsonToQuery(url);
			url = "http://ww1.sinaimg.cn/do_not_delete/fc.html" + "?" + url;
			img.setAttribute('src', url);
		},

		rendLoad : function () {
			bub.stopBoxClose();
			nodes.uppic.style.display = 'none';
			nodes.loading.style.display = '';
		},

		ajust : function(e) {
			var evt = $.fixEvent(e);
			var el = nodes.inputCover;
			var actEl = nodes.fileBtn;
			var pos = position(el);
			var sPos = $.scrollPos();
			var mouseY = sPos.top + evt.clientY;
			var mouseX = sPos.left + evt.clientX;

			var inputOffX = parseInt(actEl.offsetWidth / 2),inputOffY = parseInt(actEl.offsetHeight / 2);
			var offY = mouseY - pos.t;
			var offX = mouseX - pos.l;

			var cssText = [];
			cssText.push('left:' + (offX - inputOffX) + 'px');
			cssText.push('top:' + (offY - inputOffY) + 'px');

			actEl.style.cssText = cssText.join(';');
		},

		rendSucc : function(opts) {
			var url = $.common.extra.imageURL(opts.pid);
			var arr = [],name,str;
			imgName = imgName||opts.pid;
			arr = imgName.split(/\/|\\/);
			name = arr[arr.length - 1];
			arr = name.split('.');
			if (arr.length>1&&$.bLength(arr[0]) > 20) {
				arr[0] = $.leftB(arr[0], 20);
				str = [arr[0],'...',arr[1]].join('');
			} else {
				str = name;
			}
			uppid = opts.pid;
			bindDOMFuncs.loadPic({url:url,value:str,pid:opts.pid});
		},

		deletePic : function() {
			nodes.close.style.display = '';
			nodes.inner.style.display = '';
			nodes.wrap.style.width = '';
			nodes.uploaded.style.display = 'none';
			nodes.picWrap.innerHTML = '';
			nodes.fileBtn.value = '';

			cacheTab.destroy();
			cacheTab.init();
			bub.startBoxClose();
			$.custEvent.fire(that,'deletePIC',{text:L(DEFAULT_WORD)});
		},

		stopUpload : function(){
			nodes.loading.style.display = 'none';
			nodes.uppic.style.display = '';
		},

		cancelUpload : function(){
			cancel = true;
			bub.startBoxClose();
			upLoad.stopUpload();
		},

		exchangeInput : function(){
			var node = nodes.fileBtn;
			var parent = node.parentNode;
			var cls = node.className;
			var name = node.name;
			var newNode = $.C('input');

			newNode.className = cls;
			newNode.name = name;
			newNode.type = 'file';
			newNode.hidefocus = 'true';

			nodes.fileBtn = newNode;

			parent.removeChild(node);
			parent.appendChild(newNode);
		}
		,beautifySucess: function(pid){
//			upLoad.rendSucc({pid:pid});
			imgName = pid;
			upLoad.handle({pid:pid});
		}
		,morePic: function(){
			bub.stopBoxClose();
			var show = function(data){
				var showMark = data.nickname != '0' || data.logo != '0' || data.domain != '0';
				var nick = cfg && cfg.nick || '';
				var sericeUrl = 'http://picupload.service.weibo.com/interface/pic_upload.php?app=miniblog' + 
								'&marks=' + (showMark?'1':'0') + 
								(data.logo == "1" ? "&logo=1" : '') + 
								(data.nickname == '1' ? ("&nick=" + (nick ? encodeURIComponent('@' + nick) : '')) : '') + 
								(data.domain == '1'?("&url=" + IMGMASK+ (cfg && cfg.watermark || cfg.domain)):'') + 
								(data.position ? "&markpos=" + data.position : '') + 
								'&s=xml&cb=http://weibo.com/upimgback.html&rq=http%3A%2F%2Fphoto.i.weibo.com%2Fpic%2Fadd.php%3Fapp%3D1';
				var pars = {
					id:'photo_merge',
					pos: bub.getPosition(),
					service: sericeUrl,
					sucess:upLoad.beautifySucess,
					h: 470,
					w: 528,
					swf: 'SinaCollage.swf'
				};
				$.common.flash.imgUpload(pars,{
					init: function(it, args){
						it.setPars();
					},
					close: function(it, args){
						setTimeout(function(){
							bub.startBoxClose();
						},100);
					}
				}).show();
			};
			
			wmark?show(wmark):bindDOMFuncs.getWaterMark(show);
			
		}
		
		,beautify: function(){
			var pars = {
				id:'photo_editor',
				pos: bub.getPosition(),
				service: 'http://picupload.service.weibo.com/interface/pic_upload.php?app=miniblog&s=xml&cb=http://weibo.com/upimgback.html&rq=http%3A%2F%2Fphoto.i.weibo.com%2Fpic%2Fadd.php%3Fapp%3D1',
				sucess:upLoad.beautifySucess,
				h: 385,
				w: 528,
				swf: 'PhotoEditor.swf'
			};
			$.common.flash.imgUpload(pars,{
				init: function(it, args){
					it.setPars($.common.extra.imageURL(uppid, {
						size: 'large'
					}));
				},
				close: function(it, args){}
			}).show();
		}
	};

	var cartoonPic = {
		init : function() {
			var cartoonDOM;

			nodes.wrap.className = 'content layer_faces';

			cacheTab = cartoonPic;
			upLoad.destroy();
			nodes['content'].innerHTML = L(CARTOONOUTER);
			cartoonDOM = $.kit.dom.parseDOM($.core.dom.builder(outer).list);
			nodes = $.kit.extra.merge(nodes, cartoonDOM);

			if (!cacheData) {
				nodes['loading'].innerHTML = L(LOADING_TEMP);
			}

			cartoonPic.cartoonStart();
			cartoonPic.bind();
		},

		bind : function() {
			dEvent.add('insertSmiley', 'click', function(spec) {
				STK.core.evt.preventDefault();

				var _url = spec.data.url;
				var pic_id = spec.data.pid;
				var value = spec.data.value;

				bindDOMFuncs.loadPic({url:_url,value:value,pid:pic_id});
			});

			dEvent.add('category', 'click', function(spec) {
				cartoon.page = 0;
				cartoon.currentCategory = spec.data.category;
				cartoonPic.rend();
				setTimeout(function() {
					cartoonPic.rendCategory(cartoon);
					cartoonPic.rendPage(cartoon);
				}, 0);
			});

			dEvent.add('prev', 'click', function(spec) {
				var pot = cartoon.cPoniter;
				if (pot <= 0) {
					return false;
				}
				cartoon.cPoniter -= CATEGORY_NUM;
				cartoonPic.rendCategory(cartoon);
			});

			dEvent.add('next', 'click', function(spec) {
				var pot = cartoon.cPoniter;
				var cat = cartoon.categorys;
				if (pot >= cat.length - CATEGORY_NUM) {
					return false;
				}
				cartoon.cPoniter += CATEGORY_NUM;
				cartoonPic.rendCategory(cartoon);
			});

			dEvent.add('page', 'click', function(spec) {
			
				cartoon.page = parseInt(spec.data.num, 10);
				cartoonPic.rend();
				setTimeout(function() {
					cartoonPic.rendPage(cartoon);
				}, 0);
			
				return STK.preventDefault(spec.evt);
			});

		},
		
		cartoonStart : function() {
			$.common.trans.editor.getTrans('cartoon', {
				'onSuccess' : function(ret, params) {
					/*---初始化部分---*/
					cartoon.cache = ret.data.more || {};
					cartoon.categorys = [CATEGORY_DEFAULT];
					for (var k in cartoon.cache) {
						cartoon.categorys.push(k);
					}
					cartoon.cache[CATEGORY_DEFAULT] = ret.data.usual.norm;

					cartoonPic.cartoonStart = function() {
						cartoon.page = 0;
						cartoon.cPoniter = 0;
						cartoon.currentCategory = CATEGORY_DEFAULT;
						cartoonPic.rend();
						cartoonPic.rendCategory(cartoon);
						cartoonPic.rendPage(cartoon);
					};
					cartoonPic.cartoonStart();
				}
			}).request({});
		},

		'rend' : function(category, pager) {
			var cur = cartoon.currentCategory;
			var list = cartoon.cache[cur];
			var page = cartoon.page;
			var cont = cartoon.itemNumber;
			list = list.slice(page * cont, page * cont + cont);
			list = $.foreach(list, function(item, index) {

				if($.bLength(item.phrase) > 8){
					item.phrase = [$.leftB(item.phrase,6),'...'].join('');
				}

				return $.templet(L(PIC_ITEM_TEMP), item);
			});
			nodes['loading'].innerHTML = '';
			nodes['list'].innerHTML = list.join('');
		},

		rendCategory : function(fo) { //rend category
			var pot = fo.cPoniter;
			var cat = fo.categorys;
			var cur = fo.currentCategory;
			var list = cat.slice(pot, pot + CATEGORY_NUM);
			list = $.foreach(list, function(key, index) {
				if (cur === key) {
					return $.templet(L(CATEGORY_SELECTED_TEMP), {'item' : key});
				} else {
					return $.templet(L(CATEGORY_TEMP), {'item': key});
				}
			});
			nodes['categorys'].innerHTML = list.join(CUT_OFF);

			if (pot + 6 >= cat.length) {
				['next'].className = 'next_d';
			} else {
				nodes['next'].className = 'next';
			}
			if (pot <= 0) {
				nodes['prev'].className = 'pre_d';
			} else {
				nodes['prev'].className = 'pre';

			}
		},

		rendPage : function(fo) {
			var page = fo.page;
			var list = fo.cache[fo.currentCategory];
			var total = list.length / fo.itemNumber;
			var buff = [];
			for (var i = 0; i < total; i += 1) {
				if (page == i) {
					buff.push($.templet(L(PAGE_SELECTED_TEMP), {
						'number':i,
						'label': i + 1
					}));
				} else {
					buff.push($.templet(L(PAGE_TEMP), {
						'number':i,
						'label': i + 1
					}));
				}

			}
			nodes['page'].innerHTML = buff.join('');
		},

		destroy : function(){

		}
	};

	//---DOM事件绑定的回调函数定义区---------------------
	var bindDOMFuncs = {
		trans: function(pars){
			$.core.io.ijax({
				'url' : 'http://picupload.service.weibo.com/interface/pic_upload.php',
				'form' : STK.E('pic_upload'),
				'abaurl' : 'http://' + document.domain + '/aj/static/upimgback.html',
				'abakey' : 'cb',
				'timeout' : 1800 * 1000,
				'onComplete' : upLoad.handle,
				'onTimeout' : upLoad.handle,
				'args' : {
					'marks' : 1,
					'app' : 'miniblog',
					's' : 'rdxt',
					'url' : (pars.domain == '1')?IMGMASK + (cfg && cfg.watermark || cfg.domain):0,
					'markpos' : pars.position || '',
					'logo':pars.logo || '',
					'nick' : (pars.nickname == '1')?'@'+ (cfg && cfg.nick) : 0
				}
			});
		},
		
		getWaterMark: function(call){
			$.common.trans.editor.getTrans('waterMark', {
				'onSuccess' : function(ret, params) {
					wmark = ret.data;
					call&&call(wmark);
				}
			}).request();
		},
		
		upload : function() {
			imgName = nodes.fileBtn.value;
			if ($.core.str.trim(imgName) === '') {
				return;
			}
			upLoad.rendLoad();
			//
			wmark?bindDOMFuncs.trans(wmark):bindDOMFuncs.getWaterMark(bindDOMFuncs.trans);
		},

		loadPic : function(obj) {
			//meitu flash add
			nodes.picWrap.innerHTML = '';
			//
			var url = obj.url;
			var close = nodes.close;
			var pic = $.C('img');
			if (obj.value) {
				nodes.pName.innerHTML = obj.value;
			}
			pic.src = url;

			bub.stopBoxClose();
			$.core.evt.custEvent.fire(that, 'uploaded',{text:L(DEFAULT_WORD),pid:obj.pid});

			nodes.wrap.style.display = '';
			nodes.wrap.className = 'layer_send_pic';
			nodes.wrap.style.width = '240px';
			nodes.inner.style.display = 'none';
			nodes.uploaded.style.display = '';
			close.style.display = "none";

			nodes.picWrap.appendChild(pic);
		}
	};
	//-------------------------------------------

	//---自定义事件绑定的回调函数定义区--------------------
	var bindCustEvtFuncs = {
	};
	/*修复bp跳页时上传成功但是没有发布的图片不隐藏的问题start*/
	(function() {
		if(cfg && cfg.bigpipe === "true") {
			$.historyM.onpopstate(function(ret){
				bub.stopBoxClose();
				bub.hide();
			});
		}
	})();
	/*修复bp跳页时上传成功但是没有发布的图片不隐藏的问题end*/
	that.getBub = function(){
		return bub;
	};

	return function(el, opts) {
		if (!$.isNode(el)) {
			throw 'common.bubble.image need el as first parameter!';
		}
		nodes = $.kit.dom.parseDOM($.core.dom.builder(L(TEMPOUTER)).list);
		outer = nodes.outer;
		bub = $.ui.bubble();
		upLoad.initDom();

		if(opts && opts.pid){	// Modified by L.Ming 增加opts为空的判断
			var url = $.common.extra.imageURL(opts.pid);
			bindDOMFuncs.loadPic({url:url,pid:opts.pid});
		}
		bind();

		bub.setContent(outer);
		bub.setLayout(el,{'offsetX':-29, 'offsetY':5});
		that.bubble = bub;
		bub.show();
		return that;
	};
});
