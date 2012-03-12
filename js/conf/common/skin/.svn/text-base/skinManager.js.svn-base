/**
 * 模板管理
 * @author 非反革命|zhaobo@staff.sina.com.cn
 * @example
 */
$Import("ui.dialog");
$Import('ui.litePrompt');
$Import('kit.extra.language');
$Import('common.skin.custTmpl');
$Import('common.dialog.publish');

STK.register("common.skin.skinManager", function($) {
	//---常量定义区----------------------------------
	var MSG = {
		'title' : '#L{模板设置}'
	};

	var lang = $.kit.extra.language;


	//-------------------------------------------

	return function(spec){
		var that = {};

		var conf, mid, custTmpl, dialog;

		conf = $.parseParam({
			'styleId' : '1'
		}, spec);
		var inner, outer, timer;

		// 自定义事件定义
		$.custEvent.define(that, ['hide']);

		var _canClose = true;


		/*------------end lazyInit-------------*/
		var clearTimer = function(){
			clearTimeout(timer);
			timer = null;
		};
		var show = function(skinId){
			dialog = $.ui.dialog();
			dialog.setTitle(lang(MSG.title));
			custTmpl = new $.common.skin.custTmpl({skinId : skinId});
			dialog.appendChild(custTmpl.getDom());
			inner = dialog.getInner();
			inner.className = "";
			outer = dialog.getOuter();
			custTmpl.setOuter(outer);
			function abort(){
				return custTmpl.canClose();
			}
			dialog.setBeforeHideFn(abort);
//			center();
			$.custEvent.add(custTmpl, 'load', function (data, skinId, skinName){
                dialog.show();
				center();
				if(!skinName) return;
				$.ui.confirm(lang("#L{确认使用} “"+skinName+"” #L{模板替换原有模板}？"), {
					icon : "question",
					OK : custTmpl.save
				});
			});

			$.custEvent.add(custTmpl, 'hide', function (evt, skinName, skinId, pid){
				//hide();
				dialog.hide((skinName === "force"));
				var _openPubl = false;
				if(skinName === "cancel" || skinName === "force") return;
				var _dia, _closeTime = 3000;
				if(skinName && skinId) {
					_closeTime = 10000;
					_dia = $.ui.confirm(lang("#L{保存成功}！<br>#L{将我使用的模板推荐给粉丝}？"), {
						icon : "success",
						OK : function() {
							clearTimer();
							_openPubl = true;
							var publish = $.common.dialog.publish({
								'styleId':'1',
								'picBtn' : false
							});

							publish.show({
								'title': lang('#L{聊聊你的新模板，推荐给你的粉丝吧} O(∩_∩)O'),
//								'content' : lang('#L{我刚换了}“'+'') + skinName + lang('”#L{模板, 点击链接使用该模板} http://'+window.location.host+'/home?' +
//										'skinId='+skinId)
								'content' : lang('#L{我刚换了}“'+'') + skinName + lang('”#L{模板}')
								//'content' : lang('#L{我刚换了“' + skinName + '”模板}')
							});
							if(pid) publish.addExtraInfo("pic_id="+pid+"&skin_id="+skinId);
//							if(pid) publish.addExtraInfo(pid);
							var _openA = false;
							$.custEvent.add(publish, 'publish', function(){
								_openA = true;
								publish.hide();
								$.ui.litePrompt(lang("#L{推荐成功。}"),{'type':'succM','timeout':'500','hideCallback':function(){
									$.log("succ");
									reload();
								}});							
								$.custEvent.remove(publish,'publish',arguments.callee);
							});
							$.custEvent.add(publish, 'hide', function(){
								$.custEvent.remove(publish,'hide',arguments.callee);
								reload();
							});
						},
						cancel : function(){
							clearTimer();
							reload();
						}
					})
				} else {
					 $.ui.litePrompt(lang("#L{保存成功}！"),{'type':'succM','timeout':'500','hideCallback':function(){
						clearTimer();
						reload();
					}});
				}
					timer = setTimeout(function() {
						_dia && _dia.dia && _dia.dia.hide();
						//if(!_openPubl) reload();
					}, _closeTime);

			});
            $.custEvent.add(dialog, 'hide', function (){

                custTmpl.hide();
	            dialog.clearBeforeHideFn();
//	            if(abort()){ reload();
                $.custEvent.remove(dialog,'hide',arguments.callee);
                destroy();

			});
		};
		var reload = function(){
			setTimeout(function(){window.location.href = window.location.href.split("?")[0];}, 10);
			return false;
		};
		// 隐藏
		var hide = function(){
			//destroy();
			dialog.hide();

		};
		// 隐藏
		var center = function(){
			dialog.setMiddle(inner);
		};
		// 销毁
		var destroy = function(){
            $.custEvent.remove(custTmpl, 'load');
            $.custEvent.remove(custTmpl, 'hide');
			$.log("clear timer");
			clearTimeout(timer);
			timer = null;
            dialog.destroy();
            custTmpl.destroy();
		};

		that.show = show;

		//-------------------------------------------
		return that;
	};
});
