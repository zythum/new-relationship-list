/**
 * 魔法表情
 * @id STK.common.magic
 * @param {String} url
 * @example 
 * STK.common.magic("http://sinaurl.cn/bR45b");
 * STK.common.magic.hide();
 * STK.common.magic.destroy();
 */

$Import("kit.dom.fix");
$Import("module.mask");

STK.register("common.magic", function($) {
	
	var _$swf = $.core.util.swf;
	var _$mask = $.module.mask;
	
	var _flashDiv, _name, _showed, _fix, _clickFun, _clock;
	
	var _initDiv = function() {
		if(_flashDiv) return;
		_flashDiv = $.C("div");
		_flashDiv.style.cssText = "display:none;width:440px;height:360px;z-index:100000;";
		_name = $.core.dom.uniqueID(_flashDiv);
		_clickFun = function(event) {
			event = $.fixEvent(event || window.event);
			if(event.target.getAttribute("name") != _name) that.hide();
		}
		document.body.appendChild(_flashDiv);
	};
	var that = function(url, closeCall) {
		_initDiv();
		if(_showed) return;
		
		_showed = true;
		_$mask.showUnderNode(_flashDiv);
		$.addEvent(_$mask.getNode(), "click", _clickFun);
		_$mask.getNode().title = "点击关闭";
		_flashDiv.style.display = "";
		if (!_fix) {
			_fix = $.kit.dom.fix(_flashDiv, "c");
		} else {
			_fix.setAlign("c");
		}
		
		_flashDiv.innerHTML = _$swf.html(url, {id:_name, width: 440, height: 360, 
			paras: {
				allowScriptAccess: "never",
				wmode: "transparent"
			},
			attrs: {
				name: _name
			},
			flashvars: {
				playMovie: "true"
			}
		});
		
		clearInterval(_clock);
		
		_clock = setInterval(function(){
			var swf = document[_name] || window[_name], snap = 0;
			//监测动画加载百分比
			if(swf && swf.PercentLoaded()==100){
				//清除监测可用时钟
				clearInterval(_clock);
				//注册播放进度时钟
				_clock = setInterval(function(){
					//currentframe为当前动画贞
					var c = swf.CurrentFrame(), t;
					//对ie及其它浏览器区分获取总动画贞
					try {t = swf.TotalFrames()}catch(e){t = swf.TotalFrames}
					//如果c等于-1则说明还没准备好
					if( c<0 ){return}
					//如果当前贞小于总贞并且缓存的贞数不大于当前贞则重置缓存贞
					//由于时钟不可能过于频繁的监测所以需要一个缓存值来比对动画是否又循环播放了
					if( c<t && snap<=c ){
						snap = c;
					}
					//如果动画重新播放了或已经播放完成，则终止动画播放并且清除容器以便下一动画播放不会出现问题
					//这里不使用StopPlay()、GoToFrame()、Rewin()对动画进行控制这些指令需要动画配合domain，无法要求所有动画加入该设置
					else{
						that.hide();
					}
				},80);
			}
			
		},100);
	};
	/**
	 * 隐藏表情
	 * @method hide
	 * @return {Object} this
	 */
	that.hide = function() {
		if(_flashDiv) {
			_flashDiv.style.display = "none";
			_flashDiv.innerHTML = "";
		}
		clearInterval(_clock);
		$.removeEvent(_$mask.getNode(), "click", _clickFun);
		_$mask.getNode().title = "";
		_$mask.back();
		_showed = false;
		return that;
	};
	/**
	 * 销毁表情
	 * @method destroy
	 */
	that.destroy = function() {
		that.hide();
		_fix && _fix.destroy();
		$.removeNode(_flashDiv);
		_clock =_flashDiv = _name = _showed = _fix = _clickFun;
	};
	
	return that;
	
});
