$Import('kit.extra.language');
$Import('module.getDiss');
$Import('module.layer');
$Import('ui.dialog');
$Import('common.editor.base');
$Import('common.editor.widget.face');
$Import('common.editor.widget.image');
$Import('common.trans.feed');
$Import('common.channel.feed');
$Import('common.extra.shine');
$Import('common.dialog.validateCode');
$Import('common.editor.plugin.publishTo');
$Import('common.layer.ioError');

STK.register('common.dialog.publish',function($){

	//---常量定义区---------------------------------- 
	var TEMP = '' +
	'<#et temp data>'+
	'<div class="detail" node-type="outer">'+
		'<div class="send_weibo" node-type="wrap">' +
			'<div class="title no_title" node-type="info"></div>' +
			'<div class="num" node-type="num"></div>' +
			'<div class="input">' +
				'<div class="top_border">' +
					'<div class="bottom_border">'+
						'<textarea name="" class="W_no_outline" node-type="textEl"></textarea>' +
						'<div class="send_succpic" style="display:none" node-type="successTip"></div>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<div class="btn"><a href="javascript:void(0);" diss-data="module=shissue" node-type="submit"></a></div>' +
			'<div class="kind W_linkb" node-type="widget">' +
				'<div class="limits W_linkb"><a title="#L{公开-你发表的微博可以被大家公开查看哦}" class="W_moredown" onclick="return false" href="javascript:void(0)" node-type="showPublishTo" action-type="showPublishTo"><em><img class="i_conn_public" alt="#L{公开}" src="http://img.t.sinajs.cn/t4/style/images/common/transparent.gif"> #L{公开}</em><span class="more"></span></a></div>' +  
				'<#if (data.smileyBtn)><a href="javascript:void(0);" class="face" node-type="smileyBtn">#L{表情}</a></#if>' +
				'<#if (data.picBtn)><a href="javascript:void(0);" class="img"  node-type="picBtn" >#L{图片}</a></#if>' +
			'</div>' +
		'</div>'+
	'</div>';
		
	var MSG = {
		'title' : '#L{有什么新鲜事想告诉大家}'
	};
	//-------------------------------------------
	var lang = $.kit.extra.language;
	var options={
		'limitNum' : 140,
        'extendText' :'请文明发言,'
	};
	
	return function(spec){
		var that = {};
		
		//---变量定义区----------------------------------
		/**
		 * publishTo是定向发布插件
		 */
		var conf, lock, lockReason, dialog, doms, editor, trans, cKey, defaultValue,validateTool,publishTo;
		conf = $.parseParam({
			 'templete'  : TEMP
			,'appkey'    : ''
			,'styleId'   : '1'
			,'smileyBtn' : true
			,'picBtn'    : true
			,'pid'       : ''
		}, spec);
		
		cKey = $.custEvent.define(that, 'publish');
		$.custEvent.define(that, 'hide');
		
		var updatePublish = function(){
			var editorNode = doms['textEl'];
			if(lock){
				if(lockReason === 'error'){
					$.common.extra.shine(editorNode);
				}
				return;
			}
			lock = true;
			lockReason = 'loading';
            /**
             * Diss
             */
			var params = $.module.getDiss(getPublishParams(), doms['submit']);
			trans.request(params);
		};
		var getPublishParams = function() {
			
			var content = editor.API.getWords();
			if(defaultValue){
				if(content.indexOf(defaultValue) === -1){
					content = content + defaultValue;
				}
			}
			var params = {};
			params['appkey'] = conf['appkey'];
			params['style_type'] = conf['styleId'];
			params['text'] = content;
			var extra = editor.API.getExtra();
			if(extra){
				if(extra.indexOf('=') < 0){
					params['pic_id'] = editor.API.getExtra() || '';
				}else{
					var query = extra;
					var json = $.core.json.queryToJson(query);

					for( var key in json){
						params[key] = json[key];
					}
					$.log(params);
				}
			}
			if(publishTo && publishTo.rank) {
				//发布引导的参数
				var rank = publishTo.rank();
				params['rank'] = rank;	
			}
			return params;
		};
		var ctrlUpdatePublish = function(e){
			if((e.keyCode === 13 || e.keyCode === 10) && e.ctrlKey){
				updatePublish();
				editor.API.blur();
			}
		};
		
		var canPublish = function(evt,infos){
			var key = infos['isOver'];

			if(!key){
				lock = false;
				lockReason = '';
				doms['submit'].className = '';
				doms['num'].innerHTML =(options["extendText"] ? lang(options["extendText"]) :"") +  lang("#L{还可以输入}")  + '<span>' + (140 - infos.count) + '</span>字';
			}else{
				lock = true;
				lockReason = 'error';
				doms['submit'].className = 'disable';
				/*if(infos.count === 0){
					doms['num'].innerHTML = '还可以输入<span>' + (140 - infos.count) + '</span>字';
				}else{
					doms['num'].innerHTML = '已超出<span class="W_error">' + Math.abs(140 - infos.count) + '</span>字';
				}*/
				
			}
			
		};
		var success = function(ret, params){
			lockReason = '';
			doms['successTip'].style.display = '';
			doms['textEl'].value = '';
			setTimeout(function(){
				lock = false;
				doms['successTip'].style.display = 'none';
				dialog && dialog.hide();
				doms['submit'] && (doms['submit'].className = '');
			},2*1000);
			$.custEvent.fire(cKey, 'publish', [ret['data'], params]);
			$.common.channel.feed.fire('publish', [ret['data'], params]);
			doms['submit'].className = 'disable';
			editor.API.reset();
			publishTo && publishTo.reset && publishTo.reset();
		};
		
		var error = function(ret, params){
			lock = false;
			lockReason = '';
			ret.msg = ret.msg||lang("操作失败");
			$.common.layer.ioError(ret.code,ret);
//			$.ui.alert(ret && ret['msg'] || lang("操作失败"));
			doms['submit'] && (doms['submit'].className = '');
		};
		
		var rend = function(args){
			doms['textEl'].value = '';
			editor.API.insertText(args['content']);
			doms['info'].innerHTML = args['info'];
			args['appkey'] && (conf['appkey'] = args['appkey']);
			if(args['content']){
				lock = false;
				lockReason = '';
				doms['submit'].className = '';
			}else{
				lock = true;
				lockReason = 'error';
				doms['submit'].className = 'disable';
			}
		};
		
		var unrend = function(){
			lock = false;
		};
		
		
		/*------------lazyInit-------------*/
		
		var parseDOM = function(){
			editor = $.common.editor.base($.core.util.easyTemplate($.kit.extra.language(conf['templete']), conf).toString(), options);
			conf["smileyBtn"] && editor.widget($.common.editor.widget.face(),'smileyBtn');
			conf["picBtn"] && editor.widget($.common.editor.widget.image(),'picBtn');
			doms = editor.nodeList;
			/**
			 * 引入发布引导控件 
			 */
			publishTo = $.common.editor.plugin.publishTo({
				editorWrapEl : doms.wrap,
				textEl : doms.textEl 			
			});
			/**
			 * 引入验证码控件 
			 */
			validateTool = $.common.dialog.validateCode();
		};
		
		var bindDOM = function(){
			$.addEvent(doms['submit'], 'click', updatePublish);
			$.addEvent(doms['textEl'], 'keypress', ctrlUpdatePublish);
		};
		
		var bindCustEvt = function(){
			$.custEvent.add(editor, 'textNum', canPublish);
		};
		
		var bindTrans = function(){
			trans = $.common.trans.feed.getTrans('publish',{
				onComplete : function(ret , data) {
					var bigObj =  {
						onSuccess : success,
						onError : error,
						requestAjax : trans,
						param : getPublishParams(),
						onRelease : function() {
							lock = false;
							lockReason = '';
							doms['submit'] && (doms['submit'].className = '');
						}
					};
					//加入验证码检查机制，参见$.common.dialog.validateCode
					validateTool.validateIntercept(ret , data ,bigObj);
				},
				onFail : error,
				onTimeout : error
			});
		};
		
		var lazyInit = function(){
			parseDOM();
			bindDOM();
			bindCustEvt();
			bindTrans();
		};
		
		/*------------end lazyInit-------------*/
		
		var show = function(opts){
			if(!editor){
				lazyInit();//代码初始
			}
			
			var args = $.parseParam({
				'appkey' : '',
				'content' : '',
				'defaultValue' : '',
				'info' : '',
				'title' : lang(MSG['title'])
			}, opts);
			
			dialog = $.ui.dialog();
			dialog.setTitle(args['title']);
			dialog.appendChild(doms['outer']);
			dialog.show();
			dialog.setMiddle();
			
			rend(args);
			editor.API.focus();
			
			$.custEvent.add(dialog,'hide',function(){
				$.custEvent.remove(dialog,'hide',arguments.callee);
				editor.closeWidget();
				unrend();
				dialog = null;
				$.custEvent.fire(cKey, 'hide');
			});
			defaultValue = args['defaultValue'];
			
		};
		
		var hide = function(){
			dialog.hide();
		};
		var addExtraInfo = function(info){
			editor.API.addExtraInfo(info);
		};
		var disableEditor = function(disable){
			editor.API.disableEditor(disable);
		};
		var destroy = function(){
			if(dialog){
				dialog.hide();
			}
			// 如果没有初始化，调用destroy会出现 异常，写保护。
			 doms &&doms['submit'] && $.removeEvent(doms['submit'], 'click', updatePublish);
			 doms && doms['textEl'] && $.removeEvent(doms['textEl'], 'keypress', ctrlUpdatePublish);
			$.custEvent.remove(editor, 'textNum', canPublish);
			$.custEvent.undefine(cKey, 'publish');
			validateTool && validateTool.destroy && validateTool.destroy();
			publishTo && publishTo.destroy && publishTo.destroy(); 
			doms = null;
			trans = null;
			lock = false;
			for(k in that){
				delete that[k];
			}
			that = null;
		};
		that.addExtraInfo = addExtraInfo;
		that.disableEditor = disableEditor;
		that.show = show;
		that.hide = hide;
		that.destroy = destroy;
		
		//-------------------------------------------
		
		return that;
	};
});
