$Import('ui.tipPrototype');
$Import('kit.extra.language');
STK.register('ui.tipConfirm', function($) {
	return function(spec) {
		spec = spec || {};
		var lang  = $.kit.extra.language;
		var tipConfirm = $.ui.tipPrototype(spec);
		var content = tipConfirm.getInner();      //内容区域
		var outer = tipConfirm.getOuter();
		outer.className = 'W_layer';
		content.className = "bg";
		spec.info = spec.info || lang('#L{确认要删除这条微博吗？}');
		spec.icon = spec.icon || 'icon_ask';
		var template = spec.template || lang(
				'<table border="0" cellpadding="0" cellspacing="0">' +
						'<tbody><tr><td>' +
						'<div class="content layer_mini_info">' +
						'<p class="clearfix" node-type="info"><span node-type="icon" class="' + spec.icon + '"></span>' + spec.info + '</p>' +
						'<p class="btn"><a node-type="ok" class="W_btn_b" href="javascript:void(0)"><span>#L{确定}</span></a><a class="W_btn_a" node-type="cancel" href="javascript:void(0)"><span>#L{取消}</span></a></p>' +
						'</div>' +
						'</td></tr></tbody>' +
						'</table>');

		var dom = $.builder(template);
		tipConfirm.setContent(dom.box);
		if (!dom.list['ok']) {
			return tipConfirm;
		}
		var ok = dom.list['ok'][0];
		var cancel = dom.list['cancel'][0];

		tipConfirm.setIcon = function(iconClass) {
			dom.list['info'].className = iconClass;
			tipConfirm.setTipWH();
		};

		/**
		 *
		 * @param info
		 */
		tipConfirm.setInfo = function(info) {
			dom.list['info'][0].innerHTML ='<span node-type="icon" class="' + spec.icon + '"></span>'+ info;
			tipConfirm.setTipWH();
		};

		//取消后的回调
		tipConfirm.cancelCallback = function() {
			if ($.getType(spec.cancelCallback) == "function") {
				spec.cancelCallback();
			}
		};

		//确定后的回调
		tipConfirm.okCallback = function() {
			if ($.getType(spec.okCallback) == "function") {
				spec.okCallback();
			}
		};
		var cancelFunc = function () {
			tipConfirm.anihide();
			tipConfirm.cancelCallback();
		};
		var okFunc = function() {
			tipConfirm.anihide();
			tipConfirm.okCallback();
		};
		//取消按钮处理
		$.addEvent(cancel, 'click', cancelFunc);
		//确定按钮处理
		$.addEvent(ok, 'click', okFunc);

		var tipPrototypeDestroy = tipConfirm.destroy;
		tipConfirm.destroy = function() {
			$.removeEvent(cancel, 'click', cancelFunc);
			$.removeEvent(ok, 'click', okFunc);
			tipPrototypeDestroy();
			tipConfirm = null;
		};


		return tipConfirm;
	};
});
