/**
 * 分组列表面板
 * ChenJian | chenjian2@staff.sina.com.cn
 * 		spec = {
 * 			multi:true/false 多个
 * 			data:[{mode:self|friend|common,gid,gname,belong,desc}]
 * 		}
 * {gid,gname,module:{self,friend,common},gdesc,gtag:"wdqw wqdq qw qw"}
 * {user:[{uid:213132,desc:'asdad'}],group:[{gid:"345354",desc:"我的家物,品等级"},{}]}
 */
$Import('kit.dom.parseDOM');
$Import('kit.extra.language');
STK.register("common.group.groupListPanel", function($){
	var pubG = window.$CONFIG['is_internal_user_publicgroup'];
	return function(spec){
		// 开放部分用户，完全开放后删除 START
		if(!pubG){
			spec.multi = true;
		}
		// 开放部分用户，完全开放后删除 END
		var that	= {};
		var $L = $.kit.extra.language;
		var outer = $.C("div"),dataPool = {},checkedList = {},nodes;
		var dEvent	= $.delegatedEvent(outer);
		var imgSrc = $CONFIG['imgPath']+'style/images/common/transparent.gif';
        var category = [{
            'mode': 'private',
            'className': 'i_conn_private',
            'title': $L("#L{仅自己可见}")
        }, {
            'mode': 'friend',
            'className': 'i_conn_friend',
            'title': $L("#L{相互关注可见}")
        }, {
            'mode': 'public',
            'className': 'i_conn_public',
            'title': $L("#L{所有人可见}")
        }];
		var getElement = function(el, type, tagName){
			if(!el) return;
	        if (tagName) {
	            tagName = tagName.toUpperCase();
	        }
	        var node = el[type];
	        while (node) {
	            if (node.nodeType == 1 && (tagName ? node.nodeName == tagName : true)) {
	                break;
	            }
	            node = node[type];
	        }
	        return node;
	    };
		var multistyle = spec.multi ? 'style="display:none;"' : '<#if (item.belong==1)><#else>style="display:none;"</#if>';	
		
		// 开放部分用户，完全开放后改回 START
		var innerTemple = pubG 
			? '<h4 class="lsfl_visibility"><img class="#{className}" alt="" src="'+imgSrc+'">#{title}</h4><div class="lsfl_listsBox"><ul node-type="#{mode}" class="lsfl_listsBox_ul"></ul></div>'
			: '<h4 style="display:none;" class="lsfl_visibility"><img class="#{className}" alt="" src="'+imgSrc+'">#{title}</h4><div class="lsfl_listsBox"><ul node-type="#{mode}" class="lsfl_listsBox_ul"></ul></div>';
		// 开放部分用户，完全开放后改回 END
		
		var itemTemple = $.core.util.easyTemplate(
			'<#et listItem gList>'+
				'<#list gList as item>'+
					'<li>'+
						'<label for="${item.gid}">'+
						'<input action-type="select" id="${item.gid}" type="checkbox" <#if (item.belong==1)>checked="checked"</#if> class="W_checkbox" value="${item.gid}">${item.gname}</label>'+
						(pubG 
						? '<a title="'+ $L('#L{为此分组成员添加说明}') +'" action-type="icon" '+multistyle+' class="icon_edit_s" href="javascript:;"></a>'
						: '')+
						'<div <#if (item.desc)><#else>style="display:none;"</#if> class="lists_info">'+
						'<input action-type="input" style="display:none" type="text" class="W_input">'+
						'<#if (item.desc)>'+
							'<a action-type="text" class="done" href="javascript:;">${item.desc}</a>'+
						'<#else>'+
							'<a action-type="text" style="display:none" class="done" href="javascript:;"></a>'+
						'</#if>'+
						'<div node-type="error" style="display:none" class="M_notice_del"><span class="icon_del"></span>'+$L('#L{备注姓名是非法的}')+'</div>'+
						'</div>'+
					'</li>'+
				'</#list>'+
			'</#et>');
       
	    var encodeHTML = function(str){
            var tNode = document.createTextNode(str);
            var div = $.C('div');
            div.appendChild(tNode);
            var result = div.innerHTML;
            div = tNode = null;
            return result;
        };
		var render = function(){
			var html = "";
			for(var i=0;i< category.length;i++){
				html += $.templet(innerTemple, category[i]);
			}
			outer.innerHTML = html;
			nodes = $.kit.dom.parseDOM($.core.dom.builder(outer).list);
			if(spec.data){
				setData(spec.data);
			}
		};
		
		var renderData = function(){
			for(var i=0;i< category.length;i++){
				var mode = category[i].mode;
				if(dataPool[mode]){
					for(var j=dataPool[mode].length;j--;){
//						dataPool[mode][j].gname = encodeHTML(dataPool[mode][j].gname);
						if (dataPool[mode][j].desc) {
							dataPool[mode][j].desc = dataPool[mode][j].desc;
						}
					}
					var html = itemTemple(dataPool[mode]).toString();
					nodes[mode].innerHTML = html;
				}else{
					checkHeader(nodes[mode],true);
				}
				
			}
		};	
		
		lengthLimit = function(e){
			var input = $.fixEvent(e).target;
			if($.bLength(input.value) > 16){
				input.value = $.leftB(input.value, 16);
			}
		};
		
		onEnter = function(e){
			if(e.keyCode === 13){
				var input = $.fixEvent(e).target;
				$.fireEvent(input,'blur');
			}
		};
		
		var displayDesc = function(el,isOpen){
			var desc;
			var group = checkGroup(el);
			if(!group) return;
			if(isOpen){
				group.parent.style.display = "";
				group.input.style.display = "";
				group.text.style.display = "none";
				group.icon.style.display = "none";
				desc = $.decodeHTML(group.text.innerHTML);
				if(desc){
					group.input.value = desc;
				}else{
					group.input.value = "";
				}
				group.input.select();
				$.addEvent(group.input,"blur",delegatedEvent['descInputBlur']);
				$.addEvent(group.input, 'keyup', lengthLimit);
				$.addEvent(group.input, 'keypress', onEnter);
			}else{
				desc = $.trim(group.input.value);
				if(desc){
					group.text.innerHTML = encodeHTML(desc);
					group.input.style.display = "none";
					group.text.style.display = "";
					group.icon.style.display = "";
					group.error.style.display = "none";
				}else{
					group.text.innerHTML = "";
					group.icon.style.display = "";
					group.parent.style.display = "none";
					group.text.style.display = "none";
				}
				$.removeEvent(group.input,"blur",delegatedEvent['descInputBlur']);
				$.removeEvent(group.input, 'keyup', lengthLimit);
				$.removeEvent(group.input, 'keypress', onEnter);
			}
			
		};
		var checkGroup = function(el){
			var parentNode = getElement(el,'parentNode','li');
			if(!parentNode) return;
			var checkNode = $.sizzle('input[action-type="select"]',parentNode)[0];
			if(!checkedList[checkNode.id]){
				checkedList[checkNode.id] = {};
				var group = checkedList[checkNode.id];
				group.icon = $.sizzle('a[action-type="icon"]',parentNode)[0];
				group.input = $.sizzle('input[action-type="input"]',parentNode)[0];
				group.text = $.sizzle('a[action-type="text"]',parentNode)[0];
				group.error = $.sizzle('div[node-type="error"]',parentNode)[0];
				group.parent = group.input.parentNode;
			}
			return checkedList[checkNode.id];
		};
		var hideInfo = function(obj){
			for(i in obj){
				if($.isNode(obj[i])){
					obj[i].style.display = "none";
				}
			}
		};
		var displayIcon = function(el,isShow){
			var group = checkGroup(el);
			if(!group) return;
			if(isShow){
				if(!spec.multi){
					group.icon.style.display = "";
				}
			}else{
				hideInfo(group);
			}	
		}
			
		var delegatedEvent = {
			editDesc:function(spec){
				displayDesc(spec.el,true);
			},
			select:function(spec){
				if (!spec.multi) {
					displayIcon(spec.el, spec.el.checked);
				}
			},
			descInputBlur: function(e){
				var el = $.fixEvent(e).target;
				displayDesc(el,false);	
			}
		};
		
		var bindDOM = function() {
			dEvent.add('icon' , 'click' , delegatedEvent['editDesc']);
			dEvent.add('text' , 'click' , delegatedEvent['editDesc']);
			dEvent.add('select' , 'click' , delegatedEvent['select']);
		};
		
		var initPlugins = function(){
		};
		
		var init = function(){
			render();
			bindDOM();
			initPlugins();
		};
		var checkHeader = function(node,hide){
			if (pubG) {
				var header = $.domPrev(node.parentNode);
				if (header.style.display === (hide ? '' : "none")) {
					header.style.display = (hide ? "none" : '');
					node.parentNode.style.display = (hide ? "none" : '');
				}
			}
		};
		var getOuter = function(){
			return outer;
		};
		var add = function(obj){
			var mode = obj.mode || "private";
			dataPool[mode] = dataPool[mode] || [];
			dataPool[mode].push(obj);
			var html = itemTemple([obj]).toString();
			$.insertHTML(nodes[mode],html,"beforeend");
			checkHeader(nodes[mode]);
		};
		var setData = function(list){
			dataPool = {};
			if($.isArray(list)){
				for(var i=0,count=list.length;i<count;i++){
					var mode = list[i].mode || "private";
					if(!pubG){ mode = "private"} 
					dataPool[mode] = dataPool[mode] || [];
					dataPool[mode].push(list[i]);
				}
			}
			renderData();
		};
		var getData = function(){
			var data = [];
			var inputs = $.sizzle('input[action-type="select"]',outer);
			for(var i = inputs.length;i--;){
				var item = {};
				if(inputs[i].checked){
					var group = checkGroup(inputs[i]);
					if (group) {
						item.gid = inputs[i].value;
						item.desc = group.input.value || $.decodeHTML(group.text.innerHTML);//encodeURIComponent
						data.push(item);
					}
				}
			}
			return data;
		};
		var reset = function(){
			renderData();
		};
		var clear = function(){
			dataPool = {};
			renderData();
		};
		var destroy = function(){
			dEvent.destroy();
			checkedList = null;
			dataPool = null;
			nodes = null;
			outer = null;
		};
		var length = function(){
			var inputs = $.sizzle('input[action-type="select"]',outer);
			return inputs.length;
		};
		
		init();
		
		that.getOuter = getOuter;
		that.length = length;
		that.add = add;
		that.setData = setData;
		that.getData = getData;
		that.reset = reset;
		that.clear = clear;
		that.destroy = destroy;
		
		return that;
		
	};
});