/**
 * @id pl_help_problemMore
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author xinglong1
 * @example
 */
STK.register('comp.help.problemMore', function($) {
	
	return function(node, opts) {

		var that = {};
		var sizzle = $.sizzle;
		var addEvent=$.core.evt.addEvent;
		var getXY=$.core.dom.position;
		var setXY=$.core.dom.setXY;
		var getSize=$.core.dom.getSize;
		var _this = {
			"more":sizzle('a[node-type="problem_more"]')[0],
			"moreLayer":sizzle('div[node-type="problem_moreLayer"]')[0]
		};
		//+++ 参数的验证方法定义区 ++++++++++++++++++
		var argsCheck = function(){
			if(!node) {
				throw new Error('node没有定义');
			}
		};
		//++++++++++++自定义事件+++++++++++++++
		var Control={
			show:function(el){
				if(Control.st){
					clearTimeout(Control.st);
					Control.st=null;
				};
				el.style.display="";
			},
			hid:function(el){
				Control.st=setTimeout(function(){
					el.style.display="none";
				},100);
			},
			init:function(){
				if(!_this.more){return};
				var size=getSize(_this.more);
				var XY=getXY(_this.more);
				XY.t+=size.height;
				XY.l+=2; //偏移量
				setXY(_this.moreLayer,XY);
				size=XY=null;
			}
		}

		//+++ DOM事件绑定方法定义区 ++++++++++++++++++
		var bindDOM = function(){
			//Control.init();
			var more=_this.more;
			var layer=_this.moreLayer;
			if(more&&layer){
				addEvent(more,'mouseover',function(){
					Control.show(layer);
					Control.init();
				});
				addEvent(layer,'mouseover',function(){
					Control.show(layer);
					Control.init();
				});
				
				addEvent(more,'mouseout',function(event){
					Control.hid(layer);
				});
				addEvent(layer,'mouseout',function(){
					Control.hid(layer);
				});
			};
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