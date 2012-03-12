/**
 * @author liusong@staff.sina.com.cn
 */
$Import('widget.module.component')
STK.register('widget.component.submit', function($){
	return function(oEntity, oConf){
		//const
		var it = $.widget.module.component();
		
		var sup = $.core.obj.sup(it, ['init']);
		//custem event list
		var custemEventList = [
			 'submit'
			,'submit_before'
			,'validate'
			,'invalidate'
			,'enabled'
			,'disabled'];
			
		//variable
		var validate, enabled, cId, disabledClass, enabledClass;
		
		/**
		 * 刷新按钮状态
		 * validate 标示按钮在可提交状态(1:可提交状态, 0:非可提交状态)
		 * enabled  标示按钮在可点击状态(1:可点击状态, 0:非可点击状态)
		 */
		it.handler = {
			'statueChange': function(){
				var dom;
				if(!(dom = it.entity.dom)){return}
				if(!validate || !enabled){
					if(disabledClass){
						dom.className = disabledClass;
						return;
					}
					$.addClassName(dom, 'disabled');
				}else{
					dom.className = enabledClass;
				}
			}
			,'filter': function(event, info){
				if($.contains(info.dom, it.entity.dom)){
					it.accept[event.type] && it.accept[event.type].apply(null, arguments);
				}
			}
		};
		
		it.accept = {
			/**
			 * 触发点击时，进行状态判定
			 * 如果当前按钮在可点击可提交状态，则广播submit事件
			 * @see widget.component.form
			 */
			'submit_before' : function(){
				if(validate && enabled){
					$.custEvent.fire(cId, 'submit', it.entity);
					validate = 0;
					setTimeout(function(){
						validate = 1;
					},2000);
				}
				return false;
			}
			/**
			 * 重置按钮为可提交状态
			 */
			,'validate': function(){
				validate = 1;
				it.handler.statueChange();
			}
			/**
			 * 重置按钮为不可提交状态
			 */
			,'invalidate': function(){
				validate = 0;
				it.handler.statueChange();
			}
			/**
			 * 重置按钮为可点击状态
			 */
			,'enabled': function(){
				enabled = 1;
				it.handler.statueChange();
			}
			/**
			 * 重置按钮为不可点击状态
			 */
			,'disabled': function(){
				enabled = 0;
				it.handler.statueChange();
			}
		};
		
		/**
		 * 初始化变量
		 */
		it.initParam = function(){
			it.entity = oEntity;
			cId = $.custEvent.define(it.entity.top, custemEventList);
			enabled  = it.entity.param.validate == '0'? 0: 1;
			validate = it.entity.param.validate == '0'? 0: 1;
			enabledClass  = (it.entity.param['enabledClass']||it.entity.dom.className||'');
			disabledClass = (it.entity.param['disabledClass']||'');
		};
		/**
		 * 销毁变量
		 */
		it.destroyParam = function(){
			it.entity = null;
		};
		/**
		 * 初始化事件
		 */
		it.initEvent = function(){
			$.custEvent.add(cId, 'submit_before', it.handler.filter);
			$.custEvent.add(cId, 'validate'     , it.handler.filter);
			$.custEvent.add(cId, 'invalidate'   , it.handler.filter);
			$.custEvent.add(cId, 'enabled'      , it.handler.filter);
			$.custEvent.add(cId, 'disabled'     , it.handler.filter);
			it.entity.dom.onclick = it.accept['submit_before'];
		};
		/**
		 * 销毁变量
		 */
		it.destroyEvent = function(){
			$.custEvent.remove(cId, 'submit_before', it.handler.filter);
			$.custEvent.remove(cId, 'validate'     , it.handler.filter);
			$.custEvent.remove(cId, 'invalidate'   , it.handler.filter);
			$.custEvent.remove(cId, 'enabled'      , it.handler.filter);
			$.custEvent.remove(cId, 'disabled'     , it.handler.filter);
			it.entity.dom.onclick = null;
		};
		
		it.init = function(){
			sup.init();
			if(it.entity.param.disabled){it.accept.disabled()}
		};
		
		return it;
	}
});