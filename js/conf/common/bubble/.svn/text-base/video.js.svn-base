$Import('ui.bubble');
$Import('common.trans.editor');
$Import('kit.extra.language');

STK.register('common.bubble.video', function($){
	
	var $L = $.kit.extra.language;
	var DEFAULTINPUT = $L("#L{请输入视频播放页地址}");
	
	var TEMP = $L('' + 
	'<div class=" layer_send_medias" style="width:302px;" node-type="outer">' +
	'<div class="tab W_textb"><p><a class="current W_texta" node-type="tabs" action-type="switchTab" action-data="type=0" href="javascript:void(0);">#L{在线视频}</a><a action-type="switchTab" action-data="type=1" node-type="tabs" href="javascript:void(0);">#L{上传视频}</a></p></div>' +
	'<div node-type="inner"><div node-type="content"><div class="laMed_inp">' +
	'<input node-type="videoInput" action-type="videoInput" type="text" class="W_input inp_video" value="' + DEFAULTINPUT + '" style="color:#999" /> ' +
	'<a href="javascript:void(0);" class="W_btn_a" action-type="videoSubmit"><span>#L{确定}</span></a>' +
	'<p class="laMed_err W_error" style="display:none;" node-type="errorWord">#L{你输入的链接地址无法识别}</p>' +
	'<p class="laMed_err" style="display:none;" node-type="optional"><a href="javascript:void(0);" action-type="cancel">#L{取消操作}</a> #L{或者} <a href="javascript:void(0);" action-type="normalLink">#L{作为普通的链接发布}</a></p>' +
	'</div>' +
	'<div class="laMed_con W_textb W_linkb">#L{目前已支持}<a target="_blank" href="http://video.sina.com.cn">#L{新浪播客}</a>、<a target="_blank" href="http://www.youku.com">#L{优酷网}</a>、<a target="_blank" href="http://www.tudou.com">#L{土豆网}</a>、<a target="_blank" href="http://www.ku6.com/">#L{酷6网}</a>、<a target="_blank" href="http://www.56.com/">#L{我乐网}</a>、<a target="_blank" href="http://www.qiyi.com/">#L{奇艺网}</a>、<a target="_blank" href="http://www.ifeng.com/">#L{凤凰网}</a>#L{等视频网站的视频播放页链接。}</div>' +
	'</div>'+
	'<div node-type="content" class="laMed_btn" style="display:none;"><a class="W_btn_b" href="javascript:void(0);" action-type="uploadVideo"><span><em class="ico_updatevideo"></em>#L{从电脑直接上传视频}</span></a> <p class="W_textb">#L{可选择保存到新浪播客或者土豆网}</p></div>' +
	'</div>'+
	'</div>');

	var dom, conf, bub, outer, nodeList, inputCache;
	var that = {};
	var getStyle = $.core.dom.getStyle;
	var setStyle = $.core.dom.setStyle;
	var addEvent = $.core.evt.addEvent;
	var removeEvent = $.core.evt.removeEvent;
	var preventDefault = $.core.evt.preventDefault;
	var trim = $.core.str.trim;
	//var VIDEOUPLOAD = 'http://upload.video.sina.com.cn/index.php';
	var VIDEOUPLOAD = 'http://app.kandian.com/app/weibo_upload/upload';
	
	var inputFocus = function(){
		var input = nodeList.videoInput;
		var val = trim(input.value);

		if(val == '' || val == DEFAULTINPUT){
			input.value = '';
		}else{
			input.select();
		}
	};

	var inputBlur = function(){
		var input = nodeList.videoInput;
		var val = trim(input.value);

		if(val == '' ||  val == DEFAULTINPUT){
			input.value = DEFAULTINPUT;
			return false;
		}
	};

	var inputClear = function(){
		nodeList.videoInput.value = DEFAULTINPUT;
		hideError();
	};
	
	var inputChange = function(){
		var value = $.core.str.trim(nodeList.videoInput.value);
		if(value != inputCache){
			hideError();
		}
	};
	
	var inputSubmit = function(){
		var val = trim(nodeList.videoInput.value);

		preventDefault();
		
		if(val !== ''){
			inputCache = val;
			$.common.trans.editor.getTrans('parseVideo',{
				'onSuccess' : function(data){
					urlCache = data.data.url + ' ';
					$.custEvent.fire(that,'insert',{value:urlCache});
					bub.hide();
				},
				'onError' : function(data){
					showError();
				}
			}).request({'url':val});
		}
	};
	
	var showError = function(){
		nodeList.errorWord.style.display = '';
		nodeList.optional.style.display = '';
	};
	
	var hideError = function(){
		nodeList.errorWord.style.display = 'none';
		nodeList.optional.style.display = 'none';
	};

	var normalLink = function(){
		var value = $.core.str.trim(nodeList.videoInput.value);
		$.custEvent.fire(that,'insert',{'value':value + ' '});
		bub.hide();
	};

	var init = function(){
		dom = $.module.layer(TEMP);
		bub = $.ui.bubble();
		outer = dom.getOuter();
		nodeList = $.kit.dom.parseDOM(dom.getDomList());
		bind();
		$.custEvent.add(bub, 'hide', (function(bub){
			return function(){
				$.custEvent.remove(bub, 'hide', arguments.callee);
				$.custEvent.fire(that, 'hide', {});
			};
		})(bub));
	};

	that.getBub = function(){
		return bub;
	};

	var bind = function(){
		$.custEvent.define(that, 'insert');
		$.custEvent.define(that, 'hide');
		$.custEvent.define(that, 'upload');

		var d = $.core.evt.delegatedEvent(outer);
		d.add('normalLink','click',normalLink);
		d.add('videoSubmit','click',inputSubmit);
		d.add('cancel','click',function(){
			inputClear();
			bub.hide();
		});
		d.add('uploadVideo','click',function(){
			$.custEvent.fire(that,'upload',{el:outer,url:VIDEOUPLOAD});
		});
		//ad dby zhaobo 201110201335
		d.add('switchTab','click',function(obj){
			var type = obj.data.type * 1;
			$.core.dom.removeClassName(nodeList['tabs'][!type*1], "current");
			$.core.dom.removeClassName(nodeList['tabs'][!type*1], "W_texta");
			$.core.dom.addClassName(nodeList['tabs'][type], "current");
			$.core.dom.addClassName(nodeList['tabs'][type], "W_texta");
			nodeList['content'][!type*1].style.display = "none";
			nodeList['content'][type].style.display = "";
		});
		//ad dby zhaobo 201110201335
		$.addEvent(nodeList.videoInput,'keyup',inputChange);
		$.addEvent(nodeList.videoInput,'blur',inputBlur);
		$.addEvent(nodeList.videoInput,'focus',inputFocus);
	};

	return function(el){
		init();

		if(!$.isNode(el)){
			throw 'common.bubble.video need el as first parameter!';
		}

		bub.setContent(outer);
		bub.setLayout(el,{'offsetX':-29, 'offsetY':5});
		bub.show();

		return that;
	};
});
