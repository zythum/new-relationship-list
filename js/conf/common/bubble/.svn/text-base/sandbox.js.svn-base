/**
 * @author wangliang3
 * 发布器控件管理
 */
$Import('ui.bubble');
$Import('widget.parse');

STK.register('common.bubble.sandbox',function($){
	var cash={};
	return function(pars){
		var it={};
		
		//发布器回写
		var insert = function(){
			pars['insert'](arguments[0],arguments[1]);
			box.remove(cash['ishow']);
		};
		//发布器组件盒子管理
		var box = {
			add: function(data){
				if (!cash[data.id]) {
					cash[data.id] = {};
					//test data 别删，留着吧，调试用
//					var html = ['<div component="widget.component.bridge" style="width:200px;padding:15px">'
//								    ,'<div id="holdit" class="form" component="widget.component.form" component-param="appkey=demo" component-data="a=1&b=2">'
//									,'<input type="text" name="ff" value="2"/>'
//									,'<div component="widget.component.buttonGroup" component-param="max=3&min=1">'
//										,'<input type="radio" name="cs" value="1"/>'
//										,'<input type="radio" name="cs" value="1"/>'
//										,'<input type="radio" name="cs" value="1"/>'
//										,'<input type="checkbox" name="cs" value="1"/>'
//										,'<input type="checkbox" name="cs" value="2"/>'
//									,'</div>'
//									,'<div component="widget.component.selectArea" component-param="type=country&code=C00001&text=请选择">'
//										,'<select style="width:60px;" component-param="type=country"></select>'
//										,'<select style="width:60px;" component-param="type=province"></select>'
//										,'<select style="width:60px;" component-param="type=city"></select>'
//									,'</div>'
//									,'<div>limitInput:<input type="input" name="limitinput" component="widget.component.limitInput" component-param="max=10" value="11"/></div>'
//									,'<div>calender:<input type="input" name="calender" component="widget.component.calender" component-param="default=请选择时间&end=2013-12-19&start=2010-02-19" value=""/></div>'
//									,'<div component="widget.component.file" component-param="map=imgpreview&number=1&width=100&height=15&once=1" name="file" ><a href="#">点击上传文件</a></div>'
//									,'<div component="widget.component.preview" component-param="map=imgpreview"></div>'
//									,'<div component="widget.component.expand" component-param="map=textpreview&state=expand&expand=expand&fold=fold&once=1"><a href="#">关闭下面预览区</a></div>'
//									,'<div component="widget.component.preview" component-param="map=textpreview">文字预览区文字预览区文字预览区文字预览区文字预览区</div>'
//									,'<a href="#" onclick="return false;" class="button" component="widget.component.submit" component-param="disabled=1&enabledClass=button&disabledClass=disabledClass">提 交</a>'
//									,'<div  class="error" component="widget.component.fail"></div>'
//								,'</div>'].join('');
//					data.html = html;
					cash[data.id]['box'] = box.build(data);
				}				
				cash['ishow'] = data.id;
				return cash[data.id];
			},
			has: function(){
				return cash[data.id];
			},
			remove: function(id){
				if(cash[id]){
					$.custEvent.remove(cash[id]['layer'].getInner(),'bridge',insert);
					//防止第三方组件套错引起销毁异常组织控件的正常释放
					try{
						cash[id]['wbml'].destroy&&cash[id]['wbml'].destroy();
					}catch(e){}
					cash[id]['box'].destroy&&cash[id]['box'].destroy();
					cash[id]['layer'].destroy&&cash[id]['layer'].destroy();
					//
					var layerDom = cash[id]['layer'].getOuter();
					layerDom.parentNode.removeChild(layerDom)
					delete cash[id];
				}
			},
			build: function(data){
				var layer = $.ui.bubble({isHold:true});
				var nodes = $.builder(data.html);
				layer.setContent(nodes['box']);
				//
				cash[data.id]['layer']=layer;
				//获取沙箱壳
				var inner = layer.getInner();
				//启动WBML
				cash[data.id]['wbml']=$.widget.parse(inner);
				cash[data.id]['wbml'].init();
				//注册事件监听
				$.custEvent.define(inner,'bridge');
				$.custEvent.add(inner,'bridge',insert);
				return layer;
			},
			destroy: function(){
				for(var id in cash){
					box.remove(id);
				}
			}
		};
		//外抛函数
		it.layers = cash;
		it.add = box.add;
		it.remove = box.remove;
		it.destroy = box.destroy;
		return it;
	};
});