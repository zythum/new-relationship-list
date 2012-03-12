/**
 * 颜色选择器
 * @author 非反革命|zhaobo@staff.sina.com.cn
 * @example
 */
$import("kit.extra.swfobject");
$import("common.skin.colorPickerCallBack");
$import("common.skin.provColorPicker");

STK.register("common.skin.colorBox", function($) {
	//---常量定义区----------------------------------


	//-------------------------------------------
	var _picker_container, _picker;
	return function(dom, callBack) {
		var that = {};
		this.self = this;
		var _call = callBack;
		var opened = false;
		var opener;
		var swfObj;
		var _box = dom;
		var parseDOM = function() {
			_picker_container = $.C("div");
			_picker_container.id = 'picker_container';
			_picker = $.C("div");
			_picker_container.appendChild(_picker);
			_picker.id = "color_picker";
			//_picker_container.style.opacity = 0;
			_picker_container.style.position = "absolute";
			_picker_container.style.display = "none";
			_picker_container.style.zIndex = "10002";
			_picker_container.style.backgroundColor = '#fff';
			document.body.appendChild(_picker_container);
			embedSWF();
			$.log(_picker_container);
		};
		var embedSWF = function(_c, _who){
			_picker_container.innerHTML = "";
			var _flashParams = {
				quality: "high",
				allowScriptAccess: "always",
				wmode: "Opaque",
				allowFullscreen: true
			};
			var _flashVars = {
				callback: _call,
				color : _c ? _c : "#ffffff",
				who : _who ? _who : ''
			};
			swfObj = $.core.util.swf.create(_picker_container, $CONFIG['jsPath'] + 'home/static/swf/ColorPicker.swf', {
				width: 251,
				height:264,
				paras : _flashParams,
				flashvars : _flashVars
			});
            /*swfObj.setAttribute('flashObj', _ran);
            swfObj.flashObj = _ran;*/
//			$.kit.extra.swfobject.embedSWF($CONFIG['jsPath'] + "home/static/swf/ColorPicker.swf", "color_picker", "251", "264", "9.0.0", "#ffffff", _flashVars, _flashParams);
		};
		var colorPicker = function(_pos, _c, _cb/*string*/, _who) { //生成选择器
			embedSWF(_c, _who);
			_picker_container.style.left = _pos[0] + "px";
			_picker_container.style.top = _pos[1] - 264 + "px";
			_picker_container.style.display = "";
			opened = true;
		};
		var showColorPicker = function(pos, _col, who, op) { //显示颜色选择器
			opener = op;
			/*if (!_picker_container) {
				init();
			}*/
			setTimeout(function(){
				if(opened) return;
				colorPicker(pos, _col, _call, who);
			}, 10);

		};
		var hideColorPicker = function() { //隐藏颜色选择器
			_picker_container.style.display = "none";
			opened = false;
		};

		var setControlArea = function(dom){
			_box = dom;
		};

		var bindCustEvtFuns = {
			settingCustColor : function(colorHex, colorStyle){
				$.log("setting:", colorHex, colorStyle);
				hideColorPicker();
			}
		};
		var bindDomFuns = {
			bodyClick : function(event){
				if(!opened) return;
				event = $.fixEvent(event);
				//$.log("bodyClick:", _picker_container, event.target, _box, $.contains(_box, event.target));
				if(!$.contains(_picker_container, event.target) && event.target!=opener) {
					$.log("hide");
					hideColorPicker();
				}
			}
		};
		var bindListener = function() {
			$.common.channel.colorPick.register("setting", bindCustEvtFuns.settingCustColor);
		};
		var bindDom = function(){
			$.addEvent(document, "click", bindDomFuns.bodyClick);
		};
		var init = function() {
			parseDOM();
			bindDom();
			bindListener();
		};
		init();
		var destroy = function(){
			$.removeEvent(document, "click", bindDomFuns.bodyClick);
		};
		that.show = showColorPicker;
		that.hide = hideColorPicker;
		that.setControlArea = setControlArea;
		that.destroy = destroy;
		//-------------------------------------------
		return that;
	};
});
