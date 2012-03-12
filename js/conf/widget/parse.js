/**
 * 组件解析
 * @author liusong@staff.sina.com.cn
 */
$Import('widget.module.component');

STK.register('widget.parse', function($){
	
	var  baseURL = 'http://js.t.sinajs.cn/t4/home/js/'
		,baseNS  = 'STK.'
		,custemEventList = ['destroy', 'part_destroy', 'part_flush']
		,defaultVersion = 1
		,version =  (typeof $CONFIG == 'undefined')
					?defaultVersion
					:$CONFIG['version'];
	 
	
	return function(oDom, oConf){
		
		var  it = $.widget.module.component()
			,sup = $.core.obj.sup(it, ['init', 'destroy'])
			,comps = {}
			,conf
			,cId;
		/**
		 * 逻辑处理函数集合
		 */
		it.handler = {
			'getMethod' : function(ns)
			{
				ns = ns.split('.');
				var snap, m = $;
				while(snap = ns.shift()){
					if(!(m = m[snap])){
						break;
					}
				}
				return m;
			}
			/**
			 * 单组件运行
			 * @param {Object} info
			 */
			,'extract' : function(info)
			{
				var method = it.handler.getMethod(info.ns);
				if( method){
					comps[info.uniqueID] = {
						 'info'   : info
						,'entity' : method(info)
					};
					comps[info.uniqueID].entity.init()
				}
			}
			/**
			 * 组件标签解释
			 * @param {Object} dom
			 */
			,'getDomInfo' : function(dom)
			{
				return {
				 'dom'      : dom
				,'top'      : it.entity.dom
				,'ns'       : dom.getAttribute('component')
				,'uniqueID' : $.core.dom.uniqueID(dom)
				,'data'     : $.queryToJson(dom.getAttribute('component-data')||'')
				,'param'    : $.queryToJson(dom.getAttribute('component-param')||'')}
			}
			/**
			 * 组件加载
			 * @param {Object} dom
			 */
			,'loadComponent' : function(dom)
			{
				var info = it.handler.getDomInfo(dom);
				var url = [{
					 'url': [conf['baseURL'], info.ns.replace(/\./g, '/'), '.js?version=', version].join('')
					,'NS' : conf['baseNS'] + info.ns}];
				$.core.io.require(url, it.handler.extract, info);
			}
		};
		/**
		 * 接收事件的处理函数集合
		 */
		it.accept = {
			/**
			 * 局部组件销毁组件
			 * @param {Object} event
			 * @param {Object} info
			 */
			'partDestroy' : function(event, info){
				var before = info.dom;
				for(var k in comps){
					if ($.contains(before, comps[k].info.dom)) {
						comps[k].entity.destroy();
						delete comps[k].info;
						delete comps[k].entity;
						delete comps[k];
					}
				}
			}
			/**
			 * 局部组件更新
			 * @param {Object} event
			 * @param {Object} info
			 */
			,'partFlush' : function(event, info){
				$.foreach($.sizzle('[component]',info.dom), it.handler.loadComponent);
			}
		};
		/**
		 * 初始化变量
		 */
		it.initParam = function(){
			it.entity = {'dom': oDom};
			cId = $.custEvent.define(it.entity.dom, custemEventList);
			conf = $.parseParam({'baseURL': baseURL, 'baseNS': baseNS}, oConf);
			comps = {};
		};
		/**
		 * 销毁变量
		 */
		it.destroyParam = function(){
			conf  = null;
			comps = null;
		};
		/**
		 * 注册事件
		 */
		it.initEvent = function(){
			$.custEvent.add(cId, 'part_destroy', it.accept.partDestroy);
			$.custEvent.add(cId, 'part_flush', it.accept.partFlush);
		};
		/**
		 * 销毁变量
		 */
		it.destroyEvent = function(){
			$.custEvent.remove(cId, 'part_destroy', it.accept.partDestroy);
			$.custEvent.remove(cId, 'part_flush', it.accept.partFlush);
		};
		/**
		 * 组件销毁
		 */
		it.destroy = function(){
			for(var k in comps){
				comps[k].entity.destroy();
				delete comps[k].info;
				delete comps[k].entity;
				delete comps[k];
			}
			sup.destroy();
		};
		/**
		 * 组件初始化
		 */
		it.init = function(){
			sup.init();
			$.foreach($.sizzle('[component]',it.entity.dom), it.handler.loadComponent);
		};
		return it;
	}
});
