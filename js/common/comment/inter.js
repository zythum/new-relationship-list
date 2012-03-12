$Import('common.trans.comment');
$Import('ui.alert');
$Import('kit.extra.language');
$Import('kit.extra.merge');
$Import('common.dialog.validateCode');
$Import('common.layer.ioError');
/**
 * @author liusong@staff.sina.com.cn
 */
STK.register('common.comment.inter', function($){
	var n = null, f = function(){}, alert = $.ui.alert,validateTool , privateSetting = $.common.comment.privateSetting , $L = $.kit.extra.language;
	var resultHandler = function(json, fCallBack){
			if(json && json.code){
				//100005为加评论失败，因为自己不是可信用户，需要弹出设置可信用户的层
				if(json.code != '100000' && json.code != '100005'){
					$.common.layer.ioError(json.code , json);
				} 
				fCallBack(json);
			}
		};
	return function(conf, param){
		validateTool = $.common.dialog.validateCode();
		//局部变量声名
		var it = {}, invalidate = 0, trans = $.common.trans.comment;
		//初始化配置参数
		conf = $.parseParam({
			'delete_success' : f,
			'delete_fail' : f,
			'delete_error' : f,
			'add_success'   : f,
			'add_fail'   : f,
			'add_error'   : f,
			'smallList_success'   : f,
			'smallList_fail'   : f,
			'smallList_error'   : f
		}, conf||{});
		//初始化评论参数
		it.conf = $.parseParam({
			'act'     : n,
			'mid'     : n,
			'cid'     : n,
			'uid'     : $CONFIG.uid,
			'page'    : n,
			'forward' : n,
			'isroot'  : n,
			'content' : n,
			'type'    : n,
			'is_block' : n,
			'appkey'  : n
		},param);
		it.merge = function(data){
			data = $.kit.extra.merge(it.conf, data); //For custom keys, ex:Diss
			return $.core.obj.clear(data);
		};
		it.request = function(sKey, oData){
			if(invalidate){return}
			invalidate = 1;
			var data = it.merge(oData);
			var t = trans.getTrans(sKey,{
				'onComplete':function(json , params){
					if(sKey == 'add') {
						var bigObj = {
							onSuccess : function(json , params) {
								resultHandler(json, function(json){
									conf[sKey +(json.code=='100000' ? '_success':'_fail')](json, data);
								});
							},
							onError : function(json , params) {
								conf[sKey +'_error'](json, data);
								//100005是对方设置了只有可信用户才能评论，弹层告诉用户可以绑定手机成为可信用户。
								if(json.code == '100005') {
									alert($L("#L{由于对方隐私设置，你无法进行评论。}") , {
										textSmall:$L('#L{绑定手机后可以更多地参与评论。}') + '<a href="http://account.weibo.com/settings/mobile" target="_blank">' + $L("#L{立即绑定}") + '</a>'										
									});
									return;																
								}
								$.common.layer.ioError(json.code,json);
//								resultHandler(json, function(json){
//									conf[sKey +'_error'](json, data);
//								});										
							},
							param : data,
							requestAjax : t
						};
						validateTool.validateIntercept(json , params , bigObj);
					} else {
						resultHandler(json, function(json){
							if(json.code == "100000") {
								conf[sKey +'_success'](json, data);	
							} else {
								var failBack = conf[sKey +'_fail'];
								if(typeof failBack === 'function') {
									conf[sKey +'_fail'](json, data);
								} else {
									conf[sKey +'_success'](json, data);
								}
							}
						});
					}
					invalidate = 0;	
				},
				'onFail': function(){
					invalidate = 0;
				}
			});
			t.request(data);
		}
		/**
		 * 加载评论
		 */
		it.load = function(oData){
			it.request('smallList', oData)
		};
		/**
		 * 删除评论
		 */
		it.del = function(oData){
			it.request('delete', oData)
		};
		/**
		 * 回复评论
		 */
		it.post = function(oData){
			it.request('add', oData)
		};
		validateTool.addUnloadEvent();
		return it;
	}
});
