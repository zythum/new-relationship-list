/**
 * @id pl_help_quiz
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author xinglong1
 * @example
 */
$Import('common.trans.helpService'); 
$Import('ui.alert');
$Import('kit.extra.language');
STK.register('comp.help.quiz', function($) {
	
	return function(node, opts) {

		var that = {};
		var sizzle = $.sizzle;
		var addEvent=$.core.evt.addEvent;
		var removeEvent=$.core.evt.removeEvent;
		var getbLength=STK.core.str.bLength;
		var trim=STK.core.str.trim;
		var lang=$.kit.extra.language;
		var trans=$.common.trans.helpService;
		var _alert=$.ui.alert;
		var _this = {
			'M':{},
			'type':sizzle('em[node-type="quiz_type"]')[0],
			'type_div':sizzle('div[node-type="quiz_type_div"]')[0],
			'info':sizzle('dd[node-type="quiz_info"]')[0],
			'number':sizzle('div[node-type="quiz_number"]')[0],
			'describe':sizzle('textarea[node-type="quiz_describe"]')[0],
			'sumit':sizzle('a[node-type="quiz_sumit"]')[0],
			'suggest':sizzle('div[node-type="quiz_suggest"]')[0]
		};
		//+++ 参数的验证方法定义区 ++++++++++++++++++
		var argsCheck = function(){
			if(!node) {
				throw new Error('node没有定义');
			}
		};
		//++++++++++++自定义事件+++++++++++++++
		var waite=function(el,spec){
			var sp =el.getElementsByTagName('span')[0] || el;
			var text=spec.text;
			var sta=spec.sta;
			if(!sp){return};
			if(sta){
                sp.inhtml = sp.innerHTML;
                sp.innerHTML = '<b class="loading"></b>' + (text||sp.inhtml);
			}else{
                sp.inhtml &&(sp.innerHTML = sp.inhtml);
				sp.inhtml=null;
			};
			spec.func && spec.func();
		};
		
        var quiz={
			checkType:function(){
				var nd=_this.type;
				var info=_this.info;
				var idx;
				if(!nd){
					return false;
				};
				idx=nd.getAttribute("value");
				if(!idx){
					 _alert(lang("#L{请选择问题类型}"), {
                        'timeout': 3000
                    });
				};
				return  idx;
			},
			checkDescribe:function(){
				var nd=_this.describe;
				if(!nd){return false};
				var vl=getbLength(trim(nd.value));
               
                if (!vl) {
                    _alert(lang("#L{请输入详细的问题描述}"), {
                        'timeout': 3000
                    });
                }
                else 
                    if (vl > 601) {
                    	_alert(lang("#L{问题描述已超出300字}"),{'timeout':3000});
                    };
				return  vl && (vl<=601);
			},
			count:function(){
				var nd=_this.describe;
				var number=_this.number;
				var num= 300-Math.floor(getbLength(nd.value)/2); //.length;
				var t1=['#L{还可输入<em>','</em>字}'];
				var t2=['#L{已超出<em style="color:red">','</em>字}'];
				var sta=num>=0;
				num=Math.abs(num);
				var info=lang(sta? t1[0]+num+t1[1] : t2[0]+num+t2[1]);
				nd && number && (number.innerHTML=info);
				if(!sta){
					nd.style.borderColor="red";
				}else{
					nd.style.borderColor="";
				};
				return sta;
			},
			check:function(){
				return quiz.checkType() && quiz.checkDescribe();
			},
			reset:function(){
				var defaultText = _this.type.getAttribute("defaultText");
				if(defaultText){
					_this.type.removeAttribute("value");
					_this.type.innerHTML = defaultText;
				}
				quiz.showSuggest(0);
				_this.describe.value="";
				quiz.count();
			},
			goSubmit:function(){	
				if(!quiz.check()){
					return;
				}else{
					waite(_this.sumit,{'sta':true,'func':function(){
						_this.sumit && removeEvent(_this.sumit,'click',quiz.goSubmit);
					}});
				};
				//去提交
				
				
				var tp=_this.type;
				var des=_this.describe;
				var _param={
					'quiz_type' :tp.getAttribute("value") || '',
					'quiz_describe':des.value
				};
				tp=param=null;
				var cbk=function(){
					_this.sumit && addEvent(_this.sumit,'click',quiz.goSubmit);
				};
				trans.getTrans("request", {
						"onSuccess": function(req,param) {
							waite(_this.sumit,{'sta':false,'func':cbk});
							quiz.reset();
							var info=lang('#L{问题提交成功<br>你提交的问题会在24小时内得到我们的答复。会以通知形式告知你}');
							_alert(info,{'icon':'success','timeout':3000});
						},
						"onError": function(req,param) {
							_alert(req.msg,{'timeout': 3000});
							waite(_this.sumit,{'sta':false,'func':cbk});
						}
				}).request(_param);
			},
			makeSuggest:function(vl){
				var el=document.createElement('ul');
				el.className="topic_list topic_list_f14 clearfix";
				el.innerHTML=lang('#L{正在加载...}');
				el.style.display="none";
				_this.suggest && _this.suggest.appendChild(el);
				return _this.M['v'+vl]=el;
				//<ul class="topic_list topic_list_f14 clearfix">
				
			},
			getSuggest:function(vl){
				var ul=_this.M['v'+vl];
				if(ul){return ul;};
				var el=quiz.makeSuggest(vl);
				var _param={
					'type':vl
				};
				trans.getTrans("quiz_suggest", {
						"onSuccess": function(req,param) {
							el && (el.innerHTML=req.data);
						},
						"onError": function(req,param) {
							_alert(req.msg);
						}
				}).request(_param);
				return el;
			},
			showSuggest:function(vl){
				var old=_this.M['old'];
				old && (old.style.display="none");
				var suggest=_this.suggest; 
				if(vl==0){
					old=null;
					suggest && (suggest.style.display="none"); 
					return;
				};
				old=_this.M['old']=quiz.getSuggest(vl);
				suggest && (suggest.style.display=""); 
				old.style.display="";
			}
		};


		//+++ DOM事件绑定方法定义区 ++++++++++++++++++
		var bindDOM = function(){
			if(_this.type && _this.type_div){
				var parent = _this.type.parentNode;
				_this.type_div.style.left = "0px";
				_this.type_div.style.top = "27px";
				addEvent(parent ,'click',function(){
					if(_this.type_div.style.display == "none"){
						_this.type_div.style.display = "";
					}else{
						_this.type_div.style.display = "none";
					}
				});
				addEvent(_this.type_div ,'click',function(e){
					var target = $.fixEvent(e).target;
					if(target.nodeName == "A"){
						var value = target.getAttribute("value");
						if(value){
							if(!_this.type.getAttribute("defaultText")){
								_this.type.setAttribute("defaultText",_this.type.innerHTML);
							}
							_this.type.innerHTML = target.innerHTML;
							_this.type.setAttribute("value",value);
							_this.type_div.style.display = "none";	
							quiz.showSuggest(value);
						}
					}
					$.preventDefault(e);
				});
				addEvent(document, 'click', function(e){
					var el	= $.fixEvent(e).target;
					if(el === parent || $.core.dom.contains(parent, el)){ return; }
					_this.type_div.style.display = "none";	
				});
			}
			
			_this.describe && addEvent(_this.describe ,'keyup',function(){
				quiz.count();
			});
			
			_this.sumit && addEvent(_this.sumit,'click',quiz.goSubmit);
		};

		//+++ 组件销毁方法的定义区 ++++++++++++++++++
		var destroy = function(){
			_this = null;
		};

		//+++ 组件的初始化方法定义区 ++++++++++++++++++
		var init = function(){
			argsCheck();
			bindDOM();
		};
		
		//+++ 执行初始化 ++++++++++++++++++
		init();

		//+++ 组件公开属性或方法的赋值区 ++++++++++++++++++
		that.destroy = destroy;
		
		//-------------------------------------------

		return that;
	};

});