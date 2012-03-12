/**
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * STK.core.util.swf.create(STK.E('box'), 'x.swf', 详见getSWF里的cfg);
 */
$Import('core.obj.parseParam');
STK.register('core.util.swf', function($){
	function getSWF(sURL, oOpts){
		
		var cfg = $.core.obj.parseParam({
			'id': 'swf_' + parseInt(Math.random() * 10000, 10),
			'width': 1,
			'height': 1,
			'attrs': {},
			'paras': {},
			'flashvars': {},
			'html': ''
		}, oOpts);
		
		if (sURL == null) {
			throw 'swf: [sURL] 未定义';
			return;
		}
		var key;
		var html = [];
		var attrs = [];
		for (key in cfg.attrs) {
			attrs.push(key + '="' + cfg.attrs[key] + '" ');
		}
		
		var flashvars = [];
		for (key in cfg.flashvars) {
			flashvars.push(key + '=' + cfg.flashvars[key]);
		}
		cfg.paras['flashvars'] = flashvars.join('&');
		
		if ($.IE) {
			// 头部
			html.push('<object width="' +
			cfg.width +
			'" height="' +
			cfg.height +
			'" id="' +
			cfg.id +
			'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ');
			
			// 属性写入
			html.push(attrs.join(''));
			
			// 结束属性标签并为IE写入url(兼容)
			html.push('><param name="movie" value="' + sURL + '" />');
			
			// 参数写入(FlashVars已经在前文填入到参数里了)
			for (key in cfg.paras) {
				html.push('<param name="' + key + '" value="' + cfg.paras[key] + '" />');
			}
			html.push('</object>');
			
		}
		else {
			// 头部
			html.push('<embed width="' +
			cfg.width +
			'" height="' +
			cfg.height +
			'" id="' +
			cfg.id +
			'" src="' +
			sURL +
			'" type="application/x-shockwave-flash" ');
			
			// 属性写入
			html.push(attrs.join(''));
			
			// 参数写入(FlashVars已经在前文填入到参数里了)
			for (key in cfg.paras) {
				html.push(key + '="' + cfg.paras[key] + '" ');
			}
			
			html.push(' />');
		}
		cfg.html = html.join('');
		return cfg;
	}
	var that = {};
	that.create = function(sNode, sURL, oOpts){
		var oElement = $.E(sNode);
		if (oElement == null) {
			throw 'swf: [' + sNode + '] 未找到';
			return;
		}
		var swf_info = getSWF(sURL, oOpts);
		
		oElement.innerHTML = swf_info.html;
		
		return $.E(swf_info.id);
	};
	that.html = function(sURL, oOpts){
		var swf_info = getSWF(sURL, oOpts);
		return swf_info.html;
	};
	that.check = function() {
		var description = -1;
		if ($.IE) {
			try{
				var flash = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
				description = flash.GetVariable('$version');
			}catch(exp){
				
			}
		}
		else {
			if (navigator.plugins["Shockwave Flash"]){
				description = navigator.plugins["Shockwave Flash"]['description'];
			}
		}
		return description;
	};
	return that;
});
