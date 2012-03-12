/**
 * @author liusong@staff.sina.com.cn
 */
STK.register('widget.module.component', function($){
	return function(){
		
		var it = {};
		/**
		 * 初始化变量
		 */
		
		it.initParam = $.core.func.empty;
		
		/**
		 * 初始化事件
		 */
		
		it.initEvent = $.core.func.empty;
		
		/**
		 * 销毁变量
		 */
		
		it.destroyParam = $.core.func.empty;
		
		/**
		 * 销毁事件
		 */
		
		it.destroyEvent = $.core.func.empty;
		
		/**
		 * 组件初始化
		 */
		
		it.init = function(){
			it.initParam();
			it.initEvent();
		};
		
		/**
		 * 组件销毁
		 */
		
		it.destroy = function(){
			it.destroyEvent();
			it.destroyParam();
		};
		
		return it;
	}
});
