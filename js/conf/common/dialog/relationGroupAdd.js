/**
 * @fileoverview
 * 关系组——创建分组
 * 	目前使用位置：
 * 		1、我的首页Feed，创建分组
 * @id STK.common.dialog.relationGroupAdd
 * @author L.Ming | liming1@staff.sina.com.cn
 * @example
	$.common.dialog.relationGroupAdd(function(newGroupName, allGroupList){
		// newGroupName 是新创建的分组名
		// allGroupList 是所有分组的列表
	});
 * @history
 */
$Import('kit.extra.language');
$Import('ui.prompt');
$Import("common.trans.group");
$Import("common.channel.relation");
STK.register("common.dialog.relationGroupAdd", function($){

	return function(callback,opts){
		callback = callback || $.funcEmpty;
		opts = opts || {};
		var lang = $.kit.extra.language;

		var remark = ''; // 用户最终提交的分组名
		// 初始化浮层
		var pmt = $.ui.prompt({
			'title' : opts.gname ? lang('#L{修改分组名称}') : lang('#L{创建分组}'),
			'notice' : lang('#L{输入新分组名称}'),	// 文本框默认文案
			'value' : opts.gname || '',		// 输入框默认值
			'info' : '',		// 标签默认值
			'label' : lang('#L{分组名称:}'),		// 输入框前的默认文案
			// 提交数据
			'OK' : function(data){
				trans.request({
					'gid' : opts.gid || '',
					'name' : data
				});
			},
			// 取消按钮
			'cancel' : $.funcEmpty,
			// 验证用户输入是否符合要求
			'check' : function(data){
				var result;
				data = $.trim(data);
				// 此处只验证了分组名不为空，其他情况稍后再补
				if (data == "" || data == lang("#L{输入新分组名称}")) {
					result = { 'status'	: false, 'msg'	: lang('#L{分组名不能为空}') };
				} else if ($.bLength(data) > 16) {
					result = { 'status'	: false, 'msg'	: lang('#L{请不要超过16个字符}') };
				} else {
					result = { 'status'	: true };
					remark = data;
				}
				return result;
			},
			'OKText' : lang('#L{确定}'),
			'cancelText' : lang('#L{取消}')
		});

		// 获取接口
		var trans = $.common.trans.group;
		trans = trans.getTrans(opts.gname ? 'modify' : 'add', {
			'onSuccess' : function (ret, params) {
				var list = ret.data
				for (var i in list) {
					if (list[i]["belong"] === 1) {
						params.gid = list[i].gid;
						break;
					}
				}
				callback && callback($.core.json.merge(params, ret.data));
				$.common.channel.relation.fire('updateRemark',[remark,ret.data]);
				pmt.hide();
			} || $.funcEmpty,
			'onError' : function(ret, params){
				pmt.showError(ret.msg);
			},
			'onFail' : function(ret, params){
				pmt.showError(ret.msg || lang('#L{系统繁忙，请稍后再试}'));
			}
		});
		
		return pmt;
	};
});