/**
 * @author xinglong1 | xinglong1@staff.sina.com.cn
 * 取消悄悄关注|添加悄悄关注
 * 1，可以启动获取句柄的时候 使用第二个参数集作为 回调使用
 * 2，也可使用 启动后获得的句柄后，动态传参，以及回调
 */
$Import('ui.confirm');
$Import('ui.alert');
$Import('ui.litePrompt');
$Import('kit.dom.parseDOM');
$Import('kit.extra.language');
$Import('common.trans.relation');
STK.register('common.relation.quietFollow', function($){
	var _confirm=$.ui.confirm,
		litePrompt=$.ui.litePrompt,
		_alert=$.ui.alert,
		custEvent=$.core.evt.custEvent,
		lang=$.kit.extra.language;
	return function(node,opts){
		
		var that	= {},
			$L		= $.kit.extra.language,
			parseParam=$.core.obj.parseParam,
			dEvent	= $.core.evt.delegatedEvent(node);
		var nodes;

		var _addQFollow=function(args,callbk){
			var param={'location':$CONFIG['location']||''}; //统计
			param['action']=args['action']||'add';
			args['fname']&& (param['fname']=args['fname']);
			args['fuid']&& (param['fuid']=args['fuid']);
			args['tpl']&& (param['tpl']=args['tpl']);
			if(!param['fname'] && !param['fuid']){
				return;
			};

			$.common.trans.relation.request('quiet_addUser', {
				'onSuccess': function(rs){
					litePrompt(lang('#L{成功悄悄关注}')+(args['fname']||''),{'timeout':1000});
					callbk && callbk(rs);
				},
				'onError': function(rs){
					if(rs.code!='100001'){
						rs&& rs.msg && _alert(rs.msg);
					};
					callbk && callbk(rs);
				},
				'onFail' : function(rs){
					rs&& rs.msg && _alert(rs.msg);
				}
			},param);
		};
		
		var _removeQFollow=function(args,callbk){
			var param={'location':$CONFIG['location']||''}; //统计
			args['fname']&& (param['fname']=args['fname']);
			args['fuid']&& (param['fuid']=args['fuid']);
			if(!param['fname'] && !param['fuid']){
				return;
			};
			$.common.trans.relation.request('quiet_removeUser', {
				'onSuccess': function(rs){
					litePrompt(lang('#L{成功取消悄悄关注}')+(args['fname']||''),{'timeout':1000});
					callbk &&callbk(rs);
				},
				'onError': function(rs){
					rs&& rs.msg &&  _alert(rs.msg);
					callbk && callbk(rs);
				},
				'onFail' : function(rs){
					rs&& rs.msg &&  _alert(rs.msg);
				}
			},param);
		};
		
				
		var bindDOMFuns = {
			addQFollow:function(spec){
				var el=spec.el;
				var data=spec.data;
				data.fname=data.fname||'';
				var cbk=function(rs){
					if(rs&& (rs.code=='100001')){
						_confirm(rs.msg,{
							'OK':function(){
								data.action='force';
								_addQFollow(data,cbk);
							}
						});
						return;
					}
					opts.addQFollow && opts.addQFollow(rs);
				};
				_addQFollow(data,cbk);
			},
			rmQFollow:function(spec){
				var el=spec.el;
				var data=spec.data;
				data.fname=data.fname||'';
				var cbk=function(rs){
					opts.removeQFollow&& opts.removeQFollow(rs);
				};
				_removeQFollow(data,cbk);
			}
		};
		
		
		/*****绑定部分*****/
		
		var bindDOM = function(){
			dEvent.add('addQuietFollow', 'click', bindDOMFuns.addQFollow);
			dEvent.add('removeQuietFollow', 'click', function(spec){
				var fname=spec.data.fname||'';
				_confirm(lang('#L{确定不再悄悄关注}')+fname+'？',{
					'OK':function(){
						bindDOMFuns.rmQFollow(spec);
					}
				});
			});

		};
		var bindCustEvent=function(){	
			custEvent.define(that,'add');
			custEvent.define(that,'remove');
			
			custEvent.add(that,'add',function(hd,args){
				var param=args && args.param;
				_addQFollow(param,args.callbk);
			});
			custEvent.add(that,'remove',function(hd,args){
				var spec=args && args.spec;
				var fname=spec.data.fname||'';
				_confirm(lang('#L{确定不再悄悄关注}')+fname+'？',{
					'OK':function(){
						_removeQFollow(spec.data,args.callbk);
					}
				});
			});
		};
		
		var parseDOM = function(){
			var buildDom = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(buildDom.list);
		};
				
		var destroy = function(){
			dEvent.destroy();
			custEvent.remove(that,'add');
			custEvent.remove(that,'remove');
			nodes = null;
		};

		var init = function(){
			parseDOM();
			bindDOM();
			bindCustEvent();
		};
		
		that.destroy = destroy;
		init();
		
		return that;
	};
});
