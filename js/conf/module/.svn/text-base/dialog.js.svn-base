/**
 * 对话框
 * 事件show,hide,resize,change
 * @id STK.module.dialog
 * @param {String} html 对话框节点字符串 必须的node-type:outer inner title close
 * @param {Object} option
 * {
 * 		top:undefined //与页面body的上距离
 * 		,left:undefined //与页面body的左距离
 * 		,width:auto //对话框内宽
 * 		,height:auto //对话框内高
 * 		,align:{type:'c', offset:[0,0]} //类似于 fix中的 type 和offset参数  不传时不支持固定
 * 		,dragable:true //true/false 是否支持移动功能
 * }
 * 
 * @return {Object} 
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example 
 * 
 * @import STK.core.dom.builder
 * @import STK.core.dom.setStyle
 * @import STK.core.dom.removeNode
 * @import STK.core.evt.custEvent
 * @import STK.core.util.fix
 */

$Import('module.layer');

STK.register('module.dialog', function($){
//	var setPosition = function(){
//		box.style.top = spec.t + 'px';
//		box.style.left = spec.l + 'px';
//		return that;
//	};
	
	return function(template, spec){
		if(!template){
			throw 'module.dialog need template as first parameter';
		}
		var conf,layer,that,box,title,content,close,titleContent,supportEsc,beforeHideFn,diaHide,sup;
		supportEsc = true;
		var escClose = function(){
			if(supportEsc !== false){
				layer.hide();
			}
		};
		var init = function(){
			conf = $.parseParam({
				't' : null,
				'l' : null,
				'width' : null,
				'height' : null
			},spec);
			layer = $.module.layer(template,conf);
			box = layer.getOuter();
			title = layer.getDom('title');
			titleContent = layer.getDom('title_content');
			content = layer.getDom('inner');
			close = layer.getDom('close');
			$.addEvent(close,'click',function(e){
				$.preventDefault(e);
				diaHide();
				return false;
			});
			
			$.custEvent.add(layer, 'show', function(){
				$.hotKey.add(document.documentElement, ['esc'], escClose, {'type' : 'keyup', 'disableInInput' : true});
			});
			$.custEvent.add(layer, 'hide', function(){
				$.hotKey.remove(document.documentElement, ['esc'], escClose, {'type' : 'keyup'});
				supportEsc = true;
			});
			
		};
		init();
		sup = $.objSup(layer, ['show', 'hide']);
		diaHide =  function(isForce) {
			if(typeof beforeHideFn === 'function' && !isForce){
				if(beforeHideFn() === false){
					return false;
				}
			}
			sup.hide();
			if($.contains(document.body, layer.getOuter())) {
				document.body.removeChild(layer.getOuter());
			}
			return that;
		};


		that = layer;

		that.show = function() {
			if(!$.contains(document.body, layer.getOuter())) {
				document.body.appendChild(layer.getOuter());
			}
			sup.show();
			return that;
		};
		that.hide = diaHide;
		
		that.setPosition = function(pos){
			box.style.top = pos['t'] + 'px';
			box.style.left = pos['l'] + 'px';
			return that;
		};
		that.setMiddle = function(){
			var win = $.core.util.winSize();
			var dia = layer.getSize(true);
			box.style.top = $.core.util.scrollPos()['top'] + (win.height - dia.h)/2 + 'px';
			box.style.left = (win.width - dia.w)/2 + 'px';
			return that;
		};
		that.setTitle = function(txt){
			titleContent.innerHTML = txt;
			return that;
		};
		that.setContent = function(cont){
			if(typeof cont === 'string'){
				content.innerHTML = cont;
			}else{
				content.appendChild(cont);
			}
			return that;
		};
		that.clearContent = function(){
			while(content.children.length){
				$.removeNode(content.children[0]);
			}
			return that;
		};
		that.setAlign = function(){
			
		};
		that.setBeforeHideFn = function(fn){
			beforeHideFn = fn;
		};
		that.clearBeforeHideFn = function(){
			beforeHideFn = null;
		}
		that.unsupportEsc = function(){
			supportEsc = false;
		};
		that.supportEsc = function(){
			supportEsc = true;
		};
		return that;
		
	};
});
