/**
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author xinglong1
 * @example
 */
$Import('kit.extra.language');

STK.register('comp.content.popLayer', function($) {

	return function(node, opts) {

		var that = {};
		var sizzle = $.sizzle;
		var addEvent=$.core.evt.addEvent;
		var setCookie=$.core.util.cookie.set;
		var getCookie=$.core.util.cookie.get;
		var getXY=$.core.dom.position;
		var getSize=$.core.dom.getSize;
		var lang=$.kit.extra.language;
		
		var _this = {
		};
		//++++++++++++自定义事件+++++++++++++++

        
        var faces = sizzle('div[node-type="widget"]')[0];
        var smile=sizzle('a[node-type="smileyBtn"]')[0];
		var area=sizzle('textarea[node-type="textEl"]')[0];
        var G = {
            create: function(name, cls, p){
                var el = document.createElement(name);
                cls && (el.className = cls);
                p && (p.appendChild(el));
                return el;
            },
            pop: function(){
                var p = G.create('div', 'layer_tips');
                
                
				var pos=getXY(smile);
				var size=getSize(smile);
				
				p.style.cssText = 'width: 140px; top:'+(pos.t+size.height+13)+'px;left:'+(pos.l-size.width/2+10)+'px;position:absolute;padding-top:5px;padding-bottom:5px;';
				
				var ul = G.create('ul', '',p);
                ul.innerHTML = '<li>'+lang("用微博表情悼念乔布斯")+'</li>';
				var info=lang("#悼念乔布斯#");
				addEvent(ul,'click', function(){
               		var vl=area.value;
					if(vl.indexOf(info)==-1){
						area.value+=' '+info;
						area.focus();
					}
                });


                var closeEl = G.create('a', 'W_close_color', p);
                closeEl.href = "javascript:void(0);";
                addEvent(closeEl,'click', function(){
                    setCookie('face_pop', '1',{'expire': 365 * 24});
                    p.parentNode.removeChild(p);
                });
                
				G.create('span','arrow_up',p);
                document.body.appendChild(p);
				
            },
            start: function(){
				
				if(getCookie('face_pop')){
					return;
				};
				G.pop();
            }
        };

		//+++ 组件销毁方法的定义区 ++++++++++++++++++
		var destroy = function(){
			_this = null;
		};

		//+++ 组件的初始化方法定义区 ++++++++++++++++++
		var init = function(){
			if(!faces || !smile){
				return;
			};
			if(!that.num){ //确保页面载入后执行一次
				that.num=1;
			};
			G.start();
		};
		
		//+++ 执行初始化 ++++++++++++++++++
		init();

		//+++ 组件公开属性或方法的赋值区 ++++++++++++++++++
		that.destroy = destroy;
		
		//-------------------------------------------

		return that;
	};

});