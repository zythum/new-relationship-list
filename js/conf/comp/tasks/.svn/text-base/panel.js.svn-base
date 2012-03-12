/**
 * 微博宝典
 * @id $.common.guide.tasks
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author jiequn | jiequn@staff.sina.com.cn
 * @example
 */
$Import('ui.alert');
$Import('ui.litePrompt');
$Import('kit.extra.language');
$Import('kit.dom.parseDOM');
$Import('common.trans.tasks');
$Import('common.depand.tasks');
STK.register('comp.tasks.panel', function($) {
	return function(node){
		var pCache	= {},
			hasContent = false,
			require	= $.common.depand.tasks,
			lang = $.kit.extra.language,
			prePage, current, dEvent, nodes, isOpened, loadEl;
			
		var map = ['start', 'photo', 'comment', 'mobile', 'follow', 'publisher', 'invite', 'finish'];
		
		var template = 
			'<div node-type="outer" style="width:530px;display:none;position:absolute;" class="page loading">'+
				'<i></i><span></span>'+
			'</div>';
	
		var that = {
			'bindEvent': function(action, type, fun){
				dEvent.add(action, type, fun);
			},
			
			'show': function(index){
				isOpened = true;
				nodes['switchBtn'].className = 'W_Titarr_on';
				nodes['pageBox'].style.display = '';
				window.SUDA&& window.SUDA.uaTrack && window.SUDA.uaTrack('tblog_baodian','baodian_unfold');
			},
			
			'hide': function(){
				isOpened = false;
				nodes['switchBtn'].className = 'W_Titarr_off';
				nodes['pageBox'].style.display = 'none';
				window.SUDA&& window.SUDA.uaTrack && window.SUDA.uaTrack('tblog_baodian','baodian_fold');
			},
			
			'loading': function(){
				//TODO页面进入Loading状态
				var height = nodes['pageBox'].offsetHeight - 8;
				nodes['pageBox'].style.position = 'relative';
				loadEl.style.height = height + 'px';
				loadEl.style.display = '';
				$.log('loading...');
			},
			
			'stopLoading': function(){
				//TODO页面进入stopLoading状态
				nodes['pageBox'].style.position = '';
				loadEl.style.display = 'none';
				$.log('stopLoading...');
			}
		};
		
		var pageFuncs = {
			'publisher': require.bind('publisher', function(elList){
				$.comp.tasks.publisher(elList, that);
			}),
			'comment': require.bind('comment', function(elList){
				$.comp.tasks.comment(elList, that);
			}),
			'invite': require.bind('invite', function(elList){
				$.comp.tasks.invite(elList, that);
			}),
			'follow': require.bind('follow', function(elList){
				$.comp.tasks.follow(elList, that);
			})
		};
		
		var parms = {
			'onSuccess': function(rs, parm){
				that.stopLoading();
				var data	= rs['data'],
					build	= $.core.dom.builder(data.html),
					elList	= $.kit.dom.parseDOM(build.list),
					index	= map[parm['index']],
					pageFun	= pageFuncs[index];
				pCache[index] = elList['outer'];
				
				//先隐藏起来，防止添加进去时会有残影
				typeof pageFun === 'function' && pageFun(elList);
				elList['outer'].style.display = 'none';
				nodes['pageBox'].appendChild(elList['outer']);
				
				
				if(rs.data && rs.data.info){
					$.ui.litePrompt(rs.data.info, {
						'type':'succM',
						'timeout':2000
					});
				}
				
				if(!parm['index']){ //单独处理当前无index时
					current	= map[data.index];
					index	= current;
					pageFun	= pageFuncs[index];
					pCache[index] = elList['outer'];
					typeof pageFun === 'function' && pageFun(elList);
					elList['outer'].style.display = '';
				}else if(data['index'] === parm['index']){
					prePage = current;
					current = map[data.index];
					prePage && (pCache[prePage].style.display = 'none');
					elList['outer'].style.display = '';
				}
				hasContent = true;
			},
			'onError': function(rs){
				that.stopLoading();
				rs && rs['msg'] && $.ui.alert(rs['msg']);
			},
			'onFail': function(rs){
				that.stopLoading();
				rs && rs['msg'] && $.ui.alert(rs['msg']);
			}
		};
		
		var getTask = $.common.trans.tasks.getTrans('getTask', parms);
		
		var bindDOMFuns = {
			'navClick': function(spec){
				var index = spec.data && spec.data.index;
				var from = spec.data && spec.data.from;
				if(!index && current === map[index]){ return; }
				var tempEL	= pCache[map[index]];
				if(tempEL){
					prePage = current;
					current = map[index];
					$.setStyle(pCache[prePage], 'display', 'none');
					$.setStyle(tempEL, 'display', '');
				} else{
					that.loading();
					getTask.request({ 'index': index,'from':from});
				}
			},
			
			'openPanel': function(spec){
				$.preventDefault();
				if (!hasContent) {
					//单独处理第一次点击展开获取内容 
					getTask.request();
					that.show();
					return; 
				}
				isOpened = !isOpened;
				isOpened ? that.show() : that.hide();
			}
		};
		
		var bindDOM = function(){
			dEvent = $.delegatedEvent(node);
			dEvent.add('openPanel', 'click', bindDOMFuns['openPanel']);
			dEvent.add('navClick', 'click', bindDOMFuns['navClick']);
		};
		
		var init = function(){
			parseDOM();
			bindDOM();
			nodes['pageBox'].appendChild(loadEl);
			isOpened = nodes['pageBox'].style.display !== 'none';
			var temp = $.sizzle('p[action-type="openPanel"]', node)[0],
				data = $.queryToJson(temp.getAttribute('action-data')),
				index = data.index;
			//getTask.request({ 'index': index });
			if(data.isShow){
				getTask.request(); //如果初始化当前需要展开
			}
			//getTask.request();
			current =  map[index];
		};
		
		var parseDOM = function(){
			var buildDom = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(buildDom.list);
			var buildTem = $.core.dom.builder(template);
			loadEl = buildTem.list.outer[0];
		};
		
		var destroy = function(){
			dEvent.destroy();
			dEvent = null;
			nodes = null;
		};
		
		init();
		
		that.destroy = destroy;
		return that;
	};
});