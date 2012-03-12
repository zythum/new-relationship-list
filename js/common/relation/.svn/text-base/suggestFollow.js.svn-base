/**
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 * 推荐关注
 */
$Import('ui.litePrompt');
$Import('kit.extra.merge');
$Import('kit.dom.parseDOM');
$Import('kit.extra.language');
$Import('common.dialog.setGroup');
$Import('common.relation.followPrototype');
STK.register('common.relation.suggestFollow', function($){
	return function(node){
		var that	= {},
			$L		= $.kit.extra.language,
			dEvent	= $.core.evt.delegatedEvent(node),
			groupDialog = $.common.dialog.setGroup(),
			imgUrl	= $CONFIG['imgPath'],
			temp	= {
				'opened': 
					'<a href="javascript:;">#L{收起推荐}</a>'+
					'<a href="javascript:;" title="#L{收起}" class="W_Titarr_on"></a>',
					
				'closed': 
					'<a href="javascript:;">#L{展开推荐}</a>'+
					'<a href="javascript:;" title="#L{展开}" class="W_Titarr_off"></a>',
					
				'followed': 
					'<a class="W_addbtn_es" href="javascript:;"><img src="'+imgUrl+'/style/images/common/transparent.gif" alt="" class="addicon">#L{已关注}</a>'
			},
			msg		= {
				'followOK': '#L{加关注成功}',
				'follow': '#L{加关注}',
				'followed': '#L{已关注}'
			},
			opened	= true,
			relation= $.common.relation.followPrototype,
			status	= 0,
			nodes;
		
		var setContent = function(html){
			opened = true;
			if(html){
				node.innerHTML = html;
				node.style.display = '';
				parseDOM();
			} else{
				node.style.display = 'none';
				node.innerHTML = '';
			}
		};
		
		var getParent = function(el, tagName){
			var currEl = el, rsEl; 
			while(currEl && currEl.tagName.toLowerCase() !== 'body'){
				if(currEl.tagName.toLowerCase() === tagName){
					rsEl = currEl;
					break;
				}
				currEl = currEl.parentNode;
			}
			return rsEl;
		};
		
		var bindDOMFuns = {
			'selectAll'	: function(spec){
				var selA = spec.el,
					list = $.sizzle('input[node-type="checkbox"]', node),
					temp = selA.checked;
				for(var i= list.length;i--;){
					list[i].checked = temp;
				}
				status = temp ? 0 : -list.length;
			},
			
			'checked': function(spec){
				status += spec.el.checked ? 1 : -1;
				nodes['selectAll'].checked = status >= 0;
			},
			
			'followAll'	: function(spec){
				var list = $.sizzle('input[node-type="checkbox"]', node),
					uids = [], uidItems = [], item;
				for(var i= list.length;i--;){
					item = list[i];
					if(item.checked){
						uidItems.push(item);
						uids.push(item.getAttribute('uid'));
					}
				}
				
				var conf = {
					'uid': uids.join(','),
					'onSuccessCb': function(){
						$.ui.litePrompt($L(msg['followOK']),{'type':'succM','timeout':'500','hideCallback':function(){
							if(uidItems.length === list.length){
								setContent();
								return;
							}
							$.fireEvent(nodes['on-off'], 'click');
							var curEl;
							for(var i=uidItems.length;i--;){
								curEl = getParent(uidItems[i], 'dl');
								$.core.dom.removeNode(curEl);
							}
						}});
					}
				};
				/**
				 * Diss
				 */
				conf = $.module.getDiss(conf, spec.el);
				relation.follow(conf);
			},
			
			'onOff'		: function(spec){
				opened = !opened;
				var inner = opened ? temp['opened'] : temp['closed'];
				nodes['suggestPanel'].style.display = opened ? '' : 'none';
				spec.el.innerHTML = $L(inner);
			},
			
			'follow'	: function(spec){
				var curEl	= spec.el,
					conf	= $.kit.extra.merge({
						'onSuccessCb': function(data){
							curEl.parentNode.innerHTML = $L(temp['followed']);
							groupDialog.show({
								'uid': data.uid,
								'fnick': data.fnick,
								'groupList': data.group,
								'hasRemark': true
							});
						}
					}, spec.data || {});
				conf = $.module.getDiss(conf, spec.el);
				relation.follow(conf);
			}
		};
		
		var parseDOM = function(){
			var buildDom = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(buildDom.list);
			nodes['on-off'] = $.sizzle('span[action-type="on-off"]', node)[0];
		};
		
		var bindDOM = function(){
			dEvent.add('followBtn', 'click', bindDOMFuns.follow);
			dEvent.add('on-off', 'click', bindDOMFuns.onOff);
			dEvent.add('followAll', 'click', bindDOMFuns.followAll);
			dEvent.add('selectAll', 'click', bindDOMFuns.selectAll);
			dEvent.add('checkbox', 'click', bindDOMFuns.checked);
		};
		
		var init = function(){
			parseDOM();
			bindDOM();
		};
		
		var destroy = function(){
			dEvent.destroy();
			groupDialog.destroy();
			nodes = null;
		};
		
		that.destroy = destroy;
		that.setContent = setContent;
		init();
		
		return that;
	};
});
