/**
 * common.content.block 加入黑名单模块公用方法
 * @id STK.
 * @author WK | wukan@staff.sina.com.cn
 * @example 
 * 
*/
$Import('kit.extra.language');
$Import('common.channel.relation');
$Import('common.trans.relation');
$Import('ui.confirm');
$Import('ui.timerNotice');
STK.register('common.content.block', function($){
	var $L = $.kit.extra.language;
	var $T = $.templet;
	var followChannel = $.common.channel.relation;
	var ADD_TO_BLOCK_TIPS = $L('#L{你和他将自动解除关注关系，并且他不能再关注你<br/>他不能再给你发评论、私信、@通知}');
	var ADD_TO_BLOCK_TF = $L('#L{确认将}') + '#{nickName}' + $L('#L{加入到我的黑名单中么？}');
	return function() {
		$.ui.confirm( $T( ADD_TO_BLOCK_TF, {nickName:$CONFIG['onick']}), {
			'textSmall' : ADD_TO_BLOCK_TIPS,
			'icon'  : 'error',
			'OK'    : function() {
				//发请求
				$.common.trans.relation.getTrans('block', {
					'onComplete' : function(ret) {
						//成功后触发
						followChannel.fire('block', {
							'uid': $CONFIG['oid']
							//'relation': ret.data.relation
						});
						$.ui.timerNotice($L('#L{已将}'+$CONFIG['onick']+'#L{加入黑名单}'),{'icon':'success','timer':2000});
						
					}
				}).request({'uid':$CONFIG['oid'],'f':1});
			}
		});;

	};
});
