$Import('ui.alert');
$Import('kit.extra.language');
STK.register('comp.tasks.copy', function($){
	var $L = $.kit.extra.language;
	var copy = function(text2copy){
		// 检测是否Flash10
		var checkFlashVer = function(){
			var plugin = (navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"]) ? navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin : 0;
			if (plugin) {
				var words = navigator.plugins["Shockwave Flash"].description.split(" ");
				for (var i = 0; i < words.length; ++i) {
					if (isNaN(parseInt(words[i], 10))) {
						continue;
					}
					var MM_PluginVersion = words[i];
				}
				return MM_PluginVersion >= 10;
			}
			else 
				if ($.IE) {
					try {
						new ActiveXObject("ShockwaveFlash.ShockwaveFlash.10");
						return true;
					} 
					catch (e) {
						return false;
					}
				}
		};
		// IE6 直接使用clipboardData对象
		if (window.clipboardData && $.core.util.browser.IE6) {
			window.clipboardData.clearData();
			return window.clipboardData.setData("Text", text2copy);
		}
		else {
			if (checkFlashVer()) {
				if ($.IE) {
					try {
						window.clipboardData.clearData();
						return window.clipboardData.setData("Text", text2copy);
					} 
					catch (e) {
						return false;
					}
				}
				// FF下针对FlashPlayer10处理 (有安全提示)
				try {
					netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
					var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
					if (!clip) {
						return;
					}
					var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
					if (!trans) {
						return;
					}
					trans.addDataFlavor('text/unicode');
					var str = {};
					var len = {};
					str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
					var copytext = text2copy;
					str.data = copytext;
					trans.setTransferData("text/unicode", str, copytext.length * 2);
					var clipid = Components.interfaces.nsIClipboard;
					if (!clip) {
						return false;
					}
					clip.setData(trans, null, clipid.kGlobalClipboard);
					
					return true;
				} 
				catch (e) {
					return false;
				}
			}
			else {
				// 其他情况使用FlashCopy
				var flashcopier = 'flashcopier';
				if (!$.E(flashcopier)) {
					var divholder = $.C('div');
					divholder.id = flashcopier;
					document.body.appendChild(divholder);
				}
				text2copy = text2copy.replace(/%/g, escape('%')).replace(/&/g, escape('&'));
				var divinfo = '<embed src="/view/js/clipboard.swf" FlashVars="clipboard=' + text2copy + '" width="0" height="0" type="application/x-shockwave-flash"></embed>'; //这里是关键
				$.E(flashcopier).innerHTML = divinfo;
				return true;
			}
		}
	};
	return function(spec){
		var conf = $.parseParam({
			'text': '',
			'succText': $L('#L{链接复制成功！ 你可以利用快捷方式Ctrl+V键粘贴到UC、QQ或MSN等聊天工具中。}'),
			'errorText': $L('#L{你的浏览器不支持脚本复制或你拒绝了浏览器安全确认，请尝试手动[Ctrl+C]复制。}'),
			'icon': 'success'
		}, (spec || {}));
		if (copy(conf['text'] || "") == false) {
			conf['succText'] = conf['errorText'];
			conf['icon'] = "warn";
		}
		$.ui.alert(conf['succText'],{'icon': conf['icon']});
		$.preventDefault();
	};
});
