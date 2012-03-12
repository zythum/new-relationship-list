/**
 * 加关注组件
 */
$Import('common.channel.relation');
$Import('kit.extra.language');
$Import('kit.extra.merge');
$Import('ui.tipConfirm');
$Import('common.trans.relation');
$Import('ui.alert');
$Import('common.dialog.validateCode');
$Import('module.getDiss');
STK.register('ui.tipFollow', function($) {
	var dom,delegate,actionTypes,uid,nodeData;
	var lang = $.kit.extra.language;
	var transPIC = $CONFIG['imgPath'] + '/style/images/common/transparent.gif';
	var registerDelegateActions = function() {
		for (var i in actionTypes) {
			delegate.add(i, 'click', actionTypes[i]);
		}
	};
	
	/**
	 * 替换模版
	 * @param {String} templ
	 * @param {Object} valObj
	 */
	var replaceTemplate = function(templ, valObj){
		valObj = valObj || {};
		var t = templ;
		for (var i in valObj) {
			t = t.replace('{'+i+'}', valObj[i]);
		}
		return t;
	};
	return function(node, id, nickName, remarkCb) {
		
		if (!node) {
			throw '[STK.ui.tipFollow] : this function  need a node  as  parameter';
		}
		//add by zhangjinlong | jinlong1	验证码弹层
		var validCodeLayer = $.common.dialog.validateCode();
		var ret		= {},
			template= {
					'follow'	: 
						lang('<div class="W_addbtn_even">' +
							'<img src="' + transPIC + '" title="#L{加关注}"' +
								'class="icon_add {className}" alt=""/>{focDoc}<span class="W_vline">|</span>' +
							'<a class="W_linkb" action-type="{actionType}" action-data="uid={uid}&fnick={fnick}&f=1" href="javascript:void(0);"><em>#L{取消}</em></a>' +
						'</div>'),
					
					'unFollow'	:
						lang('<a action-type="follow" action-data="uid={uid}&fnick={fnick}&f=1" href="javascript:void(0);" class="W_btn_b">'+
							'<span>{followMe}<img class="icon_add addbtn_b" title="#L{加关注}" src="' + transPIC + '">#L{加关注}</span>'+
						'</a>'),
					
					'block'		:
						lang('<div class="W_addbtn_even">#L{已加入黑名单}'+
							'<span class="W_vline">|</span>'+
							'<a action-type="unBlock" action-data="uid={uid}&fnick={fnick}&f=1" href="javascript:void(0);" class="W_linkb"><em>#L{解除}</em></a>'+
						'</div>'),
						
					'loading'	: lang('<b class="loading"></b>#L{加关注}'),
					
					'followMe'	:
						lang('<img class="icon_add addbtn_g" title="#L{加关注}" src="' + transPIC + '">'+
							'<em class="vline"></em>')
				};
		dom = node;

		//节点数据，extra需要加在handle_btn的node-data属性中
		nodeData = {
			uid   : id,
			f     : 1
		};
		uid = nodeData.uid;
		if (!uid) {
			throw '[STK.ui.tipFollow] : this function need a {uid:XXX } as second parameter or PHP print attribute:"node-type" into node which contains "uid"';
		}
		var followChannel = $.common.channel.relation;
		var doPost = function (type, spec) {
			/**
			 * Diss
			 */
			nodeData = $.module.getDiss(nodeData, dom);
			spec = $.kit.extra.merge({
				'onComplete':function(ret) {

					if(ret.code == '100000'){
						var data	= ret.data;
						followChannel.fire(type, {
							'uid': uid,
							'relation': data.relation
						});
					} else {
						STK.ui.alert(ret.msg);
					}
				}
			}, spec);
			var trans = $.common.trans.relation.getTrans(type, spec);
			nodeData= $.kit.extra.merge(nodeData,spec.param||{});
			trans.request(nodeData);
			
			//jinlong1
			return trans;
		};

		//todo language
		var tipFollow = $.ui.tipConfirm({info:lang('#L{确认取消关注吗？}')});   //默认的confirm;
		delegate = $.core.evt.delegatedEvent(dom);
		var unFollow = function(pars) {
			var nick = pars.data.fnick||lang('#L{该用户}');
			tipFollow.setInfo(lang('#L{确定不再关注}')+ nick + '?');
			tipFollow.setLayerXY(dom);
			tipFollow.aniShow();
			tipFollow.okCallback = function() {
				//发请求
				doPost('unFollow');
			}
		};

		//todo 点击加关注按钮时调用changNode方法 实现用事件代理的方式动态绑定
		actionTypes = {
			//加关注
			'follow':function() {
				var span = $.sizzle('span', dom)[0];                //a中的span
				var tmpHtml = span.innerHTML;
				//变成loading样式
				span.innerHTML = '<b class="loading"></b>' + lang('#L{加关注}');
				
				var spec={
					'param':{},
					'onComplete': function(ret,params){
						//特殊处理 二次确认加关注
						if(ret.code=='100050'){
							span.innerHTML = tmpHtml;
							$.ui.confirm(ret.msg,{
								'OK':function(){
									spec.param['wforce']=0; //强制加关注
									doPost('follow', spec);
								}
							});
							return;
						};
						//zhangjinlong || jinlong1@staff.sina.com.cn	验证码弹层
						var conf =  {
							onSuccess :  function(ret){
								var data	= ret.data;
								followChannel.fire('follow', {
									'uid':uid,
									'fnick':data.fnick,
									'relation':data.relation,
									'groupList': data.group
								});
							},			
							onError :  function(ret){
								STK.ui.alert(ret.msg);
								//由loading变回原始状态
								span.innerHTML = tmpHtml;
							},				
							requestAjax : _getTrans,				
							param : params,			
							onRelease : function() {		
								span.innerHTML = tmpHtml;	
							}
						};
						//加入验证码检查机制，参见$.common.dialog.validateCode
						validCodeLayer.validateIntercept(ret , params , conf);
					},
					'onFail':function() {
						//由loading变回原始状态
						span.innerHTML = tmpHtml;
					}
				
				};
				var _getTrans = doPost('follow', spec);
			},
			//单向取消关注 php输出有误    for test
			'unfollow':function(pars) {				
				unFollow(pars);
			},
			//单向取消关注
			'unfollow1':function(pars) {
				unFollow(pars);
			},

			//双向取消关注
			'unfollow2':function(pars) {
				unFollow(pars);
			},

			//解除黑名单
			'unblock':function() {
				doPost('unBlock');
			}

		};

		registerDelegateActions();

		//注册 listener
		//加关注
		var addFollowListener = function(fireConf) {
			fireConf = fireConf || {};
			if (fireConf.uid !== uid) { return; }
			
			var rel			= fireConf.relation,
				_className	= 'addbtn_d',
				_focDoc		= lang('#L{已关注}'),
				actionType	= 'unfollow1';
			if (rel.follow_me && rel.following) {   //  互相关注
				_className = 'addbtn_c';
				_focDoc = lang('#L{互相关注}');
				actionType = 'unfollow2';
			}
			
			var nick =  fireConf.fnick?('fnick='+fireConf.fnick):'';
			
			dom.innerHTML = '<div class="W_addbtn_even">' +
					'<img src="' + transPIC + '" title=""' +
					'class="icon_add ' + _className + '" alt=""/>' + _focDoc + '<span class="W_vline">|</span>' +
					'<a class="W_linkb" action-data="'+ nick +'" action-type="' + actionType + '" href="javascript:void(0);"><em>' + lang('#L{取消}') + '</em></a>' +
					'</div>';
		};
		followChannel.register('follow', addFollowListener);

		//取消关注
		var delListener = function(fireConf) {
			fireConf = fireConf || {};
			if (fireConf.uid !== uid) { return; }
			//node变成“加关注”
			var	relation= fireConf.relation || {};
			var temp	= replaceTemplate(template['unFollow'], {
				'followMe'	: relation.follow_me ? template['followMe'] : '',
				'uid'		: fireConf.uid,
				'fnick'		: $CONFIG['onick']
			});
			dom.innerHTML = temp;
		};
		followChannel.register('unFollow', delListener);

		//移除黑名单
		followChannel.register('unBlock', delListener);

		//加入黑名单
		var addBlock = function(fireConf) {
			fireConf = fireConf || {};
			if (fireConf.uid !== uid) { return; }
			dom.innerHTML = '<div class="W_addbtn_even">' + lang('#L{已加入黑名单}') + '<span class="W_vline">|</span>' +
					'<a action-type="unblock" href="javascript:void(0);" class="W_linkb"><em>' + lang('#L{解除}') + '</em></a></div>';
		};
		followChannel.register('block', addBlock);


		//移除粉丝
		var removeFans = function(fireConf) {
			if (fireConf.uid !== uid) { return; }
			if (fireConf.relation.following) {
				addFollowListener(fireConf);
			} else {
				delListener(fireConf);
			}
		};
		followChannel.register('removeFans', removeFans);

		ret.destroy = function() {
			tipFollow.destroy();
			tipFollow = null;
			delegate.destroy();
			//todo destroy  Optimize
			followChannel.remove('follow', addFollowListener);
			followChannel.remove('unFollow', delListener);
			followChannel.remove('unBlock', delListener);
			followChannel.remove('block', addBlock);
			followChannel.remove('removeFans', removeFans);
		};

		//绑定另外一个"加关注"节点
		ret.changNode = function(node, id) {
			delegate.destroy();
			dom = node;
			uid = id;
			delegate = $.core.evt.delegatedEvent(dom);
			registerDelegateActions();
		};


		return ret;
	};
});
