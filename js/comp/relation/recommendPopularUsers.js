/**
 * 人气用户推荐
 * @author Runshi Wang | runshi@staff.sina.com.cn
 */
$Import('common.depand.recommendPopularUsers');
$Import('common.trans.relation');
$Import('common.channel.relation');
$Import('common.relation.followPrototype');
$Import('kit.extra.language');
$Import('kit.dom.parseDOM');
$Import('kit.dom.firstChild');
$Import('common.dialog.setGroup');
$Import('kit.extra.merge');

STK.register('comp.relation.recommendPopularUsers', function($){
	var MINCOUNT	= 3;
	
	var	dataArr = [],
		locked	= false,
		//是否在加载状态[如果处在加载状态，则在感兴趣的人获取到后，自动进行面板绘制
		loading	= false,
		$L		= $.kit.extra.language,
		loadTemp= '<p style="padding-bottom:10px;">#L{系统正在努力寻找}...</p>',
		require	= $.common.depand.recommendPopularUsers;
		
	/**
	 * 获取用户池内的剩余数量
	 */
	var getCount = function(){
		return dataArr.length || 0;
	};
	
	/**
	 * 用于检测目标node内是否存在子节点
	 * @param {Node} node
	 */
	var hasChilds = function(node){
		return node.children.length;
	};
	
	/**
	 * 从感兴趣的人内获取指定数量用户,从数组头部开始获取
	 * @param {Number} count 要获取的个数
	 */
	var getItemHTMLInArr = function(count){
		var _arr = [];
		if (!isNaN(count)) {
			_arr = dataArr.splice(0, count);
		}
		return _arr;
	};
	
	/**
	 * 更新dataArr
	 * @param {Array} pList 需要添加到dataArr内的数据源
	 */
	var updateDataArr = function(pList){
		pList.length && (dataArr = dataArr.concat(pList));
	};
	
	/**
	 * 获取需要排除掉的uid序列
	 * @param {String} html
	 */
	var getExclude = function(html){
		var uids	= [],
			html	= html || '';
		html.replace(/action-data="uid=([^\&]*?)"/g, function(a,b){
			uids.push(b);
		});
		return uids;
	};
	
	/**
	 * 获取指定父节点
	 * @param {Object} el
	 * @param {Object} tagName
	 */
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
	return function(node){
		//-------------变量定义区-START--------------
		var that	= {},
			rAjax	= $.common.trans.relation,
			dEvent	= $.core.evt.delegatedEvent(node),
			fChannel= $.common.channel.relation,
			ioFollow= $.common.relation.followPrototype,
			groupDialog = $.common.dialog.setGroup(),
			nodes, cardPlugin, exclude_uids;
			
		//-------------变量定义区--END---------------
		/**
		 * 动画替换效果
		 * @param {Node} node
		 * @param {String} html
		 */
		var aniChange = function(node, html, cb){
			var endFun = function(){
				if (html) {
					node.innerHTML = html;
					$.core.dom.setStyle(node, 'opacity', 1);
					typeof cb === 'function' && cb();
					autoHide();
				} else {
					$.core.dom.removeNode(node);
					if (!hasChilds(nodes['interest_panel'])) {
						drawInterest(nodes['interest_panel'], MINCOUNT)
						ioFuns.getInterest();
					} else {
						autoHide();
					}
				}
			};
			var ani = $.core.ani.tween(node, {
				'end': endFun,
				'duration': 200,
				'animationType': 'easeoutcubic'
			});
			
			ani.play({'opacity' : 0});
		};
		
		var getDisplayCount = function(){
			return $.core.dom.sizzle('a[action-type="followBtn"]', node).length;
		};
		
		var autoHide = function(){
			var length = getDisplayCount() + getCount();
			if(getDisplayCount() + getCount() <= 0){
				$.setStyle(node, "display", "none");
			}
		};
		
		/**
		 * 绘制可能感兴趣的人(单条/面板绘制都可使用)
		 * 考虑到可能会改变实现方式，先单独提出来
		 * @param {Node} 需要更新的Node
		 * @param {Number} count
		 */
		var drawInterest = function(node, count){
			var interArr	= getItemHTMLInArr(count),//从dataArr数据源内取出count个推荐用户
				interHTML	= interArr.join(''),
				interArrLen	= interArr.length;
			if(count > 1){//全部列表更新
				if(interArrLen){//如果取出的用户数不为零，则表述数据池内还有数据
					loading = false;//解除loading状态
					aniChange(node, interHTML, function(){
						var moreBtns = $.sizzle('a.W_moredown', node);
						for (var i = 0, len = moreBtns.length; i < len; i++) {
							if(moreBtns[i]){
								$.core.evt.fireEvent(moreBtns[i], 'click');
								break;
							}
						}
					});
				} else {//如果取出的用户数为零，则数据池内的用户已经为空
					 loading = true;//进入loading状态
					 node.innerHTML = $L(loadTemp);
				}
			} else if(count === 1){//等于1时，默认为只做单条的更新
				//去掉html外部的dl
				var html =  interHTML.replace(/(<dl\s*[^>]*>)|(<\/dl>)/gi, '');
					html = $.core.str.trim(html);
				aniChange(node, html, function(){
					var fst = $.kit.dom.firstChild(node.parentNode);
					if(fst == node){
						var moreBtn = $.sizzle('a.W_moredown', node)[0];
						moreBtn && $.core.evt.fireEvent(moreBtn, 'click');
					}
				});
			}
		};
		//------AJAX信息获取定义区-START--------------
		var ioFuns = {
			/**
			 * 异步获取感兴趣的人
			 */
			getInterest: (function(){
				var updateView = function(){
					if(loading){
						setTimeout(function(){
							drawInterest(nodes['interest_panel'], MINCOUNT);
						}, 500);
					}
					nodes['changeBtn'].style.display = getCount() ? '' : 'none';
					loading = false;//loading状态终止
				}
				/**
				 * ajax感兴趣的人数据源回调函数注册(一次获取27人)
				 */
				var onComplete = function(rs, param){
					locked	= false;
					var code 	= rs.code,
						data	= rs.data;
					if(code === '100000'){
						updateDataArr(data.list || []);
					}
					if(getCount()){
						updateView();
					} else {
						autoHide(); //怎么找也找不到了
					}
				};
				var onFail = function(rs, param){
					locked	= false;
					updateView();
				};
				var myInterest = rAjax.getTrans('recommendPopularUsers', {
					'onComplete': onComplete,
					'onFail'	: onFail
				});
				return function() {
					if(locked){ return; }
					locked = true;
					var uids = getExclude(nodes['interest_panel'].innerHTML);
					myInterest.request({
						'exclude_uids': uids.join(',')
					});
				}
			})(),
			
			/**
			 * 不感兴趣的人
			 * @param {Node} node 需要更新的节点
			 * @param {Object} uid 需要删除的uid
			 */
			unInterest: (function(){
				var unInteres = rAjax.getTrans('uninterested');
				return function(uid) {
					unInteres.request({
						'uid': uid
					});
				}
			})()
		};
		//------AJAX信息获取定义区---END--------------
		
		//-------DOM事件回调函数定义区-START----------
		var denKey = 'recommendPopularUsers_userCard';
		
		var show = require.bind(denKey, function(node, ucData, event){
			cardPlugin || (cardPlugin = $.common.layer.userCard(node, { 'order': 'l' }));
			cardPlugin.showCard(node, ucData, event);
		});
		
		var hide = require.bind(denKey, function(node, ucData, event){
			cardPlugin || (cardPlugin = $.common.layer.userCard(node, { 'order': 'l' }));
			cardPlugin.hideCard(node, ucData, event);
		});
		
		var bindDOMFuns = {
			showCard: function(evt){
				var event	= $.fixEvent(evt),
					node	= event.target,
					ucData	= node.getAttribute('usercard');
				if (!ucData) { return; }
				show(node, ucData, event);
			},
			
			hideCard: function(evt){
				var event	= $.fixEvent(evt),
					node	= event.target,
					ucData	= node.getAttribute('usercard');
				if (!ucData) { return; }
				hide(node, ucData, event);
			},
			
			initDataArr: function(){
				!getCount() && ioFuns.getInterest();
				$.removeEvent(node, 'mouseover', bindDOMFuns.initDataArr);
			},
			
			interestMouseover: function(spec){
				spec.el.className = 'interPer clearfix interPerHover';
			},
			
			interestMouseout: function(spec){
				spec.el.className = 'interPer clearfix';
			},
			
			/**
			 * 当点击事件触发点为：换一换 按钮时
			 */
			changeBtnClick: function(spec){
				//重绘面板后，如果池内的用户少于一定数量，则进行新用户获取
				(getCount() <= 6) && ioFuns.getInterest();
				//重新绘制全部换一换面板
				drawInterest(nodes['interest_panel'], MINCOUNT);
				return false;
			},
			
			/**
			 * 单元素替换
			 * @param {Object} currEl
			 */
			changeOneInterest: function(currEl){
				if( !currEl ) { return; }
				var d = getParent(currEl, 'dl');
				drawInterest(d, 1);
			},
			
			/**
			 * 当点击事件触发点为：不感兴趣 按钮时
			 * @param {Node} currEl 触发事件的 按钮
			 */
			unInterestBtnClick: function(spec) {
				var uid = spec.data.uid;
				bindDOMFuns.changeOneInterest(spec.el);
				ioFuns.unInterest(uid);
				return false;
			},
			
			/**
			 * 当点击事件触发点为：加关注
			 * @param {Node} currEl 触发事件的 按钮
			 */
			followBtnClick: function(spec) {
				var conf = $.kit.extra.merge({
					'onSuccessCb': function(spec){
						groupDialog.show({
							'uid': spec.uid,
							'fnick': spec.fnick,
							'groupList': spec.group,
							'hasRemark': true
						});
					}
				}, spec.data || {});
				/**
				 * Diss
				 */
				conf = $.module.getDiss(conf, spec.el);
				ioFollow.follow(conf);
			},
			
			morePanelOnOff: function(spec){
				var morePanel	= $.core.dom.next( getParent(spec.el, 'dd') ),
					pStyle		= morePanel.style,
					status		= (pStyle.display === 'none');
				pStyle.display = status ? '' : 'none';
				spec.el.className = status ? 'W_moreup' : 'W_moredown';
			},
			
			sudaBind: function(e){
				var target = $.fixEvent(e).target;
				var data = target.getAttribute('suda-data');
				if(data && data.indexOf('http') === -1){
					target.setAttribute('suda-data',data+':'+window.location.href);
				}
			}
		};
		//-------DOM事件回调函数定义区--END-----------
		
		var bindListenerFuns = {
			'followListener': function(spec){
				var currEl	= $.core.dom.sizzle('a[action-data*="uid='+spec.uid+'"]', node)[0];
				bindDOMFuns.changeOneInterest(currEl);
				if(!cardPlugin) return;
				cardPlugin.userCard.stopShow();
				cardPlugin.userCard.hideCard();
				setTimeout(function(){
					cardPlugin.userCard.hideCard();//有时候名片卡关不掉...
				}, 50);
			}
		};
		
		//---------DOM事件绑定定义区-START------------
		var bindDOM = function(){
			$.addEvent(node, 'mouseover', bindDOMFuns.initDataArr);
			$.addEvent(node, 'mouseover', bindDOMFuns.showCard);
			$.addEvent(node, 'mouseout', bindDOMFuns.hideCard);
			dEvent.add('showchange', 'mouseover', bindDOMFuns.interestMouseover);
			dEvent.add('showchange', 'mouseout', bindDOMFuns.interestMouseout);
			dEvent.add('unInterest', 'click', bindDOMFuns.unInterestBtnClick);
			dEvent.add('change', 'click', bindDOMFuns.changeBtnClick);
			dEvent.add('followBtn', 'click', bindDOMFuns.followBtnClick);
			dEvent.add('moreMsg', 'click', bindDOMFuns.morePanelOnOff);
			$.addEvent(node, 'click', bindDOMFuns.sudaBind);
		};
		//---------DOM事件绑定定义区--END-------------
		
		var bindListener = function(){
			fChannel.register('follow', bindListenerFuns.followListener);
		};
		
		//----------组建初始化定义区-START------------
		var init = function(){
			argsCheck();
			parseDOM();
			bindDOM();
			bindListener();
		};
		//----------组建初始化定义区--END-------------
		
		//------------参数验证定义区-START------------
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.content.homeInterest]:node is not a Node!";
			}
		};
		//------------参数验证定义区--END-------------
		
		//-----------DOM获取函数定义区-START----------
		var parseDOM = function(){
			var buildDom = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(buildDom.list);
		};
		//-----------DOM获取函数定义区--END-----------

		//---------组件公开方法的定义区-START----------
		var destroy = function(){
			cardPlugin.destroy();
			groupDialog.destroy();
			$.removeEvent(node, 'click', bindDOMFuns.sudaBind);
			$.removeEvent(node, 'mouseover', bindDOMFuns.initDataArr);
			$.removeEvent(node, 'mouseover', bindDOMFuns.showCard);
			$.removeEvent(node, 'mouseout', bindDOMFuns.hideCard);
			fChannel.remove('follow', bindListenerFuns.followListener);
			dEvent.remove('showchange', 'mouseover');
			dEvent.remove('showchange', 'mouseout');
			dEvent.remove('unInterest', 'click');
			dEvent.remove('change', 'click');
			bindListenerFuns = null;
			bindDOMFuns = null;
			fChannel = null;
			dEvent = null;
			nodes = null;
		};
		//---------组件公开方法的定义区--END-----------
		
		//---------------执行初始化-START--------------
		init();
		//---------------执行初始化--END---------------
		
		//--------组件公开属性或方法赋值区-START--------
		that.destroy = destroy;
		//--------组件公开属性或方法赋值区--END---------
		return that;
	}
});