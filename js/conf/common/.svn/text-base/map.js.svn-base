$Import('module.layer');
/**
 * @author liusong@staff.sina.com.cn
 * 			Finrila | wangzheng4@staff.sina.com.cn
 */
STK.register('common.map', function($){
	var _jsPath = "http://js.t.sinajs.cn/t4/";
	
	if(false && typeof $CONFIG != "undefined" && $CONFIG['jsPath']) {
		_jsPath = $CONFIG['jsPath'];
	}
	
	var baseUrl = _jsPath + 'home/static/map/';
	var templete = '<div class="W_layer" node-type="outer" style="display:none;position:absolute;z-index:500">\
		  <div class="bg">\
				<table border="0" cellspacing="0" cellpadding="0">\
						<tr>\
							<td>\
								<div class="content">\
									<div node-type="inner" class="map_box">\
										<iframe node-type="iframe" frameborder="0" scrolling="no" src="about:blank;" style="width: 400px; height: 250px; border: 0pt none;" id="mini_map_panel"></iframe>\
									</div>\
									<a node-type="close" title="关闭" class="W_close" href="javascript:;"></a>\
								</div>\
							</td>\
						</tr>\
				</table>\
				<div node-type="arrow" class="arrow arrow_b" style="left:120px"></div>\
			</div>\
		</div>';
	
	var getIns = (function(){
		var ins;
		return function(){
			var _isShow = false;
			if(!ins){
				ins = $.module.layer(templete);
				var sup = $.core.obj.sup(ins,['show'])['show'];
				var close = ins.getDom("close"),
					outer = ins.getOuter(),
					ifm = ins.getDom("iframe");
				var closeFn = function(){
					ins.hide();
				};
				var setViewPos = function(node,outer){
						var sTop, pos;
						pos = $.position(node);
						pos.l = pos.l - 110;
						pos.t = Math.max(pos.t - 265, 0);
						sTop = $.core.util.scrollPos().top;
						outer.style.left = pos.l + "px";
						outer.style.top  = pos.t + "px";
						(sTop > pos.t)&&$.core.util.scrollTo(outer);
					};
				$.addEvent(close, 'click', closeFn);
				ins.refresh = function(){
					_isShow = false;
					return this;
				};
				ins.show = function(node, conf){
					if(!node){
						$.log('common.map : node is no defined');
						return;
					}
					if(_isShow){
						sup();
						return;
					}
					
					conf = $.parseParam({
						'longitude': '',
						'latitude': '',
						'head': '', 
						'internal': '',//1国外
						'addr': ''
					},conf);
					var type = conf.internal==0? 'g': 'm';
					
					ifm.onload = ifm.onreadystatechange = function(){
						if (!_isShow && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
							sup();
							ifm.onload = ifm.onreadystatechange = null;
							setViewPos(node,outer);
							_isShow = true;
						}
					};
					ifm.src = [baseUrl,type,'map.html?ver=',$CONFIG['version'],'&',$.jsonToQuery(conf)].join('')

				};
				document.body.appendChild(outer);
				ins.destroy = function() {
					$.removeEvent(close, 'click', closeFn);
					$.removeNode(outer);
					_isShow = false;
					return this;
				};
			}
			return ins
		}
	})();
	
	return getIns;
});