/**
 * 微博宝典  加关注
 * @id $.common.guide.tasks
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author xinglong1 | xinglong1@staff.sina.com.cn
 * @example
 */
$Import('ui.alert');
$Import('ui.litePrompt');
$Import('ui.confirm');
$Import('kit.extra.language');
$Import('common.trans.tasks');
STK.register('comp.tasks.follow', function($) {
	var trim=$.core.str.trim,
		setStyle=$.core.dom.setStyle,
		insertBefore=$.core.dom.insertBefore,
		removeChild=$.core.dom.removeNode,
		getSize=$.core.dom.getSize,
		sizzle = $.sizzle,
		inArray=$.core.arr.inArray,
		indexOf=$.core.arr.indexOf,
		addEvent=$.core.evt.addEvent,
		qtojson=$.core.json.queryToJson,
		_alert=$.ui.alert,
		_confirm=$.ui.confirm,
		lang=$.kit.extra.language,
		litePrompt=$.ui.litePrompt,
		merge=$.core.json.merge;
	return function(nodes, panel){
		var that	= {};
		var tasks=$.common.trans.tasks;
		var _nodes={
			'ul_p':nodes['rec_friend_result'],
			'checkBox':nodes['rec_friend_checkAll'],
			'count':nodes['rec_friend_num'],
			'addFollow':nodes['rec_friend_follow'],
			'tabs':[]
		};
		
		var M={
			users:{},
			uids:[],
			count:0,
			clsArgs:null,
			ulist:null
		};
		
		var C={
			release:function(){
				delete M.uids;
				delete M.users;
				delete M.ulist;
				delete M.clsArgs;
				M.uids=[];
				M.users={};
				M.clsArgs=null;
				M.ulist=[];
				M.count=0;
			},
			setCount:function(){
				M.count=M.uids.length;
			},
			getCount:function(){
				return M.count;
			},
			getUids:function(){
				return M.uids.join(',');
			},
			remove:function(uid){
				var idx=indexOf(uid,M.uids);
				(idx!=-1) && M.uids.splice(idx,1);
				delete M.users[uid];
				C.setCount();
			},
			save:function(uid,refer_flag){
				if(!uid){return};
				if(!M.clsArgs){
					M.clsArgs={
						'refer_sort':'baodian',
						'location':$CONFIG['pageid'],
						'refer_flag':refer_flag
					};
				};
				
				!inArray(uid,M.uids)&& M.uids.push(uid);
				M.users[uid]=uid;
				C.setCount();
			},
			check:function(uid){
				return M.users[uid];
			},
			getClsArgs:function(){
				return M.clsArgs||{};
			},
			setUlist:function(){
				M.ulist=sizzle('[action-type="rec_cell_friend"]');
			},
			getUlist:function(){
				return M.ulist;
			},
			checkFull:function(){//检查是否全部选中
				var list=C.getUlist();
				return (list.length!=0) && (list.length==M.count);
			}
		};
		
		var V={
			showCount:function(){
				_nodes['count'] && (_nodes['count'].innerHTML=C.getCount());
			},
			changeCheckBox:function(){
				var sta=C.checkFull();
				_nodes['checkBox'] && (_nodes['checkBox'].checked= sta);
			},
			setHtml:function(data){
				_nodes['ul_p'] && (_nodes['ul_p'].innerHTML=data||'');
			},
			show:function(){
				V.showCount();
				V.changeCheckBox();
			}
		};
		
		var load={
			ll:function(sta){
				var ul=_nodes['ul_p'];
				if(!ul){return};
				var div=_nodes.ldiv;
				if(sta && !div){
					var div=document.createElement('div');
					var size=getSize(ul.parentNode);
					size.height+=3;
					
					var arr=['width:',size.width,'px; height:',size.height,'px; position: absolute;'];
					div.innerHTML='<i></i><span></span>';
					div.className='loading';
					div.style.cssText=arr.join('');
					setStyle(ul.parentNode,'position','relative');
					insertBefore(div,ul);

					size=null;
					_nodes.ldiv=div;
				}else if(!sta){
					setStyle(ul.parentNode,'position','');
					_nodes.ldiv &&removeChild(_nodes.ldiv);
					delete _nodes.ldiv;
				}
			},
			swtchAddFollowLoading:function(sta){
				load.ll(sta);
			},
			swtchTabLoading:function(sta){
				C.release();//清理数据
				V.show() //表现
				load.ll(sta);
			}
		};
		
		var tabs={
			cur:null,
			cls:'',
			swtch:function(el){
				if(tabs.cur){
					tabs.cur.className=trim(tabs.cur.className.replace(tabs.cls,''));
				};
				el.className+=tabs.cls;
				tabs.cur=el;
			},
			errorDo:function(msg){
				litePrompt(msg, {
					'type':'succM',
					'timeout':2000
				});
				bindDOMFuncs.tabClick(tabs.getNextTabData()); 
			},
			getNextTabData:function(){
				var nd=tabs.cur.next||_nodes['tabs'][0];
				return {
					'el':nd,
					'data':qtojson(nd.getAttribute('action-data') || '')
				};
			},
			init:function(){
				tabs.cls='current';
				var nds=sizzle('[action-type="rec_friend_get"]');
				var len=nds.length;
				_nodes['tabs']=nds;
				for(var i=0;i<len;i++){
					if(i<len-1){
						nds[i].next=nds[i+1];
					}else{
						nds[i].next=nds[0];
					}
				};
				tabs.cur=nds[0];
			}
		};

		var Trans={
			getUserList : tasks.getTrans('getUsers',{
					'onSuccess': function(rs){
						load.swtchTabLoading(0);
						V.setHtml(rs.data);
						C.setUlist();
					},
					'onError': function(rs){
						rs.msg && tabs.errorDo(rs.msg);
					},
					'onFail': function(rs){
						rs.msg && tabs.errorDo(rs.msg);
					}
				}),
			addFollow:function(args){
				return tasks.getTrans('addFollow',{
				'onSuccess': function(rs){
					load.swtchTabLoading(0);
					$.ui.litePrompt(lang('#L{关注成功}'), {
						'type':'succM',
						'timeout':1000
					});
					var spec=args;
					if(!spec.el || !spec.data){
						spec=tabs.getNextTabData();
					}
					bindDOMFuncs.tabClick(spec); 
				},
				'onError': function(rs){
					load.swtchAddFollowLoading(0);
					rs && rs['msg'] && _alert(rs['msg']);
				},
				'onFail': function(rs){
					load.swtchAddFollowLoading(0);
					rs && rs['msg'] &&_alert(rs['msg']);
				}
			},args)
			}
		};

		var chooseAllorNot=function(spec,sta){
			var el=spec.el;
			var uid=spec.data.uid;
			if(!sta && C.check(uid)){
				C.remove(uid);
				el.className="";
			}else if(sta && !C.check(uid)){
				C.save(uid,spec.data.refer_flag);
				el.className="current";
			};
			V.show();
		};
		
		var judgeAddFollow=function(spec){
				_confirm(lang('#L{啊哦，你忘记关注已经选好的博主呢。现在要关注他们吗？}'),{
					'OK':function(){
						bindDOMFuncs['addFollow'](spec);
					},
					'cancel':function(){
						C.release();
						bindDOMFuncs.tabClick(spec); 
					}
				})
		}
		
		var bindDOMFuncs = {
			'tabClick': function(spec){
				var el = spec.el;
				if(el==tabs.cur){return};
				if(C.getCount()){
					judgeAddFollow(spec);
				}else{
					tabs.swtch(el);
					load.swtchTabLoading(1);
					Trans.getUserList.request(spec.data||{});
				}
			},
			'choose':function(spec){
				var el=spec.el;
				var uid=spec.data.uid;
				if(C.check(uid)){
					C.remove(uid);
					el.className="";
				}else{
					C.save(uid,spec.data.refer_flag);
					el.className="current";
				};
				V.show();
			},
			'chooseAll':function(){
				var list=C.getUlist();
				var len=list.length;
				var spec={};
				var sta= _nodes['checkBox'].checked;
				for(var i=0;i<len;i++){
					spec.el=list[i];
					spec.data=qtojson(list[i].getAttribute('action-data') || '');
					chooseAllorNot(spec,sta);
				}
			},
			'addFollow':function(args){
				if(!C.getCount()){
					_alert(lang("#L{请至少选择一个人哦。}"));
					return;
				}
				load.swtchAddFollowLoading(1);
				var data=C.getUids();
				Trans.addFollow(args).request(merge({'uid':data},C.getClsArgs()));
			}
		};
		
		var bindDOM = function(){
			panel.bindEvent('rec_friend_get', 'click', bindDOMFuncs['tabClick']);
			panel.bindEvent('rec_cell_friend', 'click', bindDOMFuncs['choose']);
			_nodes['checkBox']&& addEvent(_nodes['checkBox'],'click',bindDOMFuncs['chooseAll']);
			_nodes['addFollow']&& addEvent(_nodes['addFollow'],'click',bindDOMFuncs['addFollow']);
		};

		var init = function(){
			tabs.init();
			C.setUlist();
			bindDOM();
		};

		var destroy = function(){
			_nodes=null;
			M=null;
		};
		that.destroy = destroy;	
		
		init();
		return that;
	};
});