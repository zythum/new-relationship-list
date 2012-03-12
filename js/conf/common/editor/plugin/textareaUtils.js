/**
 * 对于Textarea的处理方法
 * @fileoverview
 *  App.TextAreaUtils.selectionStart 获取指定Textarea的光标位置
 *  App.TextAreaUtils.selectText     选择指定有开始和结束位置的文本
 *  App.TextAreaUtils.insertText     在起始位置插入或替换文本	
* @author liusong@staff.sina.com.cn
* Change NameSpace 112210 wukan@staff.sina.com.cn
 */
STK.register('common.editor.plugin.textareaUtils',function($){
	
	var it = {}, ds=document.selection;
	/**
	* 获取指定Textarea的光标位置
	* @param {HTMLElement} oElement 必选参数，Textarea对像
	*/
	it.selectionStart = function( oElement ){
		if(!ds){return oElement.selectionStart}
		var er = ds.createRange(), value, len, s=0;
		var er1 = document.body.createTextRange();
		er1.moveToElementText(oElement);
		for(s; er1.compareEndPoints("StartToStart", er)<0; s++){
			er1.moveStart('character', 1);
		}
		return s;
	};
	it.selectionBefore = function( oElement ){
		return oElement.value.slice(0,it.selectionStart(oElement));
	};
	/**
	* 选择指定有开始和结束位置的文本
	* @param {HTMLElement} oElement 必选参数，Textarea对像
	* @param {Number}      iStart   必选参数, 起始位置
	* @param {Number}      iEnd     必选参数，结束位置
	*/
	it.selectText = function( oElement, nStart, nEnd) {
		oElement.focus();
		if (!ds){oElement.setSelectionRange(nStart, nEnd);return}
		var c = oElement.createTextRange();
		c.collapse(1);
		c.moveStart("character", nStart);
		c.moveEnd("character", nEnd - nStart);
		c.select();
	};
	/**
	* 在起始位置插入或替换文本
	* @param {HTMLElement} oElement    必选参数，Textarea对像
	* @param {String}      sInsertText 必选参数，插入的文本
	* @param {Number}      iStart      必选参数，插入位置
	* @param {Number}      iLength     非必选参数，替换长度 
	*/
	it.insertText = function( oElement, sInsertText, nStart, nLen){
		oElement.focus();nLen = nLen||0;
		if(!ds){
			var text = oElement.value, start = nStart - nLen, end = start + sInsertText.length;
			oElement.value = text.slice(0,start) + sInsertText + text.slice(nStart, text.length);
			it.selectText(oElement, end, end);return
		}
		
		var c = ds.createRange();
		//$.log('textutils ',nLen,nStart,c.text);
		c.moveStart("character", -nLen);
		c.text = sInsertText
	};
	/**
	* 替换文本
	* @param {HTMLElement} oElement    必选参数，Textarea对像
	* @param {String}      sInsertText 必选参数，插入的文本
	* 如果没有选择文本，则在最后插入
	*/
	it.replaceText = function(oElement, sInsertText){
		oElement.focus();
		var text = oElement.value;
		var selectedText = it.getSelectedText(oElement);
		var dl = selectedText.length;
		if(selectedText.length==0){
			it.insertText(oElement,sInsertText,it.getCursorPos(oElement));
		}else{
			var start = it.getCursorPos(oElement);
			if(ds){
				var c = ds.createRange();
				//$.log('c.text = ',c.text);
				c.text = sInsertText;
				it.setCursor(oElement,start+sInsertText.length);
				//c.moveStart("character", sInsertText.length);
			}else{
				var end = start+selectedText.length;
				oElement.value = text.slice(0,start) + sInsertText + text.slice(start+dl, text.length);
				it.setCursor(oElement, start+sInsertText.length);return;
			}
		}
	};
	/**
	* @param {object} 文本对象
	*/
	it.getCursorPos = function(obj){
		var CaretPos = 0; 
		if (STK.core.util.browser.IE) {   
			obj.focus();
			var range = null;
			range = ds.createRange();
			var stored_range = range.duplicate();
			stored_range.moveToElementText( obj );
			stored_range.setEndPoint('EndToEnd', range );
			obj.selectionStart = stored_range.text.length - range.text.length;
			obj.selectionEnd = obj.selectionStart + range.text.length;
			CaretPos = obj.selectionStart;
		}else if (obj.selectionStart || obj.selectionStart =='0'){
			CaretPos = obj.selectionStart; 
		}
		return CaretPos; 
	};
	/**
	* @param {object} 文本对象
	*/
	it.getSelectedText = function(obj){
		var selectedText = '';
		var getSelection = function (e){
			if (e.selectionStart != undefined && e.selectionEnd != undefined) 
				return e.value.substring(e.selectionStart, e.selectionEnd);
			else 
				return '';
			};
			if (window.getSelection){
				selectedText = getSelection(obj);
			}else {
				selectedText = ds.createRange().text;
			}
			return selectedText;
	};
	/**
	* @param {object} 文本对象
	* @param {int} pars.rcs Range cur start
	* @param {int} pars.rccl  Range cur cover length
	* 用法
	* setCursor(obj) cursor在文本最后
	* setCursor(obj,5)第五个文字的后面
	* setCursor(obj,5,2)选中第五个之后2个文本
	*/
	it.setCursor = function(obj,pos,coverlen){
		pos = pos == null ? obj.value.length : pos;
		coverlen = coverlen == null ? 0 : coverlen;
		obj.focus();
		if(obj.createTextRange) { //hack ie
			var range = obj.createTextRange(); 
			range.move('character', pos);
			range.moveEnd("character", coverlen);
			range.select(); 
		} else {
			obj.setSelectionRange(pos, pos+coverlen); 
		}
	};
	/**
	* @param {object} 文本对象
	* @param {Json} 插入文本
	* @param {Json} pars 扩展json参数
	* @param {int} pars.rcs Range cur start
	* @param {int} pars.rccl  Range cur cover length
	* 
	*/
	it.unCoverInsertText = function(obj,str,pars){
		pars = (pars == null)? {} : pars ;
		pars.rcs = pars.rcs == null ? obj.value.length : pars.rcs*1;
		pars.rccl = pars.rccl == null ? 0 : pars.rccl*1;
		var text = obj.value,
		fstr = text.slice(0,pars.rcs),
		lstr = text.slice(pars.rcs + pars.rccl,text== ''?0:text.length);

		obj.value = fstr + str + lstr;
		this.setCursor(obj,pars.rcs+(str==null?0:str.length));
	}
	return it;
});


