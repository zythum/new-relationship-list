/**
 * 添加分组面板
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 */
$Import('kit.dom.parseDOM');
$Import('kit.extra.language');
STK.register("common.group.addGroupPanel", function($){
	var imgSrc = $CONFIG['imgPath'];
	var template = 
		'<#et addGroup data>'+
			'<div node-type="addGroupPanel" class="form_table lsfl_edit_list">'+
				'<dl class="clearfix">'+
					'<dt>#L{浏览权限：}</dt>'+
					'<dd class="conbox">'+
						'<p><label class="cholab" for="${data.ukey}_private">'+
							'<input node-type="mode" <#if (data.mode=="private")>checked</#if> name="mode" value="private" type="radio" id="${data.ukey}_private" class="W_radio">'+
							'<img src="'+imgSrc+'style/images/common/transparent.gif" alt="" class="i_conn_private">#L{仅自己可见}'+
						'</label></p>'+
						'<p><label class="cholab" for="${data.ukey}_friend">'+
							'<input node-type="mode" name="mode" value="friend" type="radio" id="${data.ukey}_friend" class="W_radio">'+
							'<img src="'+imgSrc+'style/images/common/transparent.gif" alt="" class="i_conn_friend">#L{相互关注的人可见}'+
						'</label></p>'+
						'<p><label class="cholab" for="${data.ukey}_public">'+
							'<input node-type="mode" <#if (data.mode=="public")>checked</#if> name="mode" value="public" type="radio" id="${data.ukey}_public" class="W_radio">'+
							'<img src="'+imgSrc+'style/images/common/transparent.gif" alt="" class="i_conn_public">#L{所有人可见}'+
						'</label></p>'+
					'</dd>'+
				'</dl>'+
				'<dl class="clearfix">'+
					'<dt><span class="must CH W_spetxt">*</span>#L{分组名：}</dt>'+
					'<dd class="conbox">'+
						'<input watermark="#L{请输入分组名称，最多8个字}" value="#L{请输入分组名称，最多8个字}" node-type="name" name="name" type="text" class="W_inputStp">'+
						'<div style="display:none;" node-type="err_name" class="M_notice_del clearfix"></div>'+
					'</dd>'+
				'</dl>'+
				'<dl class="clearfix">'+
					'<dt>#L{分组描述：}</dt>'+
					'<dd class="conbox">'+
						'<textarea watermark="#L{请输入分组描述，最多70个字}"" node-type="desc" name="desc" class="W_inputStp list_desc" rows="" cols="">#L{请输入分组描述，最多70个字}</textarea>'+
						'<div style="display:none;" node-type="err_desc" class="M_notice_del clearfix"></div>'+
					'</dd>'+
				'</dl>'+
				'<dl class="clearfix">'+
					'<dt>#L{标签：}</dt>'+
					'<dd class="conbox">'+
						'<input watermark="#L{每个标签最多7个汉字，以空格或逗号间隔}" value="#L{每个标签最多7个汉字，以空格或逗号间隔}" node-type="tags" name="tags" type="text" class="W_inputStp">'+
						'<div style="display:none;" node-type="err_tags" class="M_notice_del clearfix"></div>'+
					'</dd>'+
				'</dl>'+
			'</div>'+
		'</#et>';
		
	var err = '<span class="icon_del"></span><span class="txt">{errMsg}</span>';
	
	var $L = $.kit.extra.language;
	return function(spec){
		spec = spec || {};
		var that = {},
			ukey = $.getUniqueKey(),
			data = spec['data'] || {},
			mode = spec['mode'] || "private",
			temp = spec['template'] || template,
			eTemp = $.core.util.easyTemplate($L(temp)),
			build = $.core.dom.builder(eTemp({'ukey': ukey,'mode':mode}).toString()),
			nodes = $.kit.dom.parseDOM(build.list),
			checkList = spec['checkList'] || {
				'name': function(str){
					var val = $.trim(str),
						len = $.bLength(val)
					if(!len){
						return $L('#L{请输入分组名称}');
					}else if (len > 16) {
						return $L('#L{请输入1～16个字符}');
					}
				},
				'tags': function(str){
					var val = $.trim(str),
						msg = $L('#L{每个标签最多7个汉字，以“空格”，“逗号”或“分号”间隔，最多填写10个}');
					val = val.split(/[、|\s|，|,|;|；]+/ig);
					if(val.length < 11){
						for (var i = val.length; i--;) {
							if ($.bLength(val[i]) > 14) {
								return msg;
							}
						}
					} else {
						return msg;
					}
				}
			};
		
		var errTips = {
			'show': function(msg, type){
				var el = nodes['err_'+type];
				if(!el){ return; }
				el.innerHTML = err.replace(/\{errMsg\}/i, msg);
				el.style.display = '';
			},
			
			'hide': function(type){
				var el = nodes['err_'+type];
				if(!el){ return; }
				el.style.display = 'none';
			}
		};
		
		var bindDOMFunc = {
			'blur': function(e){
				var el		= $.fixEvent(e).target,
					type	= el.getAttribute('node-type'),
					val		= el.value,
					check	= checkList[type],
					waterM	= el.getAttribute('watermark');
					errMsg	= typeof check === 'function' ? check(val) : '';
				if(!$.trim(val)){
					el.value = waterM;
				}
				errMsg && errTips.show(errMsg, type);
			},
			
			'focus': function(e){
				var el		= $.fixEvent(e).target,
					type	= el.getAttribute('node-type'),
					waterM	= el.getAttribute('watermark');
				if($.trim(el.value) === waterM){
					el.value = '';
				}
				errTips.hide(type);
			},
			
			'descKeyup': function(e){
				if ($.bLength(nodes['desc'].value) > 140) {
					nodes['desc'].value = $.leftB(nodes['desc'].value, 140);
				}
			},
			
			'nameKeyup': function(e){
				if ($.bLength(nodes['name'].value) > 16) {
					nodes['name'].value = $.leftB(nodes['name'].value, 16);
				}
			}
		};
		
		$.addEvent(nodes['name'], 'blur', bindDOMFunc['blur']);
		$.addEvent(nodes['desc'], 'blur', bindDOMFunc['blur']);
		$.addEvent(nodes['tags'], 'blur', bindDOMFunc['blur']);
		$.addEvent(nodes['name'], 'focus', bindDOMFunc['focus']);
		$.addEvent(nodes['desc'], 'focus', bindDOMFunc['focus']);
		$.addEvent(nodes['tags'], 'focus', bindDOMFunc['focus']);
		$.addEvent(nodes['desc'], 'keyup', bindDOMFunc['descKeyup']);
		$.addEvent(nodes['name'], 'keyup', bindDOMFunc['nameKeyup']);
		
		var getOuter = function(){
			return nodes['addGroupPanel'];
		};
		
		var parseData = function(data){
			var el, waterM;
			for (var i in data) {
				el = nodes[i];
				if (!$.isArray(el)) {
					waterM = el.getAttribute('watermark');
					if ($.trim(data[i]) === waterM) {
						data[i] = '';
					}
					if(i === 'tags'){
						data[i] = data[i].replace(/[、|\s|，|,|;|；]+/ig, ',');
					}
				}
			}
			return data;
		};
		
		var parseValue = function(el){
			var val = $.trim(el.value),
				waterM = el.getAttribute('watermark');
			if(val === waterM){
				val = '';
			}
			return val;
		};
		
		var getData = function(){
			var success = true;
			for(var i in checkList){
				var errMsg = checkList[i](parseValue(nodes[i]));
				if(errMsg){
					success = false;
					errTips.show(errMsg, i);
					break;
				}
			}
			return success ? parseData($.htmlToJson(nodes['addGroupPanel'])) : false;
		};
		
		var setData = function(d){
			for(var i in d){
				var item = nodes[i];
				if ($.isArray(nodes[i])) {
					for (var j = item.length; j--;) {
						if (item[j].value === d[i]) {
							item[j].checked = true;
						}
					}
				} else {
					var value = $.isArray(d[i]) ? d[i].join(' ') : d[i];
					nodes[i]&& (nodes[i].value = $.decodeHTML(value));
				}
			}
			data = d;
		};
		
		var reset = function(){
			setData(data);
		};
		
		var destroy = function(){
			$.removeEvent(nodes['name'], 'blur', bindDOMFunc['blur']);
			$.removeEvent(nodes['desc'], 'blur', bindDOMFunc['blur']);
			$.removeEvent(nodes['tags'], 'blur', bindDOMFunc['blur']);
			$.removeEvent(nodes['name'], 'focus', bindDOMFunc['focus']);
			$.removeEvent(nodes['desc'], 'focus', bindDOMFunc['focus']);
			$.removeEvent(nodes['tags'], 'focus', bindDOMFunc['focus']);
			$.removeEvent(nodes['desc'], 'keyup', bindDOMFunc['descKeyup']);
			$.removeEvent(nodes['name'], 'keyup', bindDOMFunc['nameKeyup']);
			bindDOMFunc = null;
			nodes = null;
		};
		
		setData(data);
		
		that.reset = reset;
		that.getOuter = getOuter;
		that.setData = setData;
		that.destroy = destroy;
		that.getData = getData;
		
		return that;
	};
});