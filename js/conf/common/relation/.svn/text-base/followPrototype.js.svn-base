/**
 * 加关注相关接口定义
 * 加关注接口会将用户的上行数据，当作参数在事件通知内返还给用户
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 * 
 * @example $.common.relation.followPrototype.follow({uid: '12345', f: '1', other: })
 * 
 * @history
 * ZhouJiequn @2011.05.05	加关注上行参数fuid改名为uid
 * ZhouJiequn @2011.05.09	添加默认错误处理
 */
$Import('common.trans.relation');
$Import('common.channel.relation');
$Import('kit.extra.merge');
$Import('ui.alert');
$Import('common.dialog.validateCode');
$Import('common.layer.ioError');

STK.register('common.relation.followPrototype', function($){	
	var that	= {},
		fTrans	= $.common.trans.relation,
		fChannel= $.common.channel.relation,
		merge	= $.kit.extra.merge;
	//add by zhangjinlong | jinlong1		验证码弹层	
	var validCodeLayer = $.common.dialog.validateCode();
	/**
	 * 默认错误处理
	 * @param {Object} rs
	 * @param {Object} parm
	 */
	var alertError = function(rs, parm){
		$.ui.alert(rs.msg);
	};
	
	var doRequest = function(type, spec) {
		var conf = $.kit.extra.merge({
			'uid'   : '', //需要加关注的用户
			'f'     : 0, //是否需要返回关系信息(单项关注还是双向关注)
			'extra' : '',
			'oid' : $CONFIG["oid"]
		}, spec || {});
		
		
		if(type === 'follow'){
			var _getTrans = fTrans.getTrans(type,{
				'onComplete' : function(rs, parm){
					//zhangjinlong || jinlong1@staff.sina.com.cn	验证码弹层
					
					var conf =  {
						onSuccess : function(rs, parm){
							var data = merge(spec, rs.data);
							fChannel.fire(type, data);
							var cb = spec['onSuccessCb'];
							typeof cb === 'function' && cb(data);
						},			
						onError :  function(rs, parm){
//							var errorCb = spec['onErrorCb'] || alertError;
//							errorCb(rs, parm);
							$.common.layer.ioError(rs.code, rs);
						},				
						requestAjax : _getTrans,				
						param : parm,			
						onRelease : function() {		
								
						}
					};
					//加入验证码检查机制，参见$.common.dialog.validateCode
					validCodeLayer.validateIntercept(rs , parm , conf);
					
				}
			});
			
			_getTrans.request(conf);
		}else{
			$.common.trans.relation.request(type, {
				'onSuccess'	: function(rs, parm){
					var data = merge(spec, rs.data);
					fChannel.fire(type, data);
					var cb = spec['onSuccessCb'];
					typeof cb === 'function' && cb(data);
				},
				'onError'	: function(rs, parm){
//					var errorCb = spec['onErrorCb'] || alertError;
//					errorCb(rs, parm);
					$.common.layer.ioError(rs.code, rs);
				}
			}, conf);
		}
	};
	
	var follow		= function(spec){
		doRequest('follow', spec);
		
	};
	
	var unFollow	= function(spec){
		doRequest('unFollow', spec);
	};
	var block		= function(spec){
		doRequest('block', spec);
	};
	var unBlock		= function(spec){
		doRequest('unBlock', spec);
	};
	var removeFans	= function(spec){
		doRequest('removeFans', spec);
	};
	that.follow		= follow;
	that.unFollow	= unFollow;
	that.block		= block;
	that.unBlock	= unBlock;
	that.removeFans	= removeFans;
	return that;
});
