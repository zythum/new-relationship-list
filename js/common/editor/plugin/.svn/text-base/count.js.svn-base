STK.register('common.editor.plugin.count',function($){

	var limit;
	function getLength(str){
		//surl为http://t.cn/12345678
		var min = 41,max = 140,surl = 20,tmp = str;
		var urls = str.match(/(http|https):\/\/[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+([-A-Z0-9a-z_\$\.\+\!\*\(\)\/\,\:;@&=\?~#%]*)*/gi) || [];
		var urlCount = 0;
		for (var i = 0,len = urls.length; i < len; i++) {
			var count = $.core.str.bLength(urls[i]);
			if (/^(http:\/\/t.cn)/.test(urls[i])) {
				continue;
			} else {
				if (/^(http:\/\/)+(t.sina.com.cn|t.sina.cn)/.test(urls[i]) || /^(http:\/\/)+(weibo.com|weibo.cn)/.test(urls[i])) {
					urlCount += count <= min ? count : (count <= max ? surl : (count - max + surl));
				} else {
					urlCount += count <= max ? surl : (count - max + surl);
					//$.log('外域链接：',urls[i],count,urlCount);
				}
			}
			tmp = tmp.replace(urls[i], "");
		}
		var result = Math.ceil((urlCount + $.core.str.bLength(tmp)) / 2);
		return result;
	};

	function countWord(str){

		var num = getLength(str);
		var onum = Math.abs(limit - num);

		var result;
		if(num > limit || num <1){
			result = {
				wordsnum : num,
				vnum : onum,
				overflow : true 
			};
		}else if(num == 0){
			result = {
				wordsnum : num,
				vnum : onum,
				overflow : true 
			};
		}else{
			result = {
				wordsnum : num,
				vnum : onum,
				overflow : false
			};
		}
		return result;
	};
	function checker(nodeList,editor){
		if(!nodeList.textEl){
			throw '[editor plugin count]: plz check nodeList';
		}
	}

	return function(editor){
		var nodeList = editor.nodeList;
		var clock;
		var opts = editor.opts;
		var $L = $.kit.extra.language;
		limit = opts.limitNum;
		checker(nodeList);

		$.core.evt.custEvent.define(editor,'textNum');
		$.custEvent.define(editor,'keyUpCount');
		var textE = nodeList.textEl;
		var wordNum = nodeList.num;


		//$.log('load count plugin, bind key up function in editor');
		$.addEvent(textE,'focus',function(){
			clock = setInterval(function(){keyUpCount();},200);
		});
		$.addEvent(textE,'blur',function(){
			clearInterval(clock);
		});

		var keyUpCount = function(){
			var str = ($.core.str.trim(textE.value).length == 0)?$.core.str.trim(textE.value):textE.value;
             var extendText  = editor && editor.opts &&  editor.opts.extendText;

			//过滤回车，firefox回车算1字符\n，IE算俩\n\r
			str = str.replace(/\r\n/g,'\n');			
			var count = countWord(str,opts.limitNum);
			if (str.length >= 0 && textE.focus) {
				if (count.overflow && count.wordsnum != 0) {
					wordNum.innerHTML =(extendText ? $L(extendText) : "") + $L('#L{已经超过}')+'<span class="W_error">' + count.vnum + '</span>字';
				}else{
					//var texta = $L('#L{还可以输入}<span>' + count.vnum + '</span> #L{字}');
					//wordNum.innerHTML = texta;
					//wordNum.innerHTML = '还可以输入<span>' + count.vnum + '</span> 字';
					wordNum.innerHTML = (extendText ? $L(extendText) : "") + $L('#L{还可以输入}') + '<span>' + count.vnum + '</span>字';
				}
			}else if(str.length === 0){
				wordNum.innerHTML = (extendText ? $L(extendText) : "") + $L('#L{还可以输入}') + '<span>' + count.vnum + '</span>字';
			}
			//$.log(editor);
			$.core.evt.custEvent.fire(editor,'textNum',{'count':count.wordsnum,'isOver':count.overflow});
			//$.log('[editor plugin count]: fire textNum ok');


		};

		STK.core.evt.addEvent(textE, 'keyup', keyUpCount);
		$.custEvent.add(editor,'keyUpCount',keyUpCount);
	};
});
