/**
 * @id STK.ui.tipAlert
 * @param {Object} spec
 * {
 *  type: "succ",//del/succ/error/warn 默认 succ
 *  msg: ""//信息
 * }
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example
 * 
 * var  msgTip = STK.ui.tipAlert({
			showCallback: function() {
				
			},
			hideCallback: function() {
				
			},
			msg: "fsf",
			type: "error"
		});
		msgTip.setLayerXY(el);
		msgTip.aniShow();
 */

$Import('ui.tipPrototype');
STK.register('ui.tipAlert', function($) {
	var $easyT = $.core.util.easyTemplate;
	return function(spec) {
		spec = $.parseParam({
			direct:"up",
			showCallback:$.core.func.empty,
			hideCallback:$.core.func.empty,
			type: "succ",//del/succ/error/warn
			msg: ""//信息
		}, spec);
		
		var tipAlert = $.ui.tipPrototype(spec);
		var content = tipAlert.getInner();      //内容区域
		var outer = tipAlert.getOuter();
		outer.className = 'W_layer';
		content.className = "bg";
		var template = spec.template ||
				'<#et temp data><table cellspacing="0" cellpadding="0" border="0">' +
						'<tbody><tr><td>' +
						'<div node-type="msgDiv" class="content layer_mini_info">' +
						'<p class="clearfix"><span class="icon_${data.type}"></span>${data.msg}&nbsp; &nbsp; &nbsp; </p>' +
						'</div>' +
						'</td></tr></tbody>' +
						'</table></#et>';

		var dom = $.builder($easyT(template, {
			type: spec.type,
			msg: spec.msg
		}).toString());
		tipAlert.setContent(dom.box);
//		var msgDiv = dom.list["msgDiv"][0];
//		msgDiv.innerHTML = msgDiv.innerHTML.replace("#######</p>", "</p>");

		var tipPrototypeDestroy = tipAlert.destroy;
		tipAlert.destroy = function() {
			tipPrototypeDestroy();
			tipAlert = null;
		};

		return tipAlert;
	};
});
