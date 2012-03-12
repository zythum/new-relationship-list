/**
 * yuheng@staff.sina.com.cn
 * @param {Object} opts
 * @param {Object} node
 * @exam opts = {
 *  	evtType : 'click' || 'mouseover',
 * 		tNodes : '',
 * 		dNodes : '',
 *		className : '',
 *		cb : function(){} || []
 * }
 */
STK.register('module.editorPlugin.tab',function($){
	return function(node,opts){
		var addEvent = $.core.evt.addEvent,
		addClass = $.core.dom.addClassName,
		removeClass = $.core.dom.removeClassName,
		isArray = $.core.arr.isArray,
		prevent = $.core.evt.preventDefault,
		setStyle = $.core.dom.setStyle,
		tNodes,dNodes,cb,eType,cls,l,idx;
		
		
		function setIdx(n){
			var callback = (isArray(cb))?cb[n]:cb,
				tNode = tNodes[n],dNode = isArray(dNodes)?dNodes[n]:null;
				otNode = tNodes[idx],odNode = isArray(dNodes)?dNodes[idx]:null;
			if(dNode){
				setStyle(dNodes[idx],'display','none');
				setStyle(dNodes[n],'display','');
			}
			
			removeClass(tNodes[idx],cls);
			addClass(tNodes[n],cls);
			if(n == idx){
				return ;
			}
			callback({
				'idx' : n,
				'node' : dNode
			});
			
			idx = n;
		}
		
		function checkParam(){
			if (!isArray(tNodes)) {  throw 'module.editorPlugin.tab needs tNodes as Array!'; }
			if (!isArray(dNodes)) {  throw 'module.editorPlugin.tab needs tNodes as Array!'; }
			if (tNodes.length != dNodes.length){
				throw 'module.editorPlugin.tab needs tNodes\'length equal to dNodes\'length!';
			}
		}
		
		function init(node,opts){
			var oOpts = {
				'evtType' : 'click',
				'tNodes' : '',
				'dNodes' : '',
				'className' : 'cur',
				'cb' : function(){},
				'defaultIdx' : 0 
			};
			
			oOpts = $.core.obj.parseParam(oOpts,opts);

			cb = oOpts.cb;
			cls = oOpts.className;
			idx = oOpts.defaultIdx;
			eType = oOpts.evtType;
			
			tNodes = (typeof oOpts.tNodes == 'string')?$.sizzle(oOpts.tNodes,node):oOpts.tNodes;
			l = tNodes.length;
			
			if(oOpts.dNodes !== ''){
				dNodes = (typeof oOpts.dNodes == 'string')?$.sizzle(oOpts.dNodes,node):oOpts.dNodes;
				checkParam();
			}

			for(var i=0; i<l; i++){
				addEvent(tNodes[i],eType,function(n){
					return function(){
						prevent();
						setIdx(n);
					}
				}(i));
			}
		};
		//
		var it = {};
		it.initView = function(n){
			n = n||opts['defaultIdx'];
			setStyle(dNodes[n],'display','');
			addClass(tNodes[n],cls);
			//处理回调
			var callback = (isArray(cb))?cb[n]:cb,
				dNode = isArray(dNodes)?dNodes[n]:null;
			callback({
				'idx' : n,
				'node' : dNode
			});
			//更新句柄
			idx = n;
		};
		it.refresh = function(index){
			tNodes[index] && $.fireEvent(tNodes[index], 'click');
		};
		//
		init(node,opts);
		
		return it;
	};
});
