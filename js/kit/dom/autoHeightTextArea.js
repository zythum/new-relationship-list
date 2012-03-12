/**
 * 将文本域节点变为高度自动变高的textarea元素
 * @author liusong | liusong@staff.sina.com.cn
 * @example :
 * <textarea id="text"/>
 * var textarea = STK.E('text');
 * STK.kit.dom.autoHeightTextArea({
 * 		'textArea': textarea,
 * 		'maxHeight': 100,
 * 		'inputListener': function(){STK.log('--autoHeightTextArea--');}
 * });
 */
$Import('common.channel.at');
STK.register('kit.dom.autoHeightTextArea', function($) {
	var getTextAreaHeight = function(el) {
		var getStyle = $.core.dom.getStyle, snapHeight;
		//获取传入对像的默认高度
		if (!el.defaultHeight) {
			el.defaultHeight = parseInt(getStyle(el, "height"),10) || parseInt(el.offsetHeight,10) || 20;
		}
		//如果是ie则直接通过scrollHeight来获取高度
		if ($.core.util.browser.IE) {
			snapHeight = Math.max(el.scrollHeight, el.defaultHeight);
		}  //如果不是ie则需要先创建一个对像的副本
		else {
			var textArea = $.E("_____textarea_____");
			if (!textArea) {
				textArea = $.C("textarea");
				textArea.id = "_____textarea_____";
				document.body.appendChild(textArea);
			}
			//如果传入对像改变了，则需要重新对副本的样式进行设置
			if (textArea.currentTarget != el) {
				var cssText = [];
				cssText.push('width:' + getStyle(el, "width"));
				cssText.push('font-size:' + getStyle(el, "fontSize"));
				cssText.push('font-family:' + getStyle(el, "fontFamily"));
				cssText.push('line-height:' + getStyle(el, "lineHeight"));
				cssText.push('padding-left:' + getStyle(el, "paddingLeft"));
				cssText.push('padding-right:' + getStyle(el, "paddingRight"));
				cssText.push('padding-top:' + getStyle(el, "paddingTop"));
				cssText.push('padding-bottom:' + getStyle(el, "paddingBottom"));
				cssText.push('top:-1000px');
				cssText.push('height:0px');
				cssText.push('position:absolute');
				cssText.push('overflow:hidden');
				cssText.push('');
				cssText = cssText.join(';');
				textArea.style.cssText = cssText;
			}
			textArea.value = el.value;
			snapHeight = Math.max(textArea.scrollHeight, el.defaultHeight);
			textArea.currentTarget = el;
		}
		return snapHeight;
	};
	return function(spec) {
		var textArea		= spec.textArea, 
			maxHeight		= spec.maxHeight, 
			inputListener	= spec.inputListener, 
			textStyle		= textArea.style,
			listener;
		//当用户输入时，改变TextArea对像高度
		(listener = function() {
			(typeof inputListener === 'function') && inputListener();
            setTimeout(function(){
			var nSnapHeight = getTextAreaHeight(textArea),
				viewHeight;
			maxHeight = maxHeight || nSnapHeight;
			//如果内容高度大于最大高度，则显示最大高度，并显示滚动条
			var temp = nSnapHeight > maxHeight;
			viewHeight = temp ? maxHeight : nSnapHeight;
			textStyle.overflowY = temp ? 'auto' : 'hidden';
			textStyle.height = Math.min(maxHeight, nSnapHeight) + "px";},0);
		})()
		if(!$.core.util.browser.IE){
			try{
			$.common.channel.at.register("open",function(){
			$.E("_____textarea_____").style.cssText=getCssText(textArea);
		});
		}
		catch(ex){
			$.log(ex);
		}
		}
		
		//对TextArea进行事件绑定
		if ( !textArea.binded ) {
			$.addEvent(textArea, 'keyup', listener);
			$.addEvent(textArea, 'focus', listener);
			$.addEvent(textArea, 'blur', listener);
			textArea.binded = true;
			textArea.style.overflow = 'hidden';
		}
		function getCssText(el){
			var getStyle = $.core.dom.getStyle, snapHeight;
			var cssText = [];
				cssText.push('width:' + getStyle(el, "width"));
				cssText.push('font-size:' + getStyle(el, "fontSize"));
				cssText.push('font-family:' + getStyle(el, "fontFamily"));
				cssText.push('line-height:' + getStyle(el, "lineHeight"));
				cssText.push('padding-left:' + getStyle(el, "paddingLeft"));
				cssText.push('padding-right:' + getStyle(el, "paddingRight"));
				cssText.push('padding-top:' + getStyle(el, "paddingTop"));
				cssText.push('padding-bottom:' + getStyle(el, "paddingBottom"));
				cssText.push('top:-1000px');
				cssText.push('height:0px');
				cssText.push('position:absolute');
				cssText.push('overflow:hidden');
				cssText.push('');
				cssText = cssText.join(';');
				return cssText;
		}
	}
});