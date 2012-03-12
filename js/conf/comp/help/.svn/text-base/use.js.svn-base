/**
 * @id pl_help_use
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author xinglong1
 * @example
 */
$Import('common.trans.helpService'); 
$Import('ui.alert');
STK.register('comp.help.use', function($) {
	
	return function(node, opts) {

		var that = {};
		var sizzle = $.sizzle;
		var addEvent=STK.core.evt.addEvent;
		var removeEvent=$.core.evt.removeEvent;
		var lang=$.kit.extra.language;
		var trans=$.common.trans.helpService;
		var _alert=$.ui.alert;
		var _this = {
			"yes":sizzle('a[node-type="problemServ_Y"]')[0],
			"no":sizzle('a[node-type="problemServ_N"]')[0],
			'parent':sizzle('div[node-type="problemServ"]')[0],
			'infoY':sizzle('div[node-type="problemInfo_Y"]')[0],
			'infoN':sizzle('div[node-type="problemInfo_N"]')[0]
		};
		//+++ 参数的验证方法定义区 ++++++++++++++++++
		var argsCheck = function(){
			if(!node) {
				throw new Error('node没有定义');
			}
		};
		//++++++++++++自定义事件+++++++++++++++
		var waite=function(el,spec){
			if(!el){return false};
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
		var C={
			show:function(el){
				el.style.display="";
			},
			hid:function(el){
				el.style.display="none";
			},
			send:function(nd,sta){
                waite(nd, {
                    'sta': true,
                    'func': function(){
                        nd && removeEvent(nd, 'click', sta ? C.clkY : C.clkN);
                    }
                });
                //去提交
                var _param = {
					'ishelp':sta,
					'id':scope.solutionId || '' //页面获取问题id
				};
                var cbk = function(){
                    nd && addEvent(nd, 'click', sta ? C.clkY : C.clkN);
                };
                trans.getTrans("use", {
                    "onSuccess": function(req, param){
                        waite(nd, {
                            'sta': false,
                            'func': cbk
                        });
                        var info = sta? _this.infoY:_this.infoN;
                        _this.parent && C.hid(_this.parent);
                        info && C.show(info);
                    },
                    "onError": function(req, param){
                        _alert(req.msg);
                        waite(nd, {
                            'sta': false,
                            'func': cbk
                        });
                    }
                }).request(_param);
			},
			clkY:function(){
				C.send(_this.yes,1);
			},
			clkN:function(){
				C.send(_this.no,0);
			}
		}

		//+++ DOM事件绑定方法定义区 ++++++++++++++++++

		var bindDOM = function(){
			var Y=_this.yes;
			var N=_this.no;

			Y && addEvent(Y,'click',C.clkY);
			N && addEvent(N,'click',C.clkN);

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