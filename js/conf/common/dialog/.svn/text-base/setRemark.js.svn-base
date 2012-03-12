/**
 * @fileoverview
 * 修改备注名浮层
 * @id STK.common.dialog.setRemark
 * @author L.Ming | liming1@staff.sina.com.cn
 * @param {Object} opts
	{
		'uid'		: 1406758883,		// 必选，改哪个 UID 的备注
		'remark'	: '笨查理',			// 可选，原来的备注名
		'callback'	: function (data){	// 可选，改成功后的回调函数，用修改后的备注名回调
			test.value = '新备注名是：' + data;
		}
	}
 * @example
	$.common.dialog.setRemark({
		'uid'		: 1406758883,		// 必选，改哪个 UID 的备注
		'remark'	: '笨查理',			// 可选，原来的备注名
		'callback'	: function (data){	// 可选，改成功后的回调函数，用修改后的备注名回调
			test.value = '新备注名是：' + data;
		}
	});
 */
$Import('kit.extra.language');
$Import('ui.prompt');
$Import('common.trans.relation');
$Import('kit.dom.smartInput');

STK.register('common.dialog.setRemark',function($){

	return function(opts){
		// 处理传递过来的参数
		opts = opts || {};
		var uid = opts.uid;
		if(opts.uid == null){
			return;
		}
		var oldRemark = $.trim(opts.remark || '');
		var callback = opts.callback;
		
		var lang = $.kit.extra.language;

		var remark = ''; // 用户最终提交的备注名
		// 初始化浮层
		var pmt = $.ui.prompt({
			'title' : lang('#L{设置备注名}'),
			'notice' : lang('#L{请输入备注名}'),	// 文本框默认文案
			'value' : oldRemark || '',			// 输入框默认值
			'info' : '',						// 标签默认值
			'label' : lang('#L{备注名：}'),				// 输入框前的默认文案
			// 提交数据
			'OK' : function(data){
				// 如果根本没改就直接提交了
				if(oldRemark != "" && data == oldRemark){
					callback && callback(oldRemark);
					pmt.hide();
				} else {
					trans.request({
						'touid' : uid,
						'remark' : remark
					});
				}
			},
			// 取消按钮
			'cancel' : $.funcEmpty,
			// 验证用户输入是否符合要求
			'check' : function(data){
				var result;
				// 此处只验证了备注名不为空，其他情况稍后再补
				if ($.trim(data) == "" || data == lang('#L{请输入备注名}')) {
					result = { 'status'	: true, 'msg': lang('#L{备注名不能为空}')};
                    remark ="";
				} else {
					result = { 'status'	: true };
					remark = data;
				}
				return result;
			},
			'OKText' : lang('#L{确定}'),
			'cancelText' : lang('#L{取消}')
		});

       //获取promit中的smartinput设置输入最大的字符长度为30.
       pmt.pmt.input.setMaxLength(30);
		// 获取接口
		var trans = $.common.trans.relation;
		trans = trans.getTrans('setRemark', {
			'onSuccess' : function (ret, params) {
				callback && callback(remark);
				pmt.hide();
			} || $.funcEmpty,
			'onError' : function(ret, params){
				pmt.showError(ret.msg);
			},
			'onFail' : function(ret, params){
				pmt.showError(ret.msg || lang('#L{系统繁忙，请稍后再试}'));
			}
		});

	};
});
