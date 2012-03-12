/**
 * 商务模板
 * @author 非反革命|zhaobo@staff.sina.com.cn
 * @example
 */
$Import('kit.extra.language');
$Import('common.trans.custTmpl');

STK.register("common.skin.business", function($) {
	//---常量定义区----------------------------------
	var lang = $.kit.extra.language;
	var TEMPLATE =  lang('<#et picData data>' +
				'<div class="layer_other_templete">' +
				'   <dl class="clearfix">'+
				'	    <dt><img alt="" src="${data.url}"></dt>'+
				'   	<dd>'+
				'		    <p class="son_title">#L{确认要替换为此模板吗}？</p>'+
				'		    <p class=""><a href="javascript:void(0);" action-type="save" class="W_btn_b"><span>#L{保存}</span></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:void(0);" action-type="cancel" class="W_btn_a"><span>#L{取消}</span></a></p>'+
				'	    </dd>'+
				'   </dl>' +
				'</div>');

	//-------------------------------------------
	return function(opts) {
		var that = {};
		var dialog;
		var dEvt;
		var trans = $.common.trans.custTmpl;
		var skinId;
		var html;
		var parseDOM = function() {
			html = $.core.util.easyTemplate(TEMPLATE, opts);
			dialog = $.ui.dialog();
			dEvt = $.core.evt.delegatedEvent(dialog.getInner());
		};
		var show = function(){
			dialog.setTitle(lang("#L{模板设置}"));
			dialog.setContent(html.toString());
			dialog.show();
			dialog.setMiddle();
		};
		var argsCheck = function() {
			if(!opts.pid) {
				throw new Error('common.skin.business 没有pid!');
			}
			skinId = opts.pid;
			opts.url = $CONFIG["imgPath"]+"/skin/"+opts.pid+"/layer.png?version="+$CONFIG["version"];
        };
		var reload = function(){
			setTimeout(function(){window.location.href = window.location.href.split("?")[0];}, 10);
			return false;
		};
		var err = function(){
			$.ui.litePrompt(lang("#L{系统繁忙，请稍后再试}！"),{'type':'error','timeout':'1000', 'hideCallback': show});
		};
		var publishFun = function(name , pid , skinId) {
			$.ui.confirm(lang("#L{保存成功}！<br>#L{将我使用的模板推荐给粉丝}？"), {
				icon : "success",
				OK : function() {
					setTimeout(function(){
						var publish = $.common.dialog.publish({
							'styleId':'1',
							'picBtn' : false
						});
						publish.show({
							'title': lang('#L{聊聊你的新模板，推荐给你的粉丝吧} O(∩_∩)O'),
							'content' : lang('#L{我刚换了}') + name + lang('#L{模板}')
						});
						if(pid) publish.addExtraInfo("pic_id="+pid+"&skin_id="+skinId);
						$.custEvent.add(publish, 'publish', function(){
							dialog.hide();
							publish.hide();
							$.ui.litePrompt(lang("#L{推荐成功。}"),{'type':'succM','timeout':'500','hideCallback':function(){
								reload();
							}});
							$.custEvent.remove(publish,'publish',arguments.callee);
						});
						$.custEvent.add(publish, 'hide', function(){
							$.custEvent.remove(publish,'hide',arguments.callee);
							reload();
						});
					}, 0);
				},
				cancel : function(){
					reload();
				}
			});
		};
		var bindDomFuns = {
			save : function(){
				trans.getTrans("save", {
		                onSuccess : function(ret){
							//进行发微博提示
							var data = ret.data;
							if(data.skinid == data.old_skinid) {
								dialog.hide();
								$.ui.litePrompt(lang("#L{保存成功}！"),{'type':'succM','timeout':'1000', 'hideCallback': reload});	
							} else {
								publishFun(data.skin_name , data.skin_picid , data.skinid);	
							}
			            },
                        onFail: function() {
	                        err();
                        },
                        onError: function() {
	                        err();
                        }
	                }).request({skinId:skinId});

                    $.preventDefault();
				return false;
			},
			cancel : function(){
				reload();
			}
		};
		var bindListener = function() {
			$.custEvent.add(dialog, 'hide', function (){
                $.custEvent.remove(dialog,'hide',arguments.callee);
                destroy();
				reload();
			});
		};
		var bindDom = function(){
			dEvt.add("save", "click", bindDomFuns.save);
			dEvt.add("cancel", "click", bindDomFuns.cancel);
		};
		var init = function() {
			argsCheck();
			parseDOM();
			bindDom();
			bindListener();
		};
		init();
		show();
		var destroy = function(){
			dEvt.remove("save", "click", bindDomFuns.save);
			dEvt.remove("cancel", "click", bindDomFuns.cancel);
		};
		that.destroy = destroy;
		//-------------------------------------------
		return that;
	};
});
