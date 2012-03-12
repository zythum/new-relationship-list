/**
 * 悄悄关注页
 * xinglong1 | xinglong1@staff.sina.com.cn
 */
$Import('ui.alert');
$Import('common.bubble.myFollowSuggest');
$Import('common.relation.userList');
$Import('common.relation.quietFollow');
STK.register('comp.relation.quietFollow', function($){
	var $L = $.kit.extra.language;
	var insertHtml=$.core.dom.insertHTML;
	var trim=$.core.str.trim;
	var addEvent=$.core.evt.addEvent;
	var custEvent=$.core.evt.custEvent;
	var getSize=$.core.dom.getSize;
	var _confirm=$.ui.confirm;
	var _alert=$.ui.alert;
	//var litePrompt=$.ui.litePrompt;
	return function(node){
		var that = {},nodes,sugg,userList;
		var quietFollow=$.common.relation.quietFollow(node);
		var M={
			num:0
		};
		var C={
			saveCount:function(num){
				M.num=num;
			},
			showCount:function(){
				var nd=nodes['quiet_count'];
				nd && (nd.innerHTML=M.num);
			},
			add:function(num){
				!num && (num=0);
				M.num+=num;
				return M.num;
			},
			sub:function(num){
				!num && (num=0);
				M.num-=num;
				return M.num;
			},
			//挂到这里 清零时显示
			changeInfo:function(){
				var nd=nodes['quiet_info'];
				if(!M.num){
					nd && (nd.style.display="");
				}else{
					nd && (nd.style.display="none");
				}
			},
			init:function(){
				var nd=nodes['quiet_count'];
				nd && C.saveCount(parseInt(nd.innerHTML,10));
			}
		};

		var addUser=function(key,action){
			
			var nd=nodes['quiet_searchI'];
			var param={'tpl':1};
			param.action=action||'add';
			if(key&& key.uid){
				param.fuid=key.uid;
			}
			param.fname=trim(nd.value);
			
			var defVl=nd.getAttribute('defVl');
			var box=nodes['userList'];

			if(!param.fuid && (!param.fname || param.fname==defVl)){
				nodes['quiet_searchI'].focus();
				var st,tms=0;
				clearInterval(st);
				nodes['quiet_searchI'].style.backgroundColor="rgb(255,222,222)";
				setInterval(function(){
					if(tms<3){
						if((tms%2)){
							nodes['quiet_searchI'].style.backgroundColor="rgb(255,222,222)";
						}else{
							nodes['quiet_searchI'].style.backgroundColor="";
						}
					}else{
						clearInterval(st);
					}
					tms++;
				},500);
				return;
			};
			// /\D/g.test(key) ? (param['fname']=key):(param['fuid']=key);
			
			var cbk=function(rs){

				if(rs.code=='100000'){
					if(box){
						if (!box.children.length ) {
							window.location.reload();
						}else {
							insertHtml(box, rs.data, 'AfterBegin');
							C.add(1);
							C.showCount();
							C.changeInfo();
							nd.value = "";
						}
					}
				}else if(rs&& (rs.code=='100001')){
							_confirm(rs.msg,{
								'OK':function(){
									addUser(key,'force');
								}
							});
							return;
				}
						
			};
			custEvent.fire(quietFollow,'add',{
				'param': param,
				'callbk': cbk
			});					
		};
		
		var initPlugins=function(){
			if(nodes['userListBox'] && nodes['quiet_count']){
				userList = $.common.relation.userList(nodes);
				custEvent.add(userList, "doRemove", function() {
					C.sub(1);
					C.showCount();
					C.changeInfo();
				});
				custEvent.add(userList, "removeOne", function(dd,opts) {
					var _opts={
						'el':opts.spec.el,
						'data':{
							'fuid':opts.spec.data.fuid,
							'fname':opts.spec.data.fname
						}
					};
					custEvent.fire(quietFollow,'remove',{
						'spec': _opts,
						'callbk': function(rs){
							if(rs.code=='100000'){
								opts.callbk && opts.callbk(rs);								
							}else{
								_alert(rs.msg);
							}

						}
					});	

				});
			};

			if(nodes['quiet_searchI']){
				var w=getSize(nodes['quiet_searchI']).width-3;
				sugg = $.common.bubble.myFollowSuggest({
						'transName':"quiet_suggest",
						'type':1,
						'textNode' : nodes['quiet_searchI'],
						'width':w,
						'callback' : addUser
				});
				sugg.show();
			}

		};
		var bindDOM = function() {
			var nd=nodes['quiet_searchK'];
			var input=nodes['quiet_searchI'];
			if(nd){
				addEvent(nd,'click',function(){
					addUser();
				});
			};
			if(input){
				addEvent(input,'focus',function(){
					input.style.color="";
					if(input.value==input.getAttribute('defVl')){
						input.value="";
					}
				});
				addEvent(input,'blur',function(){
					input.style.color="#B8B7B7";
					if(!input.value){
						input.value=input.getAttribute('defVl');
					}
				});

			};

		};
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.relation.follow]:node is not a Node!";
			}
		};
		
		var parseDOM = function(){
			var buildDom = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(buildDom.list);
		};

		var destroy = function(){
			sugg && sugg.hide && sugg.hide();
			sugg && sugg.destroy && sugg.destroy();
			userList && userList.destroy();
			M=C=nodes = null;

		};
		var init = function(){
			argsCheck();
			parseDOM();
			initPlugins();
			bindDOM();
			C.init();
		};		
		init();
		
		that.destroy = destroy;
		
		return that;

	};
});