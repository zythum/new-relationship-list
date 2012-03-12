/**
 * 语言切换
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 */
$Import('ui.alert');
$Import('ui.confirm');
$Import('common.trans.global');
$Import('kit.extra.language');
STK.register('comp.content.changeLanguage', function($){
	var nodeCache = null;
	return function(node){
		var that	= {},
			$L		= $.kit.extra.language,
			$msg	= {
				'zh-cn' : $L('#L{确认切换到简体版吗}'),
				'zh-tw' : $L('#L{确认切换到繁体版吗}'),
				'en-us' : $L('#L{确认切换到英文版吗}')
		};
		var doRequest = (function(){
			var onSuccess = function(p){
				window.location.reload();
			};
			var onError = function(rs) {
				$.ui.alert(rs.msg);
			};
			var ajax = $.common.trans.global.getTrans('language',{
				'onSuccess': onSuccess,
				'onError':onError
			});
			return function(val){
				ajax.request({
					'lang'	: val
				});
			}
		})();
		var bindDOMFuns = {
			changeLanguage: function(){
				var val = node.value;
				$.ui.confirm($msg[val], {
					'OK'	: function(){
						doRequest(val);
					},
					'cancel': function(){
						node.value = $CONFIG.lang;
					}
				});
			}
		};
		
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.content.changeLanguage]:node is not a Node!";
			}
		};
		
		var bindDOM = function(){
			$.addEvent(node, 'change', bindDOMFuns.changeLanguage);
		};
		
		var destroy = function(){
			$.removeEvent(node, 'change', bindDOMFuns.changeLanguage);
			bindDOMFuns.changeLanguage && (bindDOMFuns.changeLanguage = null);
		};
		
		var init = function(){
			if(nodeCache){ return; }
			nodeCache = node;
			argsCheck();
			bindDOM();
		}();
		
		that.destroy = function(){ return; };
		return that;
	};
})