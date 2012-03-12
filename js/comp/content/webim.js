/**
 * webim启动代码
 * @author wangliang3@staff.sina.com.cn
 */
STK.register("comp.content.webim", function($) {
	var win = window;
	var fileLoader = function(tag,src,atts){
		var v = '?version=' + win.$CONFIG['version'],
			doc = document, 
			wa = doc.createElement(tag); 
		
		for(var key in atts){
			wa[key] = atts[key];
		};
		wa.setAttribute("href", src + v);
		doc.getElementsByTagName("head")[0].appendChild(wa);
	};
	return function(){
		if($.E('wbim_box') || navigator.platform.indexOf("iPad") !== -1 || (win.$CONFIG && win.$CONFIG['pageid'] === 'content_sorry')){
			return;
		}
		
		var connected = false;
		window.__PubSub__ && window.__PubSub__.subscribe('webim.connected',function(){
			connected = true;
		});
		
		//监听聊天点击事件，并且做降级处理（webim未加载成功时使用私信代替）
		$.core.evt.addEvent(document,'click',function(e) {
		   e = e || window.event;
		   var target = e.target || e.srcElement;
		   if(target.getAttribute("action-type") === "webim.conversation"){
		   		var data = $.core.json.queryToJson(target.getAttribute('action-data'))
				if($.wbim && $.wbim.events.ui && $.wbim.events.ui.fire && connected){
					$.wbim.events.ui.fire('contactsPanel.userClicked',{'uid':data.uid});
				}else{
					try{
						var postMsg = STK.common.dialog.sendMessage({
							'uid' : data.uid,
							'userName' : data.nick||""
						});
						postMsg.show();
					}catch(e){
						
					}
				}
		   }
		});
		
		if(win.$CONFIG && (win.$CONFIG.$webim == 1 || win.$CONFIG.$webim == true)){
			//如果用户开启了webim，就加载webim js和css
			fileLoader('link','http://img.t.sinajs.cn/t4/appstyle/webim/css/wbim.css',
			{rel:'Stylesheet',type:'text/css',charset:'utf-8'});
			
			var version  = win.$CONFIG.version || (new Date()).getTime();
			if(win.$CONFIG['lang'] === 'zh-tw'){
				STK.core.io.scriptLoader({
					url:'http://js.t.sinajs.cn/t4/webim/js/zh-tw.js?v=VER'.replace('VER',version)
				});
			}
			STK.core.io.scriptLoader({
				url:'http://js.t.sinajs.cn/t4/webim/js/webim.js?v=VER'.replace('VER',version),
				onComplete:function(){
					STK.WBIM && STK.WBIM.init && STK.WBIM.init();
				}
			});
		}
	}
});